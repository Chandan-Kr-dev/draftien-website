import { BrainCircuit, GraduationCap, Headphones, Video } from "lucide-react";

export const navLinks = [
  { name: "Browse Courses", href: "#" },
  { name: "Live Classes", href: "#" },
  { name: "Study Material", href: "#" },
  { name: "Test Series", href: "#" },
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

export interface Program {
  id: number;
  tag: string;
  tagColor: string;
  image: string;
  title: string;
  description: string;
  duration: string;
  students: string;
  originalPrice: string;
  price: string;
}

export const programs: Program[] = [
  {
    id: 1,
    tag: "JEE MAIN & ADV",
    tagColor: "bg-indigo-600",
    image: "/images/courses/course1.png",
    title: "JEE Achiever Batch 2025",
    description:
      "Complete syllabus coverage for Class 12 and Repeaters with weekly mock tests.",
    duration: "12 Months",
    students: "2.5k Students",
    originalPrice: "₹24,999",
    price: "₹14,999",
  },
  {
    id: 2,
    tag: "NEET UG",
    tagColor: "bg-pink-500",
    image: "/images/courses/course2.png",
    title: "NEET Mastery Elite",
    description:
      "In-depth Biology focus with NCERT-centric approach and daily practice problems.",
    duration: "10 Months",
    students: "4.1k Students",
    originalPrice: "₹19,999",
    price: "₹12,499",
  },
  {
    id: 3,
    tag: "FOUNDATION",
    tagColor: "bg-purple-600",
    image: "/images/courses/course3.png",
    title: "9th & 10th Pro Early Start",
    description:
      "Building strong fundamentals for Olympiads and early JEE/NEET competitive mindset.",
    duration: "24 Months",
    students: "1.2k Students",
    originalPrice: "₹29,999",
    price: "₹18,999",
  },
];
