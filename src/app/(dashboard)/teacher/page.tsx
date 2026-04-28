"use client";

import { BookOpen, BookUp2, CircleOff, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrencyINR } from "@/lib/format";
import { getTeacherCourses } from "@/lib/lms-api";
import type { Course } from "@/lib/types";

export default function TeacherPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      setLoading(true);
      setError(null);

      try {
        const data = await getTeacherCourses();
        if (mounted) {
          setCourses(data);
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            getApiErrorMessage(
              requestError,
              "Could not load teacher dashboard.",
            ),
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

  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter((course) => course.isPublished).length;
    const drafts = total - published;
    const estimatedRevenue = courses.reduce(
      (sum, course) => sum + course.price,
      0,
    );

    return {
      total,
      published,
      drafts,
      estimatedRevenue,
    };
  }, [courses]);

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading teacher dashboard...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/55">
        <CardHeader>
          <Badge variant="secondary">Teacher console</Badge>
          <CardTitle>Manage courses and learners</CardTitle>
          <CardDescription>
            This view is wired to `/courses/my`, `/courses/:id/students`, and
            `/progress/teacher/:courseId`.
          </CardDescription>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={BookOpen}
          label="Total courses"
          value={String(stats.total)}
        />
        <Stat
          icon={BookUp2}
          label="Published"
          value={String(stats.published)}
        />
        <Stat icon={CircleOff} label="Drafts" value={String(stats.drafts)} />
        <Stat
          icon={Rocket}
          label="Course value"
          value={formatCurrencyINR(stats.estimatedRevenue)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent courses</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {courses.slice(0, 5).map((course) => (
            <div
              key={course.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-background px-4 py-3"
            >
              <div>
                <p className="font-medium text-foreground">{course.title}</p>
                <p className="text-xs text-muted-foreground">
                  {course.category ?? "General"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={course.isPublished ? "success" : "outline"}>
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
                <Link
                  href={`/teacher/courses`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}

          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No courses created yet.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({
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
