import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalonBook",
  description: "Salon Appointment Booking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}