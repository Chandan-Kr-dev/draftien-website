"use client";

import { ArrowLeft, Calendar, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";

interface CourseDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  price: number;
  durationHours: number;
  level: string;
}

export default function CourseDetailsPage({ params }: CourseDetailsProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/api/courses/${id}`);
        // The backend might return { data: course } or course directly
        const data = response.data?.data || response.data;
        setCourse(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("Course not found");
        } else {
          setError("Failed to load course details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsEnrolling(true);
    setError(null);

    try {
      await api.post(`/api/courses/${id}/enroll`);
      setSuccess(true);
      setTimeout(() => {
        router.push("/student");
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to enroll in course. Please try again.";
      setError(message);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Oops!</h2>
          <p className="mt-2 text-gray-600">{error || "Course not found"}</p>
          <Link href="/courses" className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-white">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const courseImage = course?.thumbnailUrl || "/images/courses/course1.png";
  const originalPrice = "₹" + ((course?.price || 0) * 1.5).toLocaleString();
  const displayPrice = "₹" + (course?.price || 0).toLocaleString();

  return (
    <section className="min-h-screen bg-[#F5F3FF] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Courses
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Course Image */}
          <div className="relative h-[350px] w-full overflow-hidden rounded-2xl bg-white shadow-md">
            <Image
              src={courseImage}
              alt={course?.title || "Course Image"}
              fill
              className="object-cover"
              priority
            />

            {/* Tag Badge */}
            <span
              className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white"
            >
              {course?.category || "Program"}
            </span>
          </div>

          {/* Course Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {course?.title}
              </h1>

              <p className="mt-4 text-lg text-gray-600">{course?.description}</p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {course?.durationHours ? `${course.durationHours} Hours` : "Flexible Duration"}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  Enrolling Now
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-bold text-indigo-600">
                  {displayPrice}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {originalPrice}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={handleEnroll}
                disabled={isEnrolling || success}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isEnrolling ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Enrolling...
                  </>
                ) : success ? (
                  "Enrolled Successfully!"
                ) : (
                  "Enroll Now"
                )}
              </button>
              <button
                type="button"
                className="rounded-lg border border-indigo-600 px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                Add to Wishlist
              </button>
            </div>

            {/* Messages */}
            {error && !loading && course && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">
                Successfully enrolled! Redirecting to your dashboard...
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
