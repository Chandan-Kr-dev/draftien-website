"use client";

import { FileBadge2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { formatDate } from "@/lib/format";
import {
  generateCertificate,
  getCertificates,
  getMyCourses,
} from "@/lib/lms-api";
import type { CertificateWithDetails, StudentCourse } from "@/lib/types";

export default function StudentCertificatesPage() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [certificates, setCertificates] = useState<CertificateWithDetails[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingCourseId, setGeneratingCourseId] = useState<string | null>(
    null,
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [myCourses, myCertificates] = await Promise.all([
        getMyCourses(),
        getCertificates(),
      ]);

      setCourses(myCourses as StudentCourse[]);
      setCertificates(myCertificates);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Could not load certificate data."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const eligibleCourses = useMemo(() => {
    const issuedCourseIds = new Set(
      certificates.map((certificate) => certificate.courseId),
    );

    return courses.filter(
      (course) =>
        course.progressPercentage >= 100 && !issuedCourseIds.has(course.id),
    );
  }, [certificates, courses]);

  const handleGenerate = async (courseId: string) => {
    setGeneratingCourseId(courseId);
    setError(null);

    try {
      await generateCertificate(courseId);
      await loadData();
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Could not generate certificate."),
      );
    } finally {
      setGeneratingCourseId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading certificates...</p>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Badge variant="success">Achievements</Badge>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>
            Generate certificates for completed courses and verify issued
            records.
          </CardDescription>
        </CardHeader>
      </Card>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Ready to generate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {eligibleCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-background px-4 py-3"
            >
              <p className="font-medium text-foreground">{course.title}</p>
              <Button
                size="sm"
                onClick={() => handleGenerate(course.id)}
                disabled={generatingCourseId === course.id}
              >
                {generatingCourseId === course.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          ))}

          {eligibleCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No completed courses pending certificate generation.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Issued certificates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-background px-4 py-3"
            >
              <div>
                <p className="font-medium text-foreground">
                  {certificate.courseTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  #{certificate.certificateNumber} ·{" "}
                  {formatDate(certificate.issuedAt)}
                </p>
              </div>

              <Link
                href={`/certificates/${certificate.id}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <FileBadge2 className="h-4 w-4" />
                View
              </Link>
            </div>
          ))}

          {certificates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No certificates issued yet.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
