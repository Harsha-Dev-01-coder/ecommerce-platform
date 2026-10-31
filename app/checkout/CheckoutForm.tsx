"use client";

import Link from "next/link";
import { useState, type SyntheticEvent } from "react";

import { useRouter } from "next/navigation";

import { clearCart } from "@/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createOrder } from "@/lib/services/orderService";

import type { CheckoutAddress } from "./page";

type CheckoutFormProps = {
  addresses: CheckoutAddress[];
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function CheckoutForm({
  addresses,
}: CheckoutFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);

  const [selectedAddress, setSelectedAddress] = useState(
    addresses[0]?.id ?? "",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const estimatedTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  async function handleCheckout(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (cartItems.length === 0) {
      setError("Your cart is empty. Add products before checking out.");
      return;
    }

    if (!selectedAddress) {
      setError("Please select a shipping address.");
      return;
    }

    setLoading(true);

    try {
      const orderId = await createOrder({
        addressId: selectedAddress,
        items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    });

      dispatch(clearCart());

      setSuccess(`Your order was placed successfully! Order ID: ${orderId}`);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to place your order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-green-800 bg-gray-900 p-8 text-center">
        <div className="text-4xl">✓</div>

        <h2 className="mt-4 text-2xl font-bold text-white">
          Order Placed Successfully!
        </h2>

        <p className="mt-3 break-all text-sm leading-6 text-gray-400">
          {success}
        </p>

        <p className="mt-4 text-sm text-green-400">
          Your cart has been cleared.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
        <h2 className="text-xl font-semibold text-white">
          Your cart is empty
        </h2>

        <p className="mt-3 text-gray-400">
          Add some products before proceeding to checkout.
        </p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleCheckout}
      className="grid gap-8 lg:grid-cols-3"
    >
      <section className="space-y-6 lg:col-span-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">
              Shipping Address
            </h2>

            <Link
              href="/account/addresses"
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Manage Addresses
            </Link>
          </div>

          {addresses.length === 0 ? (
            <div className="mt-6 rounded-xl border border-yellow-800 bg-yellow-950/30 p-5">
              <p className="text-sm text-yellow-300">
                You haven&apos;t saved a shipping address yet.
              </p>

              <Link
                href="/account/addresses"
                className="mt-3 inline-block font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Add a Shipping Address →
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {addresses.map((address) => (
                <label
                  key={address.id}
                  className={`block cursor-pointer rounded-xl border p-5 transition ${
                    selectedAddress === address.id
                      ? "border-indigo-500 bg-indigo-950/30"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={address.id}
                      checked={selectedAddress === address.id}
                      onChange={() => setSelectedAddress(address.id)}
                      className="mt-1 accent-indigo-500"
                    />

                    <div>
                      <p className="font-semibold text-white">
                        {address.full_name}
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        {address.phone}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-300">
                        {address.address_line1}
                        {address.address_line2 && (
                          <>
                            <br />
                            {address.address_line2}
                          </>
                        )}
                        <br />
                        {address.city}, {address.state} -{" "}
                        {address.postal_code}
                        <br />
                        {address.country}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Your Products
          </h2>

          <div className="mt-6 divide-y divide-gray-800">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {item.product.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 font-semibold text-white">
                  {currencyFormatter.format(
                    item.product.price * item.quantity,
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Order Summary
        </h2>

        <div className="mt-6 flex justify-between border-t border-gray-700 pt-4">
          <span className="text-gray-400">
            Estimated Total
          </span>

          <span className="font-bold text-white">
            {currencyFormatter.format(estimatedTotal)}
          </span>
        </div>

        <p className="mt-4 text-xs leading-5 text-gray-500">
          Final product prices and stock availability are verified securely
          by the database when you place your order.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || addresses.length === 0}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

        <Link
          href="/cart"
          className="mt-4 block text-center text-sm font-medium text-gray-400 hover:text-white"
        >
          Return to Cart
        </Link>
      </aside>
    </form>
  );
}