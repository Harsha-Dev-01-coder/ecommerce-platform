export default function WishlistPage() {
  return (
    <section className="mx-auto min-h-[60vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
        Your Collection
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
        My Wishlist
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
        Keep track of the products you love and save them for later.
      </p>

      <div className="mt-10 rounded-2xl border border-gray-700 bg-gray-900 px-6 py-16 text-center">
        <div aria-hidden="true" className="text-5xl">
          ♡
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          Your wishlist is empty
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Discover something you love and save it here for later.
        </p>
      </div>
    </section>
  );
}