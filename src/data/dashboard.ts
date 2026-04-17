import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  MessageCircle,
  Settings,
  User,
  Users,
} from "lucide-react";

export const studentLinks = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Assignments", href: "/student/assignments", icon: ClipboardList },
  { label: "Schedule", href: "/student/schedule", icon: Calendar },
  { label: "Messages", href: "/student/messages", icon: MessageCircle },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Profile", href: "/student/profile", icon: User },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

export const teacherLinks = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "My Classes", href: "/teacher/classes", icon: BookOpen },
  { label: "Students", href: "/teacher/students", icon: Users },
  { label: "Schedule", href: "/teacher/schedule", icon: Calendar },
  { label: "Messages", href: "/teacher/messages", icon: MessageCircle },
  { label: "Analytics", href: "/teacher/analytics", icon: BarChart3 },
  { label: "Profile", href: "/teacher/profile", icon: User },
  { label: "Settings", href: "/teacher/settings", icon: Settings },
];
