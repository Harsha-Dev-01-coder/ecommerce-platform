import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import AddressManager from "./AddressManager";

export type ShippingAddress = {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
};

export default async function AddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: addresses, error } = await supabase
    .from("shipping_addresses")
    .select(
      "id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-900 bg-gray-900 p-6">
          <p className="text-red-400">
            Could not load your shipping addresses. Please try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          ShopSphere
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white">
          Shipping Addresses
        </h1>

        <p className="mt-2 text-gray-400">
          Manage the addresses where you want your orders delivered.
        </p>

        <div className="mt-8">
          <AddressManager initialAddresses={addresses ?? []} />
        </div>
      </div>
    </main>
  );
}