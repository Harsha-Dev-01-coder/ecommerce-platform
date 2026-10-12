export default function CheckoutPage() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
        Secure Checkout
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
        Complete Your Order
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
        Enter your shipping information to prepare your order.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white">
            Shipping Information
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Our checkout form, validation, and order submission will be
            implemented in a later task.
          </p>
        </div>

        <div className="h-fit rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Order Summary
          </h2>

          <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
            <span className="text-gray-400">Total</span>
            <span className="font-semibold text-white">₹0.00</span>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-500">
            Your order summary will update when products are added to your
            cart.
          </p>
        </div>
      </div>
    </section>
  );
}