import { ArrowLeft, Calendar, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { courses } from "@/data/courses";

interface CourseDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseDetailsPage({
  params,
}: CourseDetailsProps) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

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
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />

            {/* Tag Badge */}
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${course.tagColor}`}
            >
              {course.tag}
            </span>
          </div>

          {/* Course Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {course.title}
              </h1>

              <p className="mt-4 text-lg text-gray-600">{course.description}</p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {course.students}
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-3xl font-bold text-indigo-600">
                  {course.price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {course.originalPrice}
                </span>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Enroll Now
              </button>
              <button
                type="button"
                className="rounded-lg border border-indigo-600 px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
