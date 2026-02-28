import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const devSecret = "dev-secret-change-me";
const authSecret =
  process.env.NEXTAUTH_SECRET ?? (process.env.NODE_ENV === "development" ? devSecret : undefined);

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  adapter: process.env.DATABASE_URL ? PrismaAdapter(prisma) : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Local-dev fallback when DATABASE_URL isn't configured.
        if (!process.env.DATABASE_URL) {
          const adminEmail = process.env.ADMIN_EMAIL ?? "admin@likithasweets.com";
          const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
          if (
            parsed.data.email.toLowerCase() !== adminEmail.toLowerCase() ||
            parsed.data.password !== adminPassword
          ) {
            return null;
          }
          return {
            id: "dev_admin",
            name: "Admin",
            email: adminEmail,
            role: "ADMIN" as const,
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, name: true, email: true, image: true, role: true, passwordHash: true },
        });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const role = (user as { role?: "USER" | "ADMIN" }).role;
        if (role) {
          token.role = role;
        } else if (process.env.DATABASE_URL) {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
          });
          token.role = dbUser?.role ?? "USER";
        } else {
          token.role = user.id === "dev_admin" ? "ADMIN" : "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role;
      }
      return session;
    },
  },
};

