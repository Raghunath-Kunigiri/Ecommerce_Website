import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-1)] p-8 shadow-[0_30px_80px_-65px_rgba(0,0,0,0.30)]">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Sign in to access the admin dashboard.
        </p>
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-sm text-[color:var(--muted)]">
                Loading…
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
        <div className="mt-6 text-xs text-[color:var(--muted)]">
          Default seed admin: <span className="font-semibold">admin@likithasweets.com</span> /
          <span className="font-semibold"> admin123</span>
        </div>
      </div>
    </div>
  );
}

