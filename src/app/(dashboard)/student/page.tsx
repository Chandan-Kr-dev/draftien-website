"use client";

import { BookOpen, Clock, Flame, PlayCircle, Trophy } from "lucide-react";

export default function StudentPage() {
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
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Continue Learning
        </h2>

        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/10">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Physics - Laws of Motion
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Lesson 3 of 10
            </p>
          </div>

          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">
            <PlayCircle size={16} />
            Resume
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Courses Enrolled" value="6" icon={BookOpen} />
        <StatCard title="Hours Learned" value="124h" icon={Clock} />
        <StatCard title="Completed" value="3 Courses" icon={Trophy} />
      </div>

      {/* My Courses */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          My Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Physics", progress: 70 },
            { name: "Chemistry", progress: 45 },
            { name: "Mathematics", progress: 80 },
          ].map((course, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-gray-200 dark:border-white/10"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                {course.name}
              </p>

              <div className="mt-2 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {course.progress}% completed
              </p>
            </div>
          ))}
        </div>
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
