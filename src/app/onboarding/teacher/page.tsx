"use client";

import { CheckCircle, Circle, FileText, Upload, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import type { UserProfile } from "@/lib/types";

type ExamType = "JEE" | "NEET";

export default function TeacherOnboardingPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [experience, setExperience] = useState("");
  const [examSpecialization, setExamSpecialization] = useState<ExamType | null>(
    null,
  );
  const [subjects, setSubjects] = useState<string[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();
  const { syncUser } = useAuth();

  const subjectOptions: Record<ExamType, string[]> = {
    JEE: ["Physics", "Chemistry", "Mathematics"],
    NEET: ["Physics", "Chemistry", "Biology"],
  };

  const toggleSubject = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setResume(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!mobile.trim() || mobile.length < 10) {
      alert("Enter a valid mobile number.");
      return;
    }

    if (!examSpecialization) {
      alert("Please select JEE or NEET.");
      return;
    }

    if (subjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }

    if (!experience.trim()) {
      alert("Please enter your experience.");
      return;
    }

    const experienceNum = Number(experience);
    if (!Number.isFinite(experienceNum) || experienceNum < 0) {
      alert("Please enter a valid experience number.");
      return;
    }
    if (!Number.isInteger(experienceNum)) {
      alert("Experience should be a whole number.");
      return;
    }

    try {
      setLoading(true);

      const meRes = await api.get("/api/users/me");
      const me = meRes.data?.data as {
        role: "student" | "teacher" | null;
      };

      await api.patch("/api/users/me", {
        name,
        mobileNumber: mobile,
      });

      await api.patch("/api/users/profile", {
        ...(me.role ? {} : { role: "teacher" }),
        subjects,
        experience: experienceNum,
        examSpecialization: examSpecialization ?? undefined,
        // Resume upload isn't wired yet; backend accepts an optional resumeUrl.
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

      router.push("/teacher");
    } catch (error) {
      console.error("Teacher onboarding failed:", error);
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
            <User className="h-7 w-7 text-indigo-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Teacher Onboarding
          </h1>
          <p className="mt-2 text-gray-600">
            Share your expertise and start teaching on Draftien.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Specialization */}
          <div>
            <label
              htmlFor="examSpecialization"
              className="mb-3 block text-sm font-medium text-gray-700"
            >
              Specialization
            </label>

            {(["JEE", "NEET"] as ExamType[]).map((exam) => (
              <button
                type="button"
                key={exam}
                onClick={() => {
                  setExamSpecialization(exam);
                  setSubjects([]);
                }}
                className={`mb-3 flex w-full items-center rounded-xl border px-4 py-3 transition ${
                  examSpecialization === exam
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
              >
                {examSpecialization === exam ? (
                  <CheckCircle className="text-indigo-600" size={20} />
                ) : (
                  <Circle className="text-gray-400" size={20} />
                )}
                <span className="ml-3 text-gray-800">{exam}</span>
              </button>
            ))}
          </div>

          {/* Subjects */}
          {examSpecialization && (
            <div>
              <label
                htmlFor="subjects"
                className="mb-3 block text-sm font-medium text-gray-700"
              >
                Subjects
              </label>
              <div className="flex flex-wrap gap-3">
                {subjectOptions[examSpecialization].map((subject) => {
                  const selected = subjects.includes(subject);
                  return (
                    <button
                      type="button"
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-300 text-gray-600 hover:border-indigo-400"
                      }`}
                    >
                      {selected && (
                        <CheckCircle className="h-4 w-4 text-indigo-600" />
                      )}
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Experience */}
          <div>
            <label
              htmlFor="experience"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Teaching Experience (Years)
            </label>
            <input
              type="number"
              placeholder="e.g., 3"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Resume Upload (Optional) */}
          <div>
            <label
              htmlFor="resume"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Upload Resume <span className="text-gray-400">(Optional)</span>
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 px-4 py-4 hover:bg-gray-50">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText size={18} />
                <span className="text-sm">
                  {resume ? resume.name : "Upload PDF or DOC"}
                </span>
              </div>
              <Upload size={18} className="text-gray-500" />
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
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
