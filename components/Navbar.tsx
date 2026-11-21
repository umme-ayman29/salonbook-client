"use client";
import Logo from "@/components/Logo";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const user = session?.user as
    | { name: string; image?: string | null; role?: string }
    | undefined;
  const dashboard =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/customer";

  async function handleLogout() {
    await authClient.signOut();
    setOpen(false);
    toast.success("Logged out");
    router.push("/");
  }

  const links = (
    <>
      <Link href="/" className="hover:text-rose-600" onClick={() => setMenu(false)}>Home</Link>
      <Link href="/services" className="hover:text-rose-600" onClick={() => setMenu(false)}>Browse Services</Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="SalonBook home">
  <Logo size={38} />
</Link>
        <div className="hidden items-center gap-6 md:flex">{links}</div>

        <div className="flex items-center gap-3">
          {isPending ? null : user ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full border px-3 py-1">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt="" className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-sm text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="hidden text-sm sm:inline">{user.name}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 rounded border bg-white shadow">
                  <p className="border-b px-4 py-2 text-sm font-medium">{user.name}</p>
                  <Link href={dashboard} onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-rose-50">Dashboard</Link>
                  <button onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-rose-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="rounded border px-3 py-1 text-sm">Sign In</Link>
              <Link href="/sign-up" className="rounded bg-rose-600 px-3 py-1 text-sm text-white">Sign Up</Link>
            </>
          )}
          <button className="md:hidden" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
        </div>
      </div>
      {menu && <div className="flex flex-col gap-3 border-t px-4 py-3 md:hidden">{links}</div>}
    </nav>
  );
}