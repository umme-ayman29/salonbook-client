"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function ProfileForm() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [saving, setSaving] = useState(false);

  if (isPending || !session) return <p>Loading profile...</p>;
  const user = session.user as { name: string; email: string; image?: string | null; phone?: string };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    if (!name) return toast.error("Name is required");

    setSaving(true);
    try {
      await apiFetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image: String(form.get("image")).trim(),
          phone: String(form.get("phone")).trim(),
        }),
      });
      toast.success("Profile updated");
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const input = "w-full rounded border p-2";

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Email (cannot be changed)</label>
          <input value={user.email} disabled className={`${input} bg-gray-100`} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Name</label>
          <input name="name" defaultValue={user.name} required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Profile Image URL</label>
          <input name="image" defaultValue={user.image ?? ""} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-sm">Phone</label>
          <input name="phone" defaultValue={user.phone ?? ""} className={input} />
        </div>
        <button disabled={saving} className="w-full rounded bg-rose-600 p-2 text-white disabled:opacity-60">
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}