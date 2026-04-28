"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user?.role === "teacher") {
      router.replace("/teacher/profile");
      return;
    }

    if (user?.role === "student") {
      router.replace("/student/profile");
      return;
    }

    router.replace("/select-role");
  }, [loading, router, user?.role]);

  return null;
}
