import CourseCard from "@/components/courses/CourseCard";
import { courses } from "@/data/courses";

export default function CoursesPage() {
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

        {/* Courses Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
