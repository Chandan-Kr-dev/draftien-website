import { ArrowRight, Clock3, Gauge, UserRound } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { formatCurrencyINR, formatDurationHours } from "@/lib/format";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
}

function buildThumbnailStyle(thumbnailUrl: string | null) {
  if (thumbnailUrl) {
    return {
      backgroundImage: `linear-gradient(to top, rgba(10,10,20,0.5), rgba(10,10,20,0.12)), url(${thumbnailUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    } as const;
  }

  return {
    backgroundImage:
      "linear-gradient(140deg, color-mix(in oklab, var(--color-primary) 78%, white), color-mix(in oklab, var(--color-accent) 74%, white))",
  } as const;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden border-border/70 transition-transform duration-300 hover:-translate-y-1">
      <div
        className="relative h-48 w-full"
        style={buildThumbnailStyle(course.thumbnailUrl)}
      >
        <div className="absolute left-4 top-4 flex gap-2">
          {course.category ? (
            <Badge variant="secondary">{course.category}</Badge>
          ) : null}
          <Badge variant="outline" className="bg-white/85 text-foreground">
            {course.level}
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="line-clamp-2 font-display text-xl leading-tight">
            {course.title}
          </h3>
        </div>
      </div>

      <CardContent className="pt-4">
        <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {course.description ??
            "Comprehensive learning modules with guided practice and assessments."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDurationHours(course.durationHours)}
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" />
            {course.level}
          </div>
          <div className="col-span-2 inline-flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5" />
            {course.teacherName ?? "Draftien Faculty"}
          </div>
        </div>
      </CardContent>

      <CardFooter className="items-center justify-between">
        <p className="font-display text-xl text-foreground">
          {formatCurrencyINR(course.price)}
        </p>

        <Link
          href={`/courses/${course.id}`}
          className="inline-flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
