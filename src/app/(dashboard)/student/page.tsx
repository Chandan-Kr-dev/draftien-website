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
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const [myCourses, myCertificates] = await Promise.all([
          getMyCourses(),
          getCertificates(),
        ]);

        const studentCourses = myCourses as StudentCourse[];

        const progressEntries = await Promise.all(
          studentCourses.slice(0, 4).map(async (course) => {
            try {
              const progress = await getCourseProgress(course.id);
              return [course.id, progress] as const;
            } catch {
              return null;
            }
          }),
        );

        if (!mounted) {
          return;
        }

        setCourses(studentCourses);
        setCertificates(myCertificates);
        setProgressMap(
          progressEntries.reduce<Record<string, CourseProgress>>(
            (accumulator, current) => {
              if (current) {
                accumulator[current[0]] = current[1];
              }
              return accumulator;
            },
            {},
          ),
        );
      } catch (requestError) {
        if (mounted) {
          setError(
            getApiErrorMessage(
              requestError,
              "Could not load student dashboard data.",
            ),
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(
      (course) => course.progressPercentage >= 100,
    ).length;
    const averageProgress =
      totalCourses > 0
        ? Math.round(
            courses.reduce(
              (sum, course) => sum + course.progressPercentage,
              0,
            ) / totalCourses,
          )
        : 0;

    return {
      totalCourses,
      completedCourses,
      averageProgress,
      certificates: certificates.length,
    };
  }, [certificates.length, courses]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading dashboard...</p>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-accent/8">
        <CardHeader>
          <Badge>Student dashboard</Badge>
          <CardTitle>Keep your preparation momentum</CardTitle>
          <CardDescription>
            Progress and certificate status are synced directly from the LMS
            API.
          </CardDescription>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Enrolled"
          value={String(stats.totalCourses)}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg progress"
          value={`${stats.averageProgress}%`}
        />
        <StatCard
          icon={Clock3}
          label="Completed"
          value={String(stats.completedCourses)}
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={String(stats.certificates)}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>My courses</CardTitle>
            <CardDescription>
              Top enrolled courses and current progress.
            </CardDescription>
          </div>
          <Link
            href="/student/courses"
            className="inline-flex h-8 items-center rounded-md border border-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {courses.slice(0, 4).map((course) => {
            const lessonSummary = progressMap[course.id]?.lessons;
            const completedLessons = lessonSummary
              ? lessonSummary.filter((lesson) => lesson.isCompleted).length
              : null;

            return (
              <div
                key={course.id}
                className="rounded-lg border border-border/70 bg-background px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {completedLessons !== null
                      ? `${completedLessons}/${lessonSummary.length} lessons`
                      : "Lesson progress unavailable"}
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.max(0, Math.min(100, course.progressPercentage))}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.progressPercentage.toFixed(0)}% complete</span>
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-primary hover:underline"
                  >
                    Open course
                  </Link>
                </div>
              </div>
            );
          })}

          {courses.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
              You are not enrolled in any courses yet. Browse the catalog to
              start learning.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest certificates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {certificates.slice(0, 3).map((certificate) => (
            <div
              key={certificate.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-background px-4 py-3"
            >
              <div>
                <p className="font-medium text-foreground">
                  {certificate.courseTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  Issued on {formatDate(certificate.issuedAt)}
                </p>
              </div>
              <Link
                href={`/certificates/${certificate.id}`}
                className="text-sm text-primary hover:underline"
              >
                View
              </Link>
            </div>
          ))}

          {certificates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No certificates yet.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between pt-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl text-foreground">{value}</p>
        </div>
        <div className="rounded-lg bg-primary/12 p-2 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
