"use client";

import CourseCard from "@/components/courses/CourseCard";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/courses");
        const data = response.data?.data || response.data;
        setCourses(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="min-h-screen bg-[#F5F3FF] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Our Programs
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover expertly crafted programs designed to help you excel.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-gray-600 font-medium">Loading programs...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            <p>No programs available at the moment. Please check back later!</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={{
                  ...course,
                  image: course.thumbnailUrl || "/images/courses/course1.png",
                  tag: course.category || "General",
                  tagColor: "bg-indigo-600",
                  students: "Enrolling Now",
                  originalPrice: "₹" + (course.price * 1.5).toLocaleString(),
                  price: "₹" + course.price.toLocaleString(),
                  duration: course.durationHours ? `${course.durationHours} Hours` : "Flexible"
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
