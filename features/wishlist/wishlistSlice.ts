import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";

type WishlistState = {
  items: Product[];
};

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;

      const alreadyExists = state.items.some(
        (item) => item.id === product.id,
      );

      if (!alreadyExists) {
        state.items.push(product);
      }
    },

    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (product) => product.id !== action.payload,
      );
    },

    toggleWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;

      const alreadyExists = state.items.some(
        (item) => item.id === product.id,
      );

      if (alreadyExists) {
        state.items = state.items.filter(
          (item) => item.id !== product.id,
        );
      } else {
        state.items.push(product);
      }
    },

    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;