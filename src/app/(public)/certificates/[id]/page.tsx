import { BadgeCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { fetchApiData } from "@/lib/public-api";
import type { CertificateDetail } from "@/lib/types";

interface CertificatePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CertificatePage({
  params,
}: CertificatePageProps) {
  const { id } = await params;

  let certificate: CertificateDetail;

  try {
    certificate = await fetchApiData<CertificateDetail>(`/certificates/${id}`);
  } catch {
    notFound();
  }

  return (
    <section className="min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-primary/30">
          <CardHeader className="bg-gradient-to-r from-primary/12 to-secondary/50">
            <Badge variant="success" className="w-fit">
              Verified certificate
            </Badge>
            <CardTitle className="mt-2 text-4xl">
              {certificate.courseTitle}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Certificate #{certificate.certificateNumber}
            </p>
          </CardHeader>

          <CardContent className="space-y-4 pt-6">
            <InfoRow label="Student" value={certificate.studentName} />
            <InfoRow
              label="Instructor"
              value={certificate.teacherName ?? "Draftien Faculty"}
            />
            <InfoRow
              label="Issued on"
              value={formatDate(certificate.issuedAt)}
            />

            <div className="rounded-lg border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/35 dark:text-emerald-100">
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                This certificate is valid and verifiable.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/courses"
                className="text-sm font-medium text-primary hover:underline"
              >
                Explore courses
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <BadgeCheck className="h-4 w-4" />
                Continue learning
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}
