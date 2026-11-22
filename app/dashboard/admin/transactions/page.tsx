"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

type Tx = {
  _id: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: string;
  createdAt: string;
  customer?: { name: string; email: string };
  appointment?: { appointmentDate: string; timeSlot: string };
  service?: { serviceName: string };
};

export default function TransactionsPage() {
  const [list, setList] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/payments/transactions")
      .then(setList)
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Transactions</h1>
      {list.length === 0 ? (
        <p className="text-gray-500">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border text-left text-sm">
            <thead className="bg-rose-50">
              <tr>
                <th className="p-2">Customer</th>
                <th className="p-2">Service</th>
                <th className="p-2">Appointment</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Currency</th>
                <th className="p-2">Session ID</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-2">
                    <p className="font-medium">{t.customer?.name ?? "—"}</p>
                    <p className="text-xs text-gray-500">{t.customer?.email}</p>
                  </td>
                  <td className="p-2">{t.service?.serviceName ?? "—"}</td>
                  <td className="p-2">{t.appointment?.appointmentDate}<br />{t.appointment?.timeSlot}</td>
                  <td className="p-2">{t.amount}</td>
                  <td className="p-2 uppercase">{t.currency}</td>
                  <td className="p-2 font-mono text-xs">…{t.stripeSessionId.slice(-10)}</td>
                  <td className="p-2">
                    <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">{t.status}</span>
                  </td>
                  <td className="p-2">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}