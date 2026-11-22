"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
      <p className="mt-2 text-gray-600">An unexpected error occurred. Please try again.</p>
      <button onClick={() => reset()} className="mt-6 rounded bg-rose-600 px-6 py-2 text-white">
        Try again
      </button>
    </div>
  );
}