import type { Metadata } from "next";
import Link from "next/link";
import CourseCard from "@/components/courses/CourseCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { fetchApiResponse } from "@/lib/public-api";
import type { Course } from "@/lib/types";

export const metadata: Metadata = {
  title: "Courses | Draftien",
  description: "Explore Draftien LMS courses for exam preparation.",
};

type CoursesSearchParams = {
  search?: string;
  category?: string;
  page?: string;
};

interface CoursesPageProps {
  searchParams: Promise<CoursesSearchParams>;
}

function toQueryString(params: CoursesSearchParams): string {
  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }
  if (params.category?.trim()) {
    query.set("category", params.category.trim());
  }
  if (params.page?.trim()) {
    query.set("page", params.page.trim());
  }

  query.set("limit", "12");

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  let courses: Course[] = [];
  let pagination: { page: number; totalPages: number } | undefined;
  let loadError: string | null = null;

  try {
    const response = await fetchApiResponse<Course[]>(
      `/courses${toQueryString(params)}`,
    );
    courses = response.data;
    pagination = response.pagination
      ? {
          page: response.pagination.page,
          totalPages: response.pagination.totalPages,
        }
      : undefined;
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load courses.";
  }

  return (
    <section className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-up rounded-2xl border border-border/70 bg-surface/90 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="secondary">Draftien LMS</Badge>
              <h1 className="mt-2 text-4xl text-foreground sm:text-5xl">
                Explore Courses
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Live catalog from the API with category/search filters and
                course-level details.
              </p>
            </div>

            <form className="w-full sm:w-auto" action="/courses" method="get">
              <div className="flex gap-2">
                <input
                  name="search"
                  defaultValue={params.search ?? ""}
                  placeholder="Search title or description"
                  className="h-10 min-w-60 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button type="submit">Search</Button>
              </div>
            </form>
          </div>
        </div>

        {loadError ? (
          <div className="mt-10 rounded-xl border border-dashed border-danger/50 bg-surface p-10 text-center">
            <h2 className="text-2xl text-foreground">Unable to load courses</h2>
            <p className="mt-2 text-sm text-danger">{loadError}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-surface p-10 text-center">
            <h2 className="text-2xl text-foreground">No courses found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing filters or searching with a different keyword.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-2">
            {Array.from(
              { length: pagination.totalPages },
              (_, index) => index + 1,
            ).map((pageNumber) => {
              const query = new URLSearchParams();
              if (params.search) query.set("search", params.search);
              if (params.category) query.set("category", params.category);
              query.set("page", String(pageNumber));

              const isCurrent = pageNumber === pagination.page;

              return (
                <Link
                  key={pageNumber}
                  href={`/courses?${query.toString()}`}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm ${
                    isCurrent
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-foreground hover:bg-muted"
                  }`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
