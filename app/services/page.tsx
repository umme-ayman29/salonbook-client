"use client";

import { useEffect, useState } from "react";
import { publicFetch } from "@/lib/api";
import ServiceCard, { Service } from "@/components/ServiceCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const categories = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);
        setServices(await publicFetch(`/api/services?${params.toString()}`));
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const field = "rounded border p-2";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-rose-700">Browse Services</h1>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by service name"
          className={field}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={field}>
          <option value="">Sort by Price</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p className="py-10 text-center">Loading services...</p>
      ) : error ? (
        <p className="py-10 text-center text-red-600">{error}</p>
      ) : services.length === 0 ? (
        <p className="py-10 text-center text-gray-500">No services found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center">Loading...</p>}>
      <BrowseContent />
    </Suspense>
  );
}