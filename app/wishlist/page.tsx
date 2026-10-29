"use client";

import Image from "next/image";
import Link from "next/link";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { removeFromWishlist } from "@/features/wishlist/wishlistSlice";

export default function WishlistPage() {
  const dispatch = useAppDispatch();

  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items,
  );

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

      {wishlistItems.length === 0 ? (
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

          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistItems.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square bg-white">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </Link>

              <div className="p-5">
                <p className="text-sm font-medium text-indigo-400">
                  {product.category}
                </p>

                <Link href={`/products/${product.id}`}>
                  <h2 className="mt-2 text-xl font-semibold text-white hover:text-indigo-400">
                    {product.name}
                  </h2>
                </Link>

                <p className="mt-3 text-xl font-bold text-white">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Product
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      dispatch(removeFromWishlist(product.id))
                    }
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="rounded-xl border border-gray-600 px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-red-400 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}