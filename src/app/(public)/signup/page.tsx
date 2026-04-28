"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api-error";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { sendLoginOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await sendLoginOtp(email.trim());
      router.push("/verify-otp");
    } catch (requestError: unknown) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to send OTP. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Draftien"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Get started with Draftien using email OTP.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="you@example.com…"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              className="mt-1 h-4 w-4 accent-indigo-600"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              By continuing, you agree to our{" "}
              <Link
                href="#"
                className="font-medium text-indigo-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="font-medium text-indigo-600 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {error ? (
            <p
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
              aria-live="polite"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!email || !accepted || isSubmitting}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending OTP..." : "Create account"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <Image src="/images/google.png" alt="Google" width={20} height={20} />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
