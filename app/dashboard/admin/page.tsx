"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

type Stats = {
  customers: number;
  activeServices: number;
  total: number;
  pending: number;
  confirmed: number;
  successfulPayments: number;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiFetch("/api/appointments/admin/stats")
      .then(setStats)
      .catch((e) => toast.error((e as Error).message));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const cards = [
    { label: "Total Registered Customers", value: stats.customers },
    { label: "Total Active Services", value: stats.activeServices },
    { label: "Total Appointment Requests", value: stats.total },
    { label: "Pending Appointments", value: stats.pending },
    { label: "Confirmed Appointments", value: stats.confirmed },
    { label: "Total Successful Payments", value: stats.successfulPayments },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-rose-50 p-5">
            <p className="text-3xl font-bold text-rose-700">{c.value}</p>
            <p className="mt-1 text-sm text-gray-600">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
