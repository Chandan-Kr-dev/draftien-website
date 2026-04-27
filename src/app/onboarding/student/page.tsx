"use client";

import { CheckCircle, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import type { UserProfile } from "@/lib/types";

export default function StudentOnboardingPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [source, setSource] = useState<string | null>(null);
  const [targetExam, setTargetExam] = useState<"JEE" | "NEET" | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { syncUser } = useAuth();

  const sources = ["YouTube", "Meta", "Friends", "Others"];

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!mobile.trim() || mobile.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    if (!source) {
      alert("Please select how you found us.");
      return;
    }

    if (!targetExam) {
      alert("Please select your target exam.");
      return;
    }

    try {
      setLoading(true);

      const meRes = await api.get("/users/me");
      const me = meRes.data?.data as { role: "student" | "teacher" | null };

      await api.patch("/users/me", {
        name,
        mobileNumber: mobile,
      });

      await api.patch("/users/profile", {
        ...(me.role ? {} : { role: "student" }),
        targetExam: targetExam ?? undefined,
        source: source ?? undefined,
      });

      const updatedMeRes = await api.get("/users/me");
      const updatedMe = updatedMeRes.data?.data as UserProfile;

      syncUser({
        id: updatedMe.id,
        email: updatedMe.email,
        name: updatedMe.name,
        mobileNumber: updatedMe.mobileNumber,
        role: updatedMe.role,
        isVerified: updatedMe.isVerified,
      });

      router.push("/student");
    } catch (error) {
      console.error("Student onboarding failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-lg sm:p-10">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Draftien"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </div>

        {/* Header */}
        <div className="mt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Student Onboarding
          </h1>
          <p className="mt-2 text-gray-600">
            Tell us more about yourself to personalize your learning experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleStart} className="mt-8 space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobile"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              maxLength={10}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Source Selection */}
          <div>
            <label
              htmlFor="source"
              className="mb-3 block text-sm font-medium text-gray-700"
            >
              How did you hear about us?
            </label>
            <div className="flex flex-wrap gap-3">
              {sources.map((item) => {
                const isSelected = source === item;
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setSource(item)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-300 text-gray-600 hover:border-indigo-400"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="h-4 w-4 text-indigo-600" />
                    )}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Exam */}
          <div>
            <label
              htmlFor="targetExam"
              className="mb-3 block text-sm font-medium text-gray-700"
            >
              Target Exam
            </label>

            <div className="space-y-3">
              {(["JEE", "NEET"] as const).map((exam) => (
                <button
                  type="button"
                  key={exam}
                  onClick={() => setTargetExam(exam)}
                  className={`flex w-full items-center rounded-xl border px-4 py-3 text-left transition ${
                    targetExam === exam
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  <div
                    className={`mr-3 h-4 w-4 rounded-full border-2 ${
                      targetExam === exam
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-gray-400"
                    }`}
                  />
                  <span className="text-gray-800">{exam}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 font-semibold text-white transition ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Please wait..." : "Let's Start"}
          </button>
        </form>
      </div>
    </div>
  );
}
