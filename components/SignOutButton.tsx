"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError.message);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Something went wrong while signing out.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        className="rounded-xl border border-red-800 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing Out..." : "Sign Out"}
      </button>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}