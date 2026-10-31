import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./ProfileForm";

export default async function EditProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-900 bg-gray-900 p-6">
          <p className="text-red-400">
            Could not load your profile. Please try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
          ShopSphere
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white">
          Edit Profile
        </h1>

        <p className="mt-2 text-gray-400">
          Keep your personal information up to date.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <ProfileForm
            initialFullName={profile.full_name ?? ""}
            initialPhone={profile.phone ?? ""}
          />
        </div>
      </div>
    </main>
  );
}