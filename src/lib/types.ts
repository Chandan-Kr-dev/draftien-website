export type UserRole = "student" | "teacher" | "admin" | null;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  mobileNumber: string | null;
  role: UserRole;
  isVerified: boolean;
}

export interface UserProfile extends AuthUser {
  notificationToken: string | null;
  isOnboarded: boolean;
  isActive: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  teacherId: string;
  teacherName: string | null;
  price: number;
  durationHours: number | null;
  level: "beginner" | "intermediate" | "advanced";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  contentType: "video" | "pdf" | "text" | "quiz";
  contentUrl: string | null;
  durationMinutes: number | null;
  orderIndex: number;
  isFree: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetail extends Course {
  lessons: Array<{
    id: string;
    title: string;
    description: string | null;
    contentType: Lesson["contentType"];
    durationMinutes: number | null;
    orderIndex: number;
    isFree: boolean;
    isPublished: boolean;
  }>;
  progress: {
    percentage: number;
    lastAccessedAt: string | null;
  } | null;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  progressPercentage: number;
}

export interface StudentCourse extends Course {
  progressPercentage: number;
  enrolledAt: string;
}

export interface CourseProgress {
  progressPercentage: number;
  lessons: Array<{
    id: string;
    title: string;
    isCompleted: boolean;
    completedAt: string | null;
    watchTimeSeconds: number;
  }>;
}

export interface TeacherCourseProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  progressPercentage: number;
  enrolledAt: string;
  lastAccessedAt: string | null;
}

export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  progressPercentage: number;
  lastAccessedAt: string | null;
}

export interface WishlistItem {
  id: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    category: string | null;
    teacherName: string | null;
    price: number;
    level: Course["level"];
  };
}

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: string;
  pdfUrl: string | null;
  verificationCode: string;
  isRevoked: boolean;
}

export interface CertificateWithDetails extends Certificate {
  courseTitle: string;
  teacherName: string | null;
}

export interface CertificateDetail extends Certificate {
  courseTitle: string;
  studentName: string;
  teacherName: string | null;
}
