import Logo from "@/components/Logo";
import Link from "next/link";


export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size={36} textClassName="text-white" />
          <p className="mt-2 text-sm">
            Book your favorite salon services online, quickly and easily.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Browse Services</Link></li>
            <li><Link href="/sign-in" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>Phone: +880 1700-000000</li>
            <li>Email: info@salonbook.com</li>
            <li>House 12, Road 5, Khulna, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-semibold text-white">Opening Hours</h4>
          <ul className="space-y-1 text-sm">
            <li>Sat - Thu: 10:00 AM - 8:00 PM</li>
            <li>Friday: 3:00 PM - 8:00 PM</li>
          </ul>
          <div className="mt-3 flex gap-4 text-sm">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white">YouTube</a>
          </div>
        </div>
      </div>
      <p className="border-t border-gray-700 py-4 text-center text-sm">
        © 2026 SalonBook. All rights reserved.
      </p>
    </footer>
  );
}