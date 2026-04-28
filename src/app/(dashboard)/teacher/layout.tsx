"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { teacherLinks } from "@/data/dashboard";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "student") {
      router.replace("/student");
      return;
    }

    if (user.role !== "teacher") {
      router.replace("/select-role");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardShell panel="teacher" links={teacherLinks}>
      {children}
    </DashboardShell>
  );
}
