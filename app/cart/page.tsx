export default function CartPage() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
        Your Shopping Bag
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
        Shopping Cart
      </h1>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-center sm:p-12">
        <div aria-hidden="true" className="text-5xl">
          🛒
        </div>

        <h2 className="mt-5 text-xl font-semibold text-gray-900">
          Your cart is empty
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          You haven&apos;t added any products to your cart yet.
        </p>
      </div>
    </section>
  );
}