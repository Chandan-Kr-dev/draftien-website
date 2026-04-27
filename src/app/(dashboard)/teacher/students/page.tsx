"use client";

import { Loader2, Users } from "lucide-react";
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
import { formatDate } from "@/lib/format";
import {
  getCourseStudents,
  getTeacherCourseProgress,
  getTeacherCourses,
} from "@/lib/lms-api";
import type { Course, CourseStudent, TeacherCourseProgress } from "@/lib/types";

export default function TeacherStudentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [progressData, setProgressData] = useState<TeacherCourseProgress[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      setLoadingCourses(true);
      setError(null);

      try {
        const data = await getTeacherCourses();

        if (!mounted) {
          return;
        }

        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId((current) => current || data[0]?.id || "");
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            getApiErrorMessage(requestError, "Could not load teacher courses."),
          );
        }
      } finally {
        if (mounted) {
          setLoadingCourses(false);
        }
      }
    }

    loadCourses();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      return;
    }

    let mounted = true;

    async function loadStudents() {
      setLoadingStudents(true);
      setError(null);

      try {
        const [studentRows, progressRows] = await Promise.all([
          getCourseStudents(selectedCourseId),
          getTeacherCourseProgress(selectedCourseId),
        ]);

        if (!mounted) {
          return;
        }

        setStudents(studentRows);
        setProgressData(progressRows);
      } catch (requestError) {
        if (mounted) {
          setError(
            getApiErrorMessage(requestError, "Could not load student roster."),
          );
        }
      } finally {
        if (mounted) {
          setLoadingStudents(false);
        }
      }
    }

    loadStudents();

    return () => {
      mounted = false;
    };
  }, [selectedCourseId]);

  const progressByStudentId = useMemo(() => {
    return progressData.reduce<Record<string, TeacherCourseProgress>>(
      (accumulator, row) => {
        accumulator[row.studentId] = row;
        return accumulator;
      },
      {},
    );
  }, [progressData]);

  if (loadingCourses) {
    return <p className="text-sm text-muted-foreground">Loading courses...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Badge variant="secondary">Learner analytics</Badge>
          <CardTitle>Course students</CardTitle>
          <CardDescription>
            Select a course to inspect enrollment and progress
            (`/courses/:id/students` and `/progress/teacher/:id`).
          </CardDescription>
        </CardHeader>

        <CardContent>
          <select
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            className="h-10 w-full max-w-md rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {loadingStudents ? (
        <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading students...
        </p>
      ) : students.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No students enrolled for this course yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {students.map((student) => {
            const progress = progressByStudentId[student.id];
            const completion =
              progress?.progressPercentage ?? student.progressPercentage;

            return (
              <Card key={student.id}>
                <CardContent className="space-y-2 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {student.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>

                    <Badge variant="outline">{Math.round(completion)}%</Badge>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.max(0, Math.min(100, completion))}%`,
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
                    <p>Enrolled: {formatDate(student.enrolledAt)}</p>
                    <p>
                      Last active:{" "}
                      {formatDate(
                        progress?.lastAccessedAt ?? student.lastAccessedAt,
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="inline-flex items-center gap-2 pt-6 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Create and publish a course first to see student data.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
