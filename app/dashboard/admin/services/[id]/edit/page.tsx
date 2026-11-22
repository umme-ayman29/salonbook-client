"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiFetch, publicFetch } from "@/lib/api";

const categories = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

type Svc = {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [svc, setSvc] = useState<Svc | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    publicFetch(`/api/services/${id}`)
      .then(setSvc)
      .catch((e) => toast.error((e as Error).message));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!(Number(form.get("price")) > 0)) return toast.error("Price must be a positive number");
    if (!(Number(form.get("duration")) > 0)) return toast.error("Duration must be a positive number");

    const file = form.get("image") as File;
    if (!file || file.size === 0) form.delete("image");

    setSaving(true);
    try {
      await apiFetch(`/api/services/${id}`, { method: "PUT", body: form });
      toast.success("Service updated");
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (!svc) return <p>Loading service...</p>;
  const input = "w-full rounded border p-2";

  return (
    <div className="max-w-xl">
      <h1 className="mb-4 text-2xl font-bold">Update Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="serviceName" required defaultValue={svc.serviceName} className={input} />
        <select name="category" required defaultValue={svc.category} className={input}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea name="description" required rows={4} defaultValue={svc.description} className={input} />
        <div className="grid grid-cols-2 gap-4">
          <input name="price" type="number" min="1" step="any" required defaultValue={svc.price} className={input} />
          <input name="duration" type="number" min="1" required defaultValue={svc.duration} className={input} />
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={svc.image} alt="" className="mb-2 h-24 rounded object-cover" />
          <label className="mb-1 block text-sm">New image (optional)</label>
          <input name="image" type="file" accept="image/*" className={input} />
        </div>
        <select name="status" defaultValue={svc.status} className={input}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button disabled={saving} className="w-full rounded bg-rose-600 p-2 text-white disabled:opacity-60">
          {saving ? "Saving..." : "Update Service"}
        </button>
      </form>
    </div>
  );
}