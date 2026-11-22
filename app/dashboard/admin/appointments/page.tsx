"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

type Appt = {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  service?: { serviceName: string; category: string };
  customer?: { name: string; email: string };
};

const badge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-600",
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-red-100 text-red-700",
};

export default function ManageAppointmentsPage() {
  const [list, setList] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [details, setDetails] = useState<Appt | null>(null);

  const load = useCallback(async () => {
    try {
      setList(await apiFetch("/api/appointments/admin/all"));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirm(id: string) {
    try {
      await apiFetch(`/api/appointments/${id}/confirm`, { method: "PATCH" });
      toast.success("Appointment confirmed");
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  async function doCancel() {
    if (!cancelId) return;
    try {
      await apiFetch(`/api/appointments/${cancelId}/admin-cancel`, { method: "PATCH" });
      toast.success("Appointment cancelled");
      setCancelId(null);
      load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Manage Appointments</h1>
      {list.length === 0 ? (
        <p className="text-gray-500">No appointment requests yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border text-left text-sm">
            <thead className="bg-rose-50">
              <tr>
                <th className="p-2">Customer</th>
                <th className="p-2">Service</th>
                <th className="p-2">Date & Time</th>
                <th className="p-2">Price</th>
                <th className="p-2">Status</th>
                <th className="p-2">Payment</th>
                <th className="p-2">Requested</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-2">
                    <p className="font-medium">{a.customer?.name ?? "—"}</p>
                    <p className="text-xs text-gray-500">{a.customer?.email}</p>
                  </td>
                  <td className="p-2">{a.service?.serviceName ?? "Deleted service"}</td>
                  <td className="p-2">{a.appointmentDate}<br />{a.timeSlot}</td>
                  <td className="p-2">৳{a.servicePrice}</td>
                  <td className="p-2"><span className={`rounded px-2 py-1 text-xs ${badge[a.status]}`}>{a.status}</span></td>
                  <td className="p-2"><span className={`rounded px-2 py-1 text-xs ${badge[a.paymentStatus]}`}>{a.paymentStatus}</span></td>
                  <td className="p-2">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2 p-2 whitespace-nowrap">
                    <button onClick={() => setDetails(a)} className="text-blue-600 underline">Details</button>
                    {a.status === "pending" && (
                      <button onClick={() => confirm(a._id)} className="text-green-600 underline">Confirm</button>
                    )}
                    {(a.status === "pending" || a.status === "confirmed") && (
                      <button onClick={() => setCancelId(a._id)} className="text-red-600 underline">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded bg-white p-6">
            <p className="mb-4">Cancel this appointment?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelId(null)} className="rounded border px-3 py-1">No</button>
              <button onClick={doCancel} className="rounded bg-red-600 px-3 py-1 text-white">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold">Appointment Details</h2>
            <ul className="space-y-1 text-sm">
              <li><b>Customer:</b> {details.customer?.name} ({details.customer?.email})</li>
              <li><b>Service:</b> {details.service?.serviceName}</li>
              <li><b>Date:</b> {details.appointmentDate}</li>
              <li><b>Time:</b> {details.timeSlot}</li>
              <li><b>Price:</b> ৳{details.servicePrice}</li>
              <li><b>Status:</b> {details.status}</li>
              <li><b>Payment:</b> {details.paymentStatus}</li>
              <li><b>Customer message:</b> {details.message || "—"}</li>
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