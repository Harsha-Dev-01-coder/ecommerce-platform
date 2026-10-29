"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";
import type { Product } from "@/types/product";

type WishlistButtonProps = {
  product: Product;
};

export default function WishlistButton({
  product,
}: WishlistButtonProps) {
  const dispatch = useAppDispatch();

  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === product.id),
  );

  function handleToggleWishlist() {
    dispatch(toggleWishlist(product));
  }

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      aria-pressed={isWishlisted}
      aria-label={
        isWishlisted
          ? `Remove ${product.name} from wishlist`
          : `Add ${product.name} to wishlist`
      }
      className={`mt-3 w-full rounded-xl border px-6 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
        isWishlisted
          ? "border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100"
          : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
      }`}
    >
      {isWishlisted ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
    </button>
  );
}