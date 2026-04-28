"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { studentLinks } from "@/data/dashboard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    console.log("StudentLayout check:", { userId: user?.id, role: user?.role });

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "student") {
      console.warn("Redirecting from student dashboard: role is not student");
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardShell role="student" links={studentLinks}>
      {children}
    </DashboardShell>
  );
}
