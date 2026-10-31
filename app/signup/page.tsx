"use client";

import Link from "next/link";
import { useState, type SyntheticEvent } from "react";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-gray-950 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Join ShopSphere
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">
            Create your account
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Sign up to manage your orders and shopping experience.
          </p>
        </div>

        {success ? (
          <div
            className="mt-8 rounded-xl border border-green-800 bg-green-950/40 p-5 text-center"
            role="status"
          >
            <h2 className="font-semibold text-green-400">
              Check your email!
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              We&apos;ve sent a confirmation link to{" "}
              <strong className="text-white">{email}</strong>.
              Open that email and click the link to activate your account.
            </p>

            <Link
              href="/login"
              className="mt-5 inline-block font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="mt-8 space-y-5">
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
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {error && (
              <p
                className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Login
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}