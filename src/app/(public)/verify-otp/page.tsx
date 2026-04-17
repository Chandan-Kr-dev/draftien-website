"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";

const OTP_LENGTH = 6;
const RESEND_TIME = 30;
const OTP_INPUT_KEYS = [
  "otp-0",
  "otp-1",
  "otp-2",
  "otp-3",
  "otp-4",
  "otp-5",
] as const;

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_TIME);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const router = useRouter();
  const { verifyOtp, resendOtp, pendingEmail, loading, isAuthenticated } =
    useAuth();

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!pendingEmail && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, pendingEmail, router]);

  // Handle input change
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    const newOtp = pastedData.split("");
    const updatedOtp = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => newOtp[i] || "");

    setOtp(updatedOtp);

    const lastIndex = newOtp.length - 1;
    if (lastIndex >= 0) {
      inputsRef.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsVerifying(true);

    try {
      const otpValue = otp.join("");
      await verifyOtp(otpValue);

      // Decide next step based on backend state:
      // - role null -> select-role
      // - isOnboarded true -> home
      // - otherwise -> onboarding for role
      type MeResponse = {
        data: { role: "student" | "teacher" | null; isOnboarded: boolean };
      };
      const meRes = await api.get("/users/me");
      const me = (meRes.data as MeResponse).data;

      if (!me?.role) {
        router.push("/select-role");
      } else if (me.isOnboarded) {
        router.push("/");
      } else {
        router.push(
          me.role === "student" ? "/onboarding/student" : "/onboarding/teacher",
        );
      }
    } catch (requestError: unknown) {
      const message =
        requestError &&
        typeof requestError === "object" &&
        "response" in requestError &&
        requestError.response &&
        typeof requestError.response === "object" &&
        "data" in requestError.response &&
        requestError.response.data &&
        typeof requestError.response.data === "object" &&
        "message" in requestError.response.data &&
        typeof requestError.response.data.message === "string"
          ? requestError.response.data.message
          : requestError instanceof Error
            ? requestError.message
            : "Unable to verify OTP. Please try again.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsResending(true);

    try {
      await resendOtp();
      setTimer(RESEND_TIME);
      setSuccessMessage("A new OTP has been sent.");
    } catch (requestError: unknown) {
      const message =
        requestError &&
        typeof requestError === "object" &&
        "response" in requestError &&
        requestError.response &&
        typeof requestError.response === "object" &&
        "data" in requestError.response &&
        requestError.response.data &&
        typeof requestError.response.data === "object" &&
        "message" in requestError.response.data &&
        typeof requestError.response.data.message === "string"
          ? requestError.response.data.message
          : requestError instanceof Error
            ? requestError.message
            : "Unable to resend OTP. Please try again.";
      setError(message);
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo */}
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

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Verify Your OTP</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-gray-800">
              {pendingEmail ?? "your email"}
            </span>
            .
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={OTP_INPUT_KEYS[index]}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="h-12 w-12 rounded-lg border border-gray-300 text-center text-lg font-semibold shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            ))}
          </div>

          {error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {successMessage}
            </p>
          ) : null}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={!isOtpComplete || isVerifying}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-4 text-center text-sm text-gray-600">
          {timer > 0 ? (
            <p>
              Resend OTP in{" "}
              <span className="font-semibold text-indigo-600">{timer}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-medium text-indigo-600 hover:underline"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Back to Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Wrong email or number?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
}
