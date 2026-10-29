"use client";

import Image from "next/image";
import Link from "next/link";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const instant = false;

export default function CartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/products"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-800"
        >
          ← Continue shopping
        </Link>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          Shopping Cart
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {cartItems.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <div className="text-5xl" aria-hidden="true">
            🛒
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Looks like you haven&apos;t added any products yet.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Explore products
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2" aria-label="Cart items">
            {cartItems.map((item) => {
              const { product, quantity } = item;
              const subtotalForItem = product.price * quantity;

              return (
                <article
                  key={product.id}
                  className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="shrink-0"
                    aria-label={`View ${product.name}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={160}
                      height={160}
                      unoptimized
                      className="h-36 w-full rounded-xl object-cover sm:h-32 sm:w-32"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {product.category}
                    </p>

                    <Link
                      href={`/products/${product.id}`}
                      className="mt-1 inline-block text-lg font-semibold text-gray-900 transition hover:text-indigo-600"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-2 text-sm text-gray-600">
                      ₹{product.price.toLocaleString("en-IN")} each
                    </p>

                    <p className="mt-2 text-base font-bold text-gray-900">
                      ₹{subtotalForItem.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div
                      className="flex items-center rounded-lg border border-gray-300"
                      aria-label={`Quantity for ${product.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => dispatch(decreaseQuantity(product.id))}
                        disabled={quantity <= 1}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className="rounded-l-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span
                        className="min-w-10 px-2 text-center text-sm font-semibold text-gray-900"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => dispatch(increaseQuantity(product.id))}
                        disabled={quantity >= product.stock}
                        aria-label={`Increase quantity of ${product.name}`}
                        className="rounded-r-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(product.id))}
                      className="text-sm font-semibold text-red-600 transition hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Items ({totalItems})</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
              <span className="font-semibold text-gray-900">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Shipping and applicable taxes will be calculated at checkout.
            </p>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Proceed to checkout
            </Link>

            <Link
              href="/products"
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}