import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden bg-gray-950 text-white">
      <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:px-8">
        {/* Hero Content */}
        <div className="max-w-xl">
          <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            Discover Something New
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Shopping made{" "}
            <span className="text-indigo-400">simple.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
            Discover products you&apos;ll love, explore new favorites, and enjoy a
            better shopping experience with ShopSphere.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Explore Products
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>

            <Link
              href="/wishlist"
              className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gray-500 hover:bg-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Wishlist
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-gray-800 pt-6">
            <div>
              <p className="text-2xl font-bold">Quality</p>
              <p className="mt-1 text-sm text-gray-400">Products you&apos;ll love</p>
            </div>

            <div>
              <p className="text-2xl font-bold">Simple</p>
              <p className="mt-1 text-sm text-gray-400">Effortless shopping</p>
            </div>

            <div>
              <p className="text-2xl font-bold">Secure</p>
              <p className="mt-1 text-sm text-gray-400">Shopping experience</p>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-full bg-indigo-600/20 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-800 via-gray-900 to-indigo-950 p-8 shadow-2xl sm:p-12">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  THE COLLECTION
                </p>
                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Find your next favorite.
                </h2>
              </div>

              <span
                aria-hidden="true"
                className="text-4xl text-indigo-400"
              >
                ✦
              </span>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-white/5 text-6xl">
                <span aria-hidden="true">🎧</span>
              </div>

              <div className="mt-8 flex aspect-square items-center justify-center rounded-2xl bg-indigo-500/10 text-6xl">
                <span aria-hidden="true">⌚</span>
              </div>

              <div className="-mt-8 flex aspect-square items-center justify-center rounded-2xl bg-indigo-500/10 text-6xl">
                <span aria-hidden="true">👟</span>
              </div>

              <div className="flex aspect-square items-center justify-center rounded-2xl bg-white/5 text-6xl">
                <span aria-hidden="true">🎒</span>
              </div>
            </div>

            <p className="mt-8 text-sm leading-6 text-gray-400">
              Explore a growing collection of products selected for everyday
              life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}