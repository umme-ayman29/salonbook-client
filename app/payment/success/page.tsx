import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl">✅</p>
      <h1 className="mt-3 text-2xl font-bold text-green-700">Payment Successful</h1>
      <p className="mt-2 max-w-md text-gray-600">
        Thank you! Your payment is being confirmed. Your appointment will show
        as paid in a few moments.
      </p>
      <Link href="/dashboard/customer/appointments" className="mt-6 rounded bg-rose-600 px-6 py-2 text-white">
        View My Appointments
      </Link>
    </div>
  );
}