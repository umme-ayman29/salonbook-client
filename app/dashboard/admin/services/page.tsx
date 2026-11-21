"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setServices(await apiFetch("/api/services/admin/all"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(s: Service) {
    const status = s.status === "active" ? "inactive" : "active";
    try {
      await apiFetch(`/api/services/${s._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      toast.success(`Service ${status === "active" ? "activated" : "deactivated"}`);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await apiFetch(`/api/services/${deleteId}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  if (loading) return <p>Loading services...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Link
          href="/dashboard/admin/services/add"
          className="rounded bg-rose-600 px-4 py-2 text-sm text-white"
        >
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-500">No services yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border text-left text-sm">
            <thead className="bg-rose-50">
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Category</th>
                <th className="p-2">Price</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="h-12 w-12 rounded object-cover" />
                  </td>
                  <td className="p-2">{s.serviceName}</td>
                  <td className="p-2">{s.category}</td>
                  <td className="p-2">৳{s.price}</td>
                  <td className="p-2">{s.duration} min</td>
                  <td className="p-2">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="space-x-2 p-2">
                    <Link
                      href={`/dashboard/admin/services/${s._id}/edit`}
                      className="text-blue-600 underline"
                    >
                      Edit
                    </Link>
                    <button onClick={() => toggleStatus(s)} className="text-amber-600 underline">
                      {s.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => setDeleteId(s._id)} className="text-red-600 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded bg-white p-6">
            <p className="mb-4">Are you sure you want to delete this service?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="rounded border px-3 py-1">
                Cancel
              </button>
              <button onClick={confirmDelete} className="rounded bg-red-600 px-3 py-1 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}