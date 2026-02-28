"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = useMemo(() => sp.get("callbackUrl") ?? "/admin", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        try {
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
          });
          if (!res || res.error) {
            const msg =
              res?.error === "CredentialsSignin"
                ? "Invalid email or password."
                : res?.error === "Configuration"
                  ? "Auth is not configured. Add DATABASE_URL and NEXTAUTH_SECRET to your .env.local."
                  : "Unable to sign in. Please try again.";
            setError(msg);
            return;
          }
          router.push(res.url ?? callbackUrl);
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          placeholder="admin@likithasweets.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--fg)]">
          {error}
        </div>
      ) : null}

      <Button className="w-full" size="lg" disabled={pending} type="submit">
        {pending ? <Loader2 className="animate-spin" /> : null}
        Sign in
      </Button>
    </form>
  );
}

