import { api } from "@/lib/axios";
import type {
  ApiResponse,
  Certificate,
  CertificateWithDetails,
  Course,
  CourseDetail,
  CourseProgress,
  CourseStudent,
  Enrollment,
  Lesson,
  StudentCourse,
  TeacherCourseProgress,
  UserProfile,
  WishlistItem,
} from "@/lib/types";

export async function getCurrentUser() {
  const response = await api.get<ApiResponse<UserProfile>>("/users/me");
  return response.data.data;
}

export async function getMyCourses() {
  const response =
    await api.get<ApiResponse<StudentCourse[] | Course[]>>("/courses/my");
  return response.data.data;
}

export async function getCourseProgress(courseId: string) {
  const response = await api.get<ApiResponse<CourseProgress>>(
    `/progress/${courseId}`,
  );
  return response.data.data;
}

export async function getTeacherCourseProgress(courseId: string) {
  const response = await api.get<ApiResponse<TeacherCourseProgress[]>>(
    `/progress/teacher/${courseId}`,
  );
  return response.data.data;
}

export async function getWishlist() {
  const response = await api.get<ApiResponse<WishlistItem[]>>("/wishlist");
  return response.data.data;
}

export async function addWishlist(courseId: string) {
  const response = await api.post<ApiResponse<{ id: string }>>(
    `/wishlist/${courseId}`,
  );
  return response.data.data;
}

export async function removeWishlist(courseId: string) {
  await api.delete(`/wishlist/${courseId}`);
}

export async function enrollInCourse(courseId: string) {
  const response = await api.post<ApiResponse<Enrollment>>(
    `/courses/${courseId}/enroll`,
  );
  return response.data.data;
}

export async function getCertificates() {
  const response =
    await api.get<ApiResponse<CertificateWithDetails[]>>("/certificates/my");
  return response.data.data;
}

export async function generateCertificate(courseId: string) {
  const response = await api.post<ApiResponse<Certificate>>(
    `/certificates/${courseId}/generate`,
  );
  return response.data.data;
}

export async function getCourseStudents(courseId: string) {
  const response = await api.get<ApiResponse<CourseStudent[]>>(
    `/courses/${courseId}/students`,
  );
  return response.data.data;
}

export async function getTeacherCourses() {
  const response = await api.get<ApiResponse<Course[]>>("/courses/my");
  return response.data.data;
}

export async function updateCoursePublishState(
  courseId: string,
  isPublished: boolean,
) {
  const response = await api.patch<ApiResponse<Course>>(
    `/courses/${courseId}`,
    {
      isPublished,
    },
  );
  return response.data.data;
}

export async function getCourseLessons(courseId: string) {
  const response = await api.get<ApiResponse<Lesson[]>>(`/lessons/${courseId}`);
  return response.data.data;
}

export async function getCourseDetail(courseId: string) {
  const response = await api.get<ApiResponse<CourseDetail>>(
    `/courses/${courseId}`,
  );
  return response.data.data;
}
