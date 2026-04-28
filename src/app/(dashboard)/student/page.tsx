"use client";

import { BookOpen, Clock, Flame, PlayCircle, Trophy, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  progressPercentage: number;
  enrolledAt: string;
  teacherName: string;
}

export default function StudentPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/courses/my");
        // The backend might wrap the data in a 'data' field depending on the controller implementation
        // But looking at the service, it returns the array directly.
        // Let's handle both cases just in case.
        const data = response.data?.data || response.data;
        console.log("Student dashboard courses:", data);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const totalEnrolled = courses.length;
  const completedCourses = courses.filter(c => c.progressPercentage === 100).length;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl p-6">
        <h1 className="text-xl font-semibold mb-1">Welcome back 👋</h1>
        <p className="text-sm text-white/80">
          You’re on a 5-day streak. Keep learning!
        </p>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Flame size={16} />5 Day Streak
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={16} />
            72% Completed
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      {courses.length > 0 && (
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Continue Learning
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/10">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {courses[0].title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Instructor: {courses[0].teacherName}
              </p>
            </div>

            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
              <PlayCircle size={16} />
              Resume
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Courses Enrolled" value={totalEnrolled.toString()} icon={BookOpen} />
        <StatCard title="Hours Learned" value="124h" icon={Clock} />
        <StatCard title="Completed" value={`${completedCourses} Courses`} icon={Trophy} />
      </div>

      {/* My Courses */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          My Courses
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p>Loading your courses...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm py-4">{error}</p>
        ) : courses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">You haven't enrolled in any courses yet.</p>
            <Link href="/courses" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-white/10"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {course.title}
                </p>

                <div className="mt-2 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${course.progressPercentage}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {course.progressPercentage}% completed
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Upcoming Classes
        </h2>

        <div className="space-y-3">
          {[
            { subject: "Physics", time: "10:00 AM" },
            { subject: "Maths", time: "2:00 PM" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/10"
            >
              <p className="text-sm text-gray-900 dark:text-white">
                {item.subject}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>

      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        <Icon size={20} />
      </div>
    </div>
  );
}
