export default function ProductsPage() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
          Our Collection
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Explore Products
        </h1>

        <p className="mt-5 text-lg leading-8 text-gray-600">
          Discover products for your everyday needs. Find your next favorite
          with ShopSphere.
        </p>
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Products coming soon
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          We&apos;re preparing our collection. Product listings will appear here
          when our catalog is ready.
        </p>
      </div>
    </section>
  );
}