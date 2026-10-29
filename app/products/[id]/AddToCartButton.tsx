"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();

  const cartItem = useAppSelector((state) =>
    state.cart.items.find((item) => item.product.id === product.id),
  );

  const [message, setMessage] = useState("");

  const isOutOfStock = product.stock <= 0;
  const isAtStockLimit = (cartItem?.quantity ?? 0) >= product.stock;

  function handleAddToCart() {
    if (isOutOfStock) {
      setMessage("This product is out of stock.");
      return;
    }

    if (isAtStockLimit) {
      setMessage("You've reached the available stock limit.");
      return;
    }

    dispatch(addToCart(product));
    setMessage("Added to your cart!");
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAtStockLimit}
        className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isOutOfStock
          ? "Out of Stock"
          : isAtStockLimit
            ? "Stock Limit Reached"
            : "Add to Cart"}
      </button>

      <p
        className="mt-3 min-h-5 text-sm text-green-700"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>

      {cartItem && (
        <p className="mt-1 text-sm text-gray-600">
          Already in your cart: {cartItem.quantity}
        </p>
      )}
    </div>
  );
}