"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch, publicFetch } from "@/lib/api";
import type { Service } from "@/components/ServiceCard";

type ServiceFull = Service & { status: "active" | "inactive" };

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  const [service, setService] = useState<ServiceFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [booked, setBooked] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  // protected: লগইন না থাকলে sign-in
  useEffect(() => {
    if (!isPending && !session) router.replace("/sign-in");
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    publicFetch(`/api/services/${id}`)
      .then(setService)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id, session]);

  useEffect(() => {
    if (!date || !session) return;
    setTimeSlot("");
    apiFetch(`/api/appointments/slots?serviceId=${id}&date=${date}`)
      .then((d) => {
        setSlots(d.allSlots);
        setBooked(d.booked);
      })
      .catch((e) => toast.error((e as Error).message));
  }, [date, id, session]);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return toast.error("Please select a date");
    if (!timeSlot) return toast.error("Please select a time slot");

    setSubmitting(true);
    try {
      await apiFetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: id, appointmentDate: date, timeSlot, message }),
      });
      toast.success("Appointment request submitted");
      router.push("/dashboard/customer/appointments");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending || !session || loading) {
    return <p className="py-20 text-center">Loading...</p>;
  }

  if (error || !service) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-red-600">{error || "Service not found"}</p>
        <Link href="/services" className="mt-4 inline-block text-rose-600 underline">
          Back to services
        </Link>
      </div>
    );
  }

  const isActive = service.status === "active";
  const isAdmin = role === "admin";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image} alt={service.serviceName} className="w-full rounded-xl object-cover" />
        <div>
          <span className="text-sm font-medium text-rose-600">{service.category}</span>
          <h1 className="mt-1 text-3xl font-bold">{service.serviceName}</h1>
          <p className="mt-4 text-gray-700">{service.description}</p>
          <div className="mt-4 flex gap-6">
            <p className="text-2xl font-bold text-rose-700">৳{service.price}</p>
            <p className="self-end text-gray-500">{service.duration} minutes</p>
          </div>

          {!isActive ? (
            <p className="mt-6 rounded bg-gray-100 p-3 text-gray-600">
              This service is currently unavailable for booking.
            </p>
          ) : isAdmin ? (
            <p className="mt-6 rounded bg-amber-50 p-3 text-amber-700">
              Admins cannot submit appointment requests.
            </p>
          ) : (
            !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 rounded bg-rose-600 px-6 py-3 text-white hover:bg-rose-700"
              >
                Book Appointment
              </button>
            )
          )}
        </div>
      </div>

      {showForm && isActive && !isAdmin && (
        <form onSubmit={handleBook} className="mt-10 max-w-xl space-y-4 rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Appointment Request</h2>

          <div>
            <label className="mb-1 block text-sm">Appointment Date</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded border p-2"
            />
          </div>

          {date && (
            <div>
              <label className="mb-1 block text-sm">Available Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((s) => {
                  const taken = booked.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      disabled={taken}
                      onClick={() => setTimeSlot(s)}
                      className={`rounded border p-2 text-sm ${
                        timeSlot === s
                          ? "bg-rose-600 text-white"
                          : taken
                          ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                          : "hover:bg-rose-50"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm">Additional Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded border p-2"
            />
          </div>

          <button
            disabled={submitting}
            className="w-full rounded bg-rose-600 p-2 text-white disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
}