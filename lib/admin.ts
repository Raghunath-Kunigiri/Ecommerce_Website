import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = session?.user?.role;
  if (!session?.user?.id) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (role !== "ADMIN") {
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, session };
}

