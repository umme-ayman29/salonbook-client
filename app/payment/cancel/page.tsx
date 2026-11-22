import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl">⚠️</p>
      <h1 className="mt-3 text-2xl font-bold text-amber-700">Payment Cancelled</h1>
      <p className="mt-2 max-w-md text-gray-600">
        Your payment was not completed. You can try again from your appointments page.
      </p>
      <Link href="/dashboard/customer/appointments" className="mt-6 rounded bg-rose-600 px-6 py-2 text-white">
        Back to My Appointments
      </Link>
    </div>
  );
}