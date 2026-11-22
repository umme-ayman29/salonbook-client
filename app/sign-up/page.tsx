"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import GoogleButton from "@/components/GoogleButton";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    const imageUrl = String(form.get("imageUrl") || "").trim();
    const file = form.get("imageFile");

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

    let image: string | undefined = imageUrl || undefined;

    if (file instanceof File && file.size > 0) {
      const upload = new FormData();
      upload.append("image", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: upload });
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          return toast.error(data.message || "Image upload failed");
        }
        image = data.url;
      } catch {
        setLoading(false);
        return toast.error("Image upload failed");
      }
    }

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image,
    });
    setLoading(false);

    if (error) {
      return toast.error(error.message || "Sign up failed");
    }
    toast.success("Account created successfully");
    router.push("/dashboard/customer");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50 px-4 py-10">
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Profile Image (upload a file or paste a URL)
          </label>
          <input name="imageFile" type="file" accept="image/*" onChange={handleFileChange}
            className="w-full rounded border p-2 text-sm" />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview"
              className="h-20 w-20 rounded-full border object-cover" />
          )}
          <input name="imageUrl" placeholder="Or paste Image URL (optional)"
            className="w-full rounded border p-2" />
        </div>

        <button disabled={loading}
          className="w-full rounded bg-rose-600 p-2 text-white disabled:opacity-60">
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          or
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <GoogleButton label="Sign up with Google" />

        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-rose-600 underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}