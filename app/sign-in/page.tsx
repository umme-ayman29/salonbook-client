"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));

    setLoading(true);
    const { data, error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      return toast.error(error.message || "Sign in failed");
    }
    toast.success("Signed in successfully");
    const role = (data?.user as { role?: string } | undefined)?.role;
    router.push(role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
  }

  async function handleGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard/customer",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-2xl font-bold text-rose-700">Sign In</h1>

        <input name="email" type="email" required placeholder="Email"
          className="w-full rounded border p-2" />
        <input name="password" type="password" required placeholder="Password"
          className="w-full rounded border p-2" />

        <button disabled={loading}
          className="w-full rounded bg-rose-600 p-2 text-white disabled:opacity-60">
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button type="button" onClick={handleGoogle}
          className="w-full rounded border p-2">
          Continue with Google
        </button>

        <p className="text-sm">
          New here?{" "}
          <Link href="/sign-up" className="text-rose-600 underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}