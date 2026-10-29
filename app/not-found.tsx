import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
          Product Not Found
        </h1>

        <p className="mt-4 text-gray-600">
          Sorry, we couldn&apos;t find the product you&apos;re looking for. It
          may have been removed or the link may be incorrect.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}