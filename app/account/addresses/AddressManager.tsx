"use client";

import { useState, type SyntheticEvent } from "react";

import { createClient } from "@/lib/supabase/client";
import type { ShippingAddress } from "./page";

type AddressManagerProps = {
  initialAddresses: ShippingAddress[];
};

const inputClassName =
  "w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

export default function AddressManager({
  initialAddresses,
}: AddressManagerProps) {
  const [addresses, setAddresses] = useState(initialAddresses);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleAddAddress(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Your session has expired. Please log in again.");
        return;
      }

      const { data: newAddress, error: insertError } = await supabase
        .from("shipping_addresses")
        .insert({
          user_id: user.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          address_line1: addressLine1.trim(),
          address_line2: addressLine2.trim() || null,
          city: city.trim(),
          state: state.trim(),
          postal_code: postalCode.trim(),
          country: country.trim(),
        })
        .select(
          "id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at",
        )
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setAddresses((current) => [newAddress as ShippingAddress, ...current]);

      setFullName("");
      setPhone("");
      setAddressLine1("");
      setAddressLine2("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("India");

      setSuccess("Shipping address added successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAddress(addressId: string) {
    setError("");
    setSuccess("");
    setDeletingId(addressId);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("Your session has expired. Please log in again.");
        return;
      }

      const { error: deleteError } = await supabase
        .from("shipping_addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", user.id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setAddresses((current) =>
        current.filter((address) => address.id !== addressId),
      );

      setSuccess("Shipping address deleted successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Add New Address
        </h2>

        <form onSubmit={handleAddAddress} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-200">
                Full Name
              </label>
              <input
                id="fullName"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Recipient's full name"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-200">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="addressLine1" className="mb-2 block text-sm font-medium text-gray-200">
              Address Line 1
            </label>
            <input
              id="addressLine1"
              required
              value={addressLine1}
              onChange={(event) => setAddressLine1(event.target.value)}
              placeholder="House number, street, area"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="addressLine2" className="mb-2 block text-sm font-medium text-gray-200">
              Address Line 2 (Optional)
            </label>
            <input
              id="addressLine2"
              value={addressLine2}
              onChange={(event) => setAddressLine2(event.target.value)}
              placeholder="Landmark or apartment details"
              className={inputClassName}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-200">
                City
              </label>
              <input
                id="city"
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-200">
                State
              </label>
              <input
                id="state"
                required
                value={state}
                onChange={(event) => setState(event.target.value)}
                placeholder="State"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="postalCode" className="mb-2 block text-sm font-medium text-gray-200">
                PIN Code
              </label>
              <input
                id="postalCode"
                required
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="Postal code"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-200">
                Country
              </label>
              <input
                id="country"
                required
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-400">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Adding Address..." : "Add Address"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">
          Saved Addresses ({addresses.length})
        </h2>

        {addresses.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
            <p className="text-gray-400">
              You haven&apos;t saved any shipping addresses yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h3 className="font-semibold text-white">
                      {address.full_name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {address.phone}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-gray-300">
                      {address.address_line1}
                      {address.address_line2 && (
                        <>
                          <br />
                          {address.address_line2}
                        </>
                      )}
                      <br />
                      {address.city}, {address.state} - {address.postal_code}
                      <br />
                      {address.country}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={deletingId === address.id}
                    className="h-fit rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === address.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}