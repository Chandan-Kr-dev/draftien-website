"use client";

import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrencyINR, formatDurationHours } from "@/lib/format";
import { getMyCourses } from "@/lib/lms-api";
import type { StudentCourse } from "@/lib/types";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      setLoading(true);
      setError(null);

      try {
        const data = (await getMyCourses()) as StudentCourse[];

        if (!mounted) {
          return;
        }

        setCourses(data);
      } catch (requestError) {
        if (mounted) {
          setError(
            getApiErrorMessage(requestError, "Could not load your courses."),
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading courses...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Badge>My learning</Badge>
          <CardTitle>Enrolled courses</CardTitle>
          <CardDescription>
            These courses come from `GET /courses/my` for your student account.
          </CardDescription>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            You are not enrolled yet. Browse{" "}
            <Link href="/courses" className="text-primary hover:underline">
              courses
            </Link>{" "}
            to start.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl text-foreground">{course.title}</h3>
                  <Badge variant="outline">{course.level}</Badge>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {course.description ?? "No description provided."}
                </p>

                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <p>{formatDurationHours(course.durationHours)}</p>
                  <p>{formatCurrencyINR(course.price)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(course.progressPercentage)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.max(0, Math.min(100, course.progressPercentage))}%`,
                      }}
                    />
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  Open course
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
