"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

const categories = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const price = Number(form.get("price"));
    const duration = Number(form.get("duration"));
    const image = form.get("image") as File;

    if (!(price > 0)) return toast.error("Price must be a positive number");
    if (!(duration > 0)) return toast.error("Duration must be a positive number");
    if (!image || image.size === 0) return toast.error("Please select a service image");

    setLoading(true);
    try {
      await apiFetch("/api/services", { method: "POST", body: form });
      toast.success("Service added successfully");
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const input = "w-full rounded border p-2";

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Add Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="serviceName" required placeholder="Service Name" className={input} />

        <select name="category" required className={input} defaultValue="">
          <option value="" disabled>Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <textarea name="description" required rows={4} placeholder="Description" className={input} />

        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" min="1" step="any" required placeholder="Price" className={input} />
          <input name="duration" type="number" min="1" required placeholder="Duration (minutes)" className={input} />
        </div>

        <div>
          <label className="mb-1 block text-sm">Service Image</label>
          <input name="image" type="file" accept="image/*" required className={input} />
        </div>

        <select name="status" defaultValue="active" className={input}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button disabled={loading} className="w-full rounded bg-rose-600 p-2 text-white disabled:opacity-60">
          {loading ? "Adding..." : "Add Service"}
        </button>
      </form>
    </div>
  );
}