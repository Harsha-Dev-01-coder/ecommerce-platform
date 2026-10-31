import Link from "next/link";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, phone, created_at")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError.message);
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            ShopSphere
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">
            My Account
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your personal information and shopping details.
          </p>
        </div>

        <section className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Personal Information
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="mt-1 font-medium text-white">
                {profile?.full_name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Email Address</p>
              <p className="mt-1 font-medium text-white">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Phone Number</p>
              <p className="mt-1 font-medium text-white">
                {profile?.phone || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <SignOutButton />
          </div>

          {profileError && (
            <p className="mt-5 text-sm text-red-400">
              We couldn&apos;t load your profile information.
            </p>
          )}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/account/profile"
            className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-indigo-500"
          >
            <h2 className="font-semibold text-white">
              Edit Profile
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Update your name and phone number.
            </p>
          </Link>

          <Link
            href="/account/addresses"
            className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-indigo-500"
          >
            <h2 className="font-semibold text-white">
              Shipping Addresses
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Manage your delivery addresses.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}