"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch } from "@/lib/api";
import ServiceCard, { Service } from "@/components/ServiceCard";

const categories = [
  { name: "Haircut & Styling", icon: "✂️" },
  { name: "Hair Coloring", icon: "🎨" },
  { name: "Hair Treatment", icon: "💆" },
  { name: "Facial & Skincare", icon: "🧖" },
  { name: "Makeup", icon: "💄" },
  { name: "Manicure & Pedicure", icon: "💅" },
  { name: "Spa & Massage", icon: "🌿" },
];

const reasons = [
  { title: "Expert Stylists", text: "Skilled professionals with years of experience." },
  { title: "Easy Online Booking", text: "Request an appointment in a few clicks." },
  { title: "Secure Payment", text: "Pay safely online with Stripe once confirmed." },
  { title: "Premium Products", text: "Only quality, skin-friendly products are used." },
];

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    publicFetch("/api/services?limit=6")
      .then(setServices)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Banner */}
      <section
        className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center px-4 text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl font-bold md:text-5xl">
            Look Good. Feel Beautiful.
          </h1>
          <p className="mt-4 text-lg">
            Book your favorite salon services online. Choose a service, pick a
            time, and we will take care of the rest.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-block rounded bg-rose-600 px-6 py-3 font-medium hover:bg-rose-700"
          >
            Explore Salon Services
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-center text-3xl font-bold text-rose-700">
          Featured Services
        </h2>
        {loading ? (
          <p className="text-center">Loading services...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No services available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link href="/services" className="text-rose-600 underline">
            View all services
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-rose-50 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-rose-700">
            Service Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/services?category=${encodeURIComponent(c.name)}`}
                className="rounded-xl border bg-white p-6 text-center shadow-sm hover:shadow-md"
              >
                <div className="text-3xl">{c.icon}</div>
                <p className="mt-2 font-medium">{c.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-center text-3xl font-bold text-rose-700">
          Why Choose Us
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-xl border p-6 text-center">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-rose-600 py-12 text-center text-white">
        <h2 className="text-2xl font-bold">Ready for a fresh new look?</h2>
        <p className="mt-2">Open Sat - Thu, 10:00 AM - 8:00 PM</p>
        <Link
          href="/services"
          className="mt-5 inline-block rounded bg-white px-6 py-2 font-medium text-rose-700"
        >
          Book Now
        </Link>
      </section>
    </div>
  );
}