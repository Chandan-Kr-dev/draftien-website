import {
  Award,
  BookOpen,
  Heart,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";

export const studentLinks = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "Wishlist", href: "/student/wishlist", icon: Heart },
  { label: "Certificates", href: "/student/certificates", icon: Award },
  { label: "Profile", href: "/student/profile", icon: User },
];

export const teacherLinks = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "My Courses", href: "/teacher/courses", icon: BookOpen },
  { label: "Students", href: "/teacher/students", icon: Users },
  { label: "Profile", href: "/teacher/profile", icon: User },
];
