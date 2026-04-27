"use client";

import { Bookmark, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  addWishlist,
  enrollInCourse,
  getMyCourses,
  getWishlist,
  removeWishlist,
} from "@/lib/lms-api";
import type { StudentCourse, WishlistItem } from "@/lib/types";

export default function CourseActions({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      return;
    }

    let mounted = true;

    async function loadMeta() {
      setIsLoadingMeta(true);
      setError(null);

      try {
        const [courses, wishlist] = await Promise.all([
          getMyCourses(),
          getWishlist(),
        ]);

        if (!mounted) {
          return;
        }

        const studentCourses = courses as StudentCourse[];
        const items = wishlist as WishlistItem[];

        setIsEnrolled(studentCourses.some((course) => course.id === courseId));
        setInWishlist(items.some((item) => item.course.id === courseId));
      } catch {
        if (mounted) {
          setError("Could not load course eligibility right now.");
        }
      } finally {
        if (mounted) {
          setIsLoadingMeta(false);
        }
      }
    }

    loadMeta();

    return () => {
      mounted = false;
    };
  }, [courseId, isAuthenticated, user?.role]);

  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Sign in as a student to enroll or save this course.
        </p>
        <Button onClick={() => router.push("/login")}>
          Sign in to continue
        </Button>
      </div>
    );
  }

  if (user?.role !== "student") {
    return (
      <div className="space-y-3">
        <Badge variant="outline">Read only</Badge>
        <p className="text-sm text-muted-foreground">
          Enrollment and wishlist are available for student accounts.
        </p>
      </div>
    );
  }

  const handleEnroll = async () => {
    setError(null);
    setMessage(null);
    setIsEnrolling(true);

    try {
      await enrollInCourse(courseId);
      setIsEnrolled(true);
      setMessage(
        "Enrollment complete. Open your student dashboard to continue learning.",
      );
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Could not enroll in this course."),
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleWishlistToggle = async () => {
    setError(null);
    setMessage(null);
    setIsUpdatingWishlist(true);

    try {
      if (inWishlist) {
        await removeWishlist(courseId);
        setInWishlist(false);
        setMessage("Removed from wishlist.");
      } else {
        await addWishlist(courseId);
        setInWishlist(true);
        setMessage("Added to wishlist.");
      }
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Could not update wishlist at the moment.",
        ),
      );
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleEnroll}
          disabled={isEnrolled || isEnrolling || isLoadingMeta}
        >
          {isEnrolling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enrolling
            </>
          ) : isEnrolled ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Enrolled
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Enroll now
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={handleWishlistToggle}
          disabled={isUpdatingWishlist || isLoadingMeta}
        >
          {isUpdatingWishlist ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className="mr-2 h-4 w-4" />
          )}
          {inWishlist ? "Saved" : "Save for later"}
        </Button>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
    </div>
  );
}
