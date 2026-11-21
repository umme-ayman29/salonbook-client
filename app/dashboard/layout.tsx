"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/services", label: "Manage Services" },
  { href: "/dashboard/admin/services/add", label: "Add Service" },
  { href: "/dashboard/admin/appointments", label: "Manage Appointments" },
  { href: "/dashboard/admin/users", label: "Manage Users" },
  { href: "/dashboard/admin/transactions", label: "Transactions" },
  { href: "/dashboard/admin/profile", label: "My Profile" },
];

const customerLinks = [
  { href: "/dashboard/customer", label: "Overview" },
  { href: "/dashboard/customer/appointments", label: "My Appointments" },
  { href: "/dashboard/customer/profile", label: "My Profile" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [menu, setMenu] = useState(false);

  const user = session?.user as { role?: string; isBlocked?: boolean } | undefined;
  const role = user?.role === "admin" ? "admin" : "customer";

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/sign-in");
      return;
    }
    if (role === "admin" && pathname.startsWith("/dashboard/customer")) {
      router.replace("/dashboard/admin");
    }
    if (role === "customer" && pathname.startsWith("/dashboard/admin")) {
      router.replace("/dashboard/customer");
    }
  }, [isPending, session, role, pathname, router]);

  if (isPending || !session) {
    return <div className="p-10 text-center">Loading dashboard...</div>;
  }

  const links = role === "admin" ? adminLinks : customerLinks;

  return (
    <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
      <button
        className="m-3 rounded border px-3 py-2 text-left md:hidden"
        onClick={() => setMenu(!menu)}
      >
        ☰ Dashboard Menu
      </button>
      <aside
        className={`${menu ? "block" : "hidden"} w-full border-r bg-rose-50 p-4 md:block md:min-h-[80vh] md:w-60`}
      >
        <p className="mb-3 text-sm font-semibold uppercase text-rose-700">
          {role} panel
        </p>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenu(false)}
              className={`rounded px-3 py-2 text-sm ${
                pathname === l.href
                  ? "bg-rose-600 text-white"
                  : "hover:bg-rose-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="flex-1 p-4 md:p-6">{children}</section>
    </div>
  );
}