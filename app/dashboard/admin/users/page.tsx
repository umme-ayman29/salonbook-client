"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  isBlocked?: boolean;
  createdAt: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<User | null>(null);
  const [target, setTarget] = useState<User | null>(null);

  const load = useCallback(async () => {
    try {
      setUsers(await apiFetch("/api/users"));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleBlock() {
    if (!target) return;
    const block = !target.isBlocked;
    try {
      await apiFetch(`/api/users/${target._id}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: block }),
      });
      toast.success(block ? "User blocked" : "User unblocked");
      setTarget(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Manage Users</h1>
      {users.length === 0 ? (
        <p className="text-gray-500">No registered customers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border text-left text-sm">
            <thead className="bg-rose-50">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Joined</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span className={`rounded px-2 py-1 text-xs ${u.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {u.isBlocked ? "blocked" : "active"}
                    </span>
                  </td>
                  <td className="space-x-2 p-2 whitespace-nowrap">
                    <button onClick={() => setDetails(u)} className="text-blue-600 underline">Details</button>
                    <button onClick={() => setTarget(u)} className={u.isBlocked ? "text-green-600 underline" : "text-red-600 underline"}>
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded bg-white p-6">
            <p className="mb-4">{target.isBlocked ? "Unblock" : "Block"} {target.name}?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setTarget(null)} className="rounded border px-3 py-1">No</button>
              <button onClick={toggleBlock} className="rounded bg-rose-600 px-3 py-1 text-white">Yes</button>
            </div>
          </div>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold">User Details</h2>
            <ul className="space-y-1 text-sm">
              <li><b>Name:</b> {details.name}</li>
              <li><b>Email:</b> {details.email}</li>
              <li><b>Phone:</b> {details.phone || "—"}</li>
              <li><b>Joined:</b> {new Date(details.createdAt).toLocaleString()}</li>
              <li><b>Status:</b> {details.isBlocked ? "Blocked" : "Active"}</li>
            </ul>
            <div className="mt-4 text-right">
              <button onClick={() => setDetails(null)} className="rounded border px-3 py-1">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}