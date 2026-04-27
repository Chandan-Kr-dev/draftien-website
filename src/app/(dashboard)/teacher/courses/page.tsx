"use client";

import { Eye, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrencyINR, formatDurationHours } from "@/lib/format";
import { getTeacherCourses, updateCoursePublishState } from "@/lib/lms-api";
import type { Course } from "@/lib/types";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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
          setError(getApiErrorMessage(requestError, "Could not load courses."));
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

  const handlePublishToggle = async (course: Course) => {
    setSavingId(course.id);
    setError(null);

    try {
      const updated = await updateCoursePublishState(
        course.id,
        !course.isPublished,
      );
      setCourses((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Could not update publish state."),
      );
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading courses...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Badge>Teaching content</Badge>
          <CardTitle>Course management</CardTitle>
          <CardDescription>
            Publish/unpublish and review course metadata from your teacher
            account.
          </CardDescription>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No courses available. Create a course from the admin/teacher flow.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="space-y-3 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xl text-foreground">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.category ?? "General"} ·{" "}
                      {formatDurationHours(course.durationHours)}
                    </p>
                  </div>

                  <Badge variant={course.isPublished ? "success" : "outline"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {course.description ?? "No description provided."}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-foreground">
                    {formatCurrencyINR(course.price)}
                  </p>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      <Eye className="mr-1 inline h-4 w-4" />
                      Preview
                    </Link>
                    <Button
                      size="sm"
                      variant={course.isPublished ? "outline" : "primary"}
                      onClick={() => handlePublishToggle(course)}
                      disabled={savingId === course.id}
                    >
                      {savingId === course.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <UploadCloud className="mr-2 h-4 w-4" />
                          {course.isPublished ? "Unpublish" : "Publish"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
