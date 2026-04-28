import { API_BASE_URL } from "@/lib/api-config";
import type { ApiResponse } from "@/lib/types";

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function fetchApiResponse<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 30 },
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | { message?: string }
    | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? payload.message
        : undefined;

    throw new Error(
      typeof message === "string"
        ? message
        : `Request failed with status ${response.status}`,
    );
  }

  if (!payload || typeof payload !== "object" || !("success" in payload)) {
    throw new Error("Invalid API response.");
  }

  return payload as ApiResponse<T>;
}

export async function fetchApiData<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const payload = await fetchApiResponse<T>(path, init);
  return payload.data;
}
