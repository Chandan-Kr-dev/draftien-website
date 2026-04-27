import {
  ArrowLeft,
  BookOpenText,
  CircleDollarSign,
  Clock4,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CourseActions from "@/components/courses/CourseActions";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrencyINR, formatDurationHours } from "@/lib/format";
import { fetchApiData } from "@/lib/public-api";
import type { CourseDetail } from "@/lib/types";

interface CourseDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

function getLevelBadge(level: CourseDetail["level"]) {
  if (level === "advanced") return "warning" as const;
  if (level === "intermediate") return "secondary" as const;
  return "default" as const;
}

export default async function CourseDetailsPage({
  params,
}: CourseDetailsProps) {
  const { id } = await params;

  let course: CourseDetail;

  try {
    course = await fetchApiData<CourseDetail>(`/courses/${id}`);
  } catch {
    notFound();
  }

  return (
    <section className="min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <Card className="overflow-hidden">
            <div
              className="relative min-h-52 w-full p-6 text-white"
              style={{
                backgroundImage: course.thumbnailUrl
                  ? `linear-gradient(120deg, rgba(16, 24, 40, 0.72), rgba(16, 24, 40, 0.2)), url(${course.thumbnailUrl})`
                  : "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 76%, black 6%), color-mix(in oklab, var(--color-accent) 78%, black 10%))",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-wrap gap-2">
                {course.category ? (
                  <Badge variant="secondary">{course.category}</Badge>
                ) : null}
                <Badge variant={getLevelBadge(course.level)}>
                  {course.level}
                </Badge>
              </div>

              <h1 className="mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
                {course.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">
                {course.description ??
                  "A complete course with structured lessons, guided learning, and assessment checkpoints."}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/95">
                <span className="inline-flex items-center gap-1.5">
                  <Clock4 className="h-4 w-4" />
                  {formatDurationHours(course.durationHours)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" />
                  {course.teacherName ?? "Draftien Faculty"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpenText className="h-4 w-4" />
                  {course.lessons.length} lessons
                </span>
              </div>
            </div>

            <CardContent className="pt-6">
              <h2 className="text-2xl">Syllabus</h2>
              <div className="mt-4 space-y-2">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {index + 1}. {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.contentType.toUpperCase()}{" "}
                        {lesson.isFree
                          ? "- Free preview"
                          : "- Enrolled students"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {lesson.durationMinutes ?? 0} mins
                      </Badge>
                      {lesson.isFree ? (
                        <Badge variant="success">Free</Badge>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-accent" />
                Course Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="font-display text-4xl text-foreground">
                  {formatCurrencyINR(course.price)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  One-time course enrollment with lesson tracking and
                  certificates.
                </p>
              </div>

              <CourseActions courseId={course.id} />

              <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                After enrollment, progress and certificates are available in
                your student dashboard.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
