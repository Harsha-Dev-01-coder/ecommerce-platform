"use client";

import { useState, type SyntheticEvent } from "react";

import { createClient } from "@/lib/supabase/client";

type ProfileFormProps = {
  initialFullName: string;
  initialPhone: string;
};

export default function ProfileForm({
  initialFullName,
  initialPhone,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
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

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess("Your profile has been updated successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="fullName"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Full Name
        </label>

        <input
          id="fullName"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-gray-200"
        >
          Phone Number
        </label>

        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter your phone number"
          className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg border border-green-800 bg-green-950/40 p-3 text-sm text-green-400"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}