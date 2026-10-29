"use client";

import { useEffect } from "react";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductsError({
  error,
  reset,
}: ProductsErrorProps) {
  useEffect(() => {
    console.error("Products page error:", error);
  }, [error]);
  return (
    <section
      className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8"
      role="alert"
    >
      <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">
          We couldn&apos;t load the products
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-gray-600">
          Something went wrong while loading our collection. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}