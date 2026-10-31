import { createClient } from "@/lib/supabase/client";

export type CheckoutItem = {
  product_id: string;
  quantity: number;
};

export type CreateOrderInput = {
  addressId: string;
  items: CheckoutItem[];
};

export async function createOrder({
  addressId,
  items,
}: CreateOrderInput): Promise<string> {
  if (!addressId) {
    throw new Error("Please select a shipping address.");
  }

  if (items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  for (const item of items) {
    if (
      !item.product_id ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new Error("Invalid cart item.");
    }
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc("create_order", {
    p_address_id: addressId,
    p_items: items,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Order creation failed.");
  }

  return data as string;
}