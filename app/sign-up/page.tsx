"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    const image = String(form.get("image")).trim();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      return toast.error("Password must have an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      return toast.error("Password must have a lowercase letter");
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: image || undefined,
    });
    setLoading(false);

    if (error) {
      return toast.error(error.message || "Sign up failed");
    }
    toast.success("Account created successfully");
    router.push("/dashboard/customer");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow"
      >
        <h1 className="text-2xl font-bold text-rose-700">Create Account</h1>

        <input name="name" required placeholder="Full Name"
          className="w-full rounded border p-2" />
        <input name="email" type="email" required placeholder="Email"
          className="w-full rounded border p-2" />
        <input name="password" type="password" required placeholder="Password"
          className="w-full rounded border p-2" />
        <input name="image" placeholder="Profile Image URL (optional)"
          className="w-full rounded border p-2" />

        <button disabled={loading}
          className="w-full rounded bg-rose-600 p-2 text-white disabled:opacity-60">
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-rose-600 underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}