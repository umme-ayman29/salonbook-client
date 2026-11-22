"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const hours = [
  { day: "Saturday - Thursday", time: "10:00 AM - 8:00 PM" },
  { day: "Friday", time: "3:00 PM - 8:00 PM" },
];

const highlights = [
  { title: "Experienced Team", text: "Our stylists and therapists have years of professional experience." },
  { title: "Hygienic Environment", text: "Clean tools and a safe, comfortable space for every client." },
  { title: "Quality Products", text: "We use trusted, skin-friendly products for every service." },
];

export default function SalonPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) router.replace("/sign-in");
  }, [isPending, session, router]);

  if (isPending || !session) {
    return <p className="py-20 text-center">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-rose-700">About SalonBook</h1>
      <p className="mt-3 max-w-3xl text-gray-700">
        SalonBook is a friendly neighborhood salon offering hair, skin, makeup,
        nail and spa services. Browse our services, request an appointment
        online, and pay securely once your booking is confirmed.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.title} className="rounded-xl border p-5">
            <h3 className="font-semibold">{h.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{h.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-rose-50 p-6">
          <h2 className="mb-3 text-xl font-semibold">Opening Hours</h2>
          <ul className="space-y-2 text-sm">
            {hours.map((h) => (
              <li key={h.day} className="flex justify-between">
                <span>{h.day}</span>
                <span className="font-medium">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-rose-50 p-6">
          <h2 className="mb-3 text-xl font-semibold">Contact & Address</h2>
          <ul className="space-y-2 text-sm">
            <li>House 12, Road 5, Khulna, Bangladesh</li>
            <li>Phone: +880 1700-000000</li>
            <li>Email: info@salonbook.com</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/services" className="rounded bg-rose-600 px-6 py-3 text-white hover:bg-rose-700">
          Explore Services
        </Link>
      </div>
    </div>
  );
}