import { BrainCircuit, GraduationCap, Headphones, Video } from "lucide-react";

export const navLinks = [
  { name: "Browse Courses", href: "/courses" },
  { name: "Student Area", href: "/student" },
  { name: "Teacher Area", href: "/teacher" },
  { name: "Certificates", href: "/student/certificates" },
];

export const features = [
  {
    icon: Video,
    title: "Interactive LIVE Classes",
    description:
      "Real-time interaction with India's top 1% educators. Don’t just watch, participate in active learning.",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: GraduationCap,
    title: "Expert Faculty",
    description:
      "Learn from IITians and Doctors who have mastered the art of simplified conceptual teaching.",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Headphones,
    title: "24/7 Doubt Solving",
    description:
      "Never get stuck again. Snap a photo and get detailed video solutions from experts in minutes.",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Learning",
    description:
      "Personalized insights, smart recommendations, and adaptive practice powered by AI.",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export interface Faculty {
  id: number;
  name: string;
  title: string;
  achievement: string;
  image: string;
}

export const facultyMembers: Faculty[] = [
  {
    id: 1,
    name: "Dr. Arpita Sharma",
    title: "Head of Biology, AIIMS Alumna",
    achievement: "12+ Years Experience",
    image: "/images/faculty/faculty1.png",
  },
  {
    id: 2,
    name: "Prof. Vikram Sethi",
    title: "Physics Maestro, IIT Bombay Graduate",
    achievement: "Mentored 50+ Top 100 AIRs",
    image: "/images/faculty/faculty2.png",
  },
  {
    id: 3,
    name: "Amit Verma",
    title: "Chemistry Lead, Ex-VMC Faculty",
    achievement: "Organic Chemistry Specialist",
    image: "/images/faculty/faculty3.png",
  },
  {
    id: 4,
    name: "Rohan Das",
    title: "Mathematics Wizard",
    achievement: "Calculus & AI Expert",
    image: "/images/faculty/faculty4.png",
  },
  {
    id: 5,
    name: "Neha Kapoor",
    title: "Senior Physics Educator",
    achievement: "10+ Years Experience",
    image: "/images/faculty/faculty5.png",
  },
  {
    id: 6,
    name: "Rahul Mehta",
    title: "IIT Delhi Alumnus",
    achievement: "JEE Advanced Specialist",
    image: "/images/faculty/faculty6.png",
  },
];

// Program data was moved to `src/data/courses.ts`.
