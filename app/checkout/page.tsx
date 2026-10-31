import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import CheckoutForm from "./CheckoutForm";

export type CheckoutAddress = {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=/checkout");
  }

  const { data: addresses, error } = await supabase
    .from("shipping_addresses")
    .select(
      "id, full_name, phone, address_line1, address_line2, city, state, postal_code, country",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Could not load your shipping addresses.");
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          Secure Checkout
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Complete Your Order
        </h1>

        <p className="mt-4 text-gray-400">
          Select your delivery address and review your order.
        </p>

        <div className="mt-10">
          <CheckoutForm addresses={addresses ?? []} />
        </div>
      </div>
    </main>
  );
}