"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ApiResponse, UserProfile, UserRole } from "@/lib/types";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  mobileNumber: string | null;
  role: UserRole;
  isVerified: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  pendingEmail: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  syncUser: (nextUser: AuthUser) => void;
  sendLoginOtp: (email: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<AuthUser>;
  resendOtp: () => Promise<void>;
  logout: () => void;
};

type StoredAuthPayload = {
  token: string;
  user: AuthUser;
};

type VerifyOtpResponse = AuthUser & {
  token: string;
};

const AUTH_STORAGE_KEY = "draftien:auth";
const OTP_EMAIL_STORAGE_KEY = "draftien:pending-email";
const PUBLIC_EXACT_ROUTES = new Set(["/", "/login", "/signup", "/verify-otp"]);
const PUBLIC_PREFIX_ROUTES = ["/courses", "/certificates"];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isBrowser = typeof window !== "undefined";

function getStoredAuth(): StoredAuthPayload | null {
  if (!isBrowser) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuthPayload;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function persistAuth(payload: StoredAuthPayload): void {
  if (!isBrowser) {
    return;
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

function clearPersistedAuth(): void {
  if (!isBrowser) {
    return;
  }
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

function getStoredPendingEmail(): string | null {
  if (!isBrowser) {
    return null;
  }
  return window.localStorage.getItem(OTP_EMAIL_STORAGE_KEY);
}

function setStoredPendingEmail(email: string): void {
  if (!isBrowser) {
    return;
  }
  window.localStorage.setItem(OTP_EMAIL_STORAGE_KEY, email);
}

function clearStoredPendingEmail(): void {
  if (!isBrowser) {
    return;
  }
  window.localStorage.removeItem(OTP_EMAIL_STORAGE_KEY);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      const storedAuth = getStoredAuth();
      const storedPendingEmail = getStoredPendingEmail();

      if (storedAuth && mounted) {
        setUser(storedAuth.user);
        setToken(storedAuth.token);
      }

      if (storedPendingEmail && mounted) {
        setPendingEmail(storedPendingEmail);
      }

      // Refresh user from backend so stale local role (e.g. null) doesn't
      // misroute dashboards after onboarding/profile updates.
      if (storedAuth?.token) {
        try {
          const { api } = await import("@/lib/axios");
          const meResponse =
            await api.get<ApiResponse<UserProfile>>("/users/me");
          const me = meResponse.data.data;

          const refreshedUser: AuthUser = {
            id: me.id,
            email: me.email,
            name: me.name,
            mobileNumber: me.mobileNumber,
            role: me.role,
            isVerified: me.isVerified,
          };

          if (mounted) {
            setUser(refreshedUser);
            persistAuth({
              token: storedAuth.token,
              user: refreshedUser,
            });
          }
        } catch {
          // 401 is handled by axios interceptor; for transient failures, keep
          // whatever local auth is available to avoid hard lockouts.
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    void bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const sendLoginOtp = useCallback(async (email: string) => {
    const { api } = await import("@/lib/axios");
    await api.post("/auth/login", { email });
    setPendingEmail(email);
    setStoredPendingEmail(email);
  }, []);

  const syncUser = useCallback(
    (nextUser: AuthUser) => {
      setUser(nextUser);
      const tokenToPersist = token ?? getStoredAuth()?.token ?? null;

      if (tokenToPersist) {
        persistAuth({
          token: tokenToPersist,
          user: nextUser,
        });

        if (!token) {
          setToken(tokenToPersist);
        }
      }
    },
    [token],
  );

  const verifyOtp = useCallback(
    async (otp: string) => {
      if (!pendingEmail) {
        throw new Error("Email not found. Please login again.");
      }

      const { api } = await import("@/lib/axios");
      const response = await api.post("/auth/verify-otp", {
        email: pendingEmail,
        otp,
      });

      const authData = response.data?.data as VerifyOtpResponse | undefined;
      if (!authData?.token || !authData?.id) {
        throw new Error("Invalid auth response from server.");
      }

      const verifiedUser: AuthUser = {
        id: authData.id,
        email: authData.email,
        name: authData.name,
        mobileNumber: authData.mobileNumber,
        role: authData.role ?? null,
        isVerified: authData.isVerified,
      };

      const authPayload: StoredAuthPayload = {
        token: authData.token,
        user: verifiedUser,
      };

      setUser(verifiedUser);
      setToken(authData.token);
      persistAuth(authPayload);
      setPendingEmail(null);
      clearStoredPendingEmail();

      return verifiedUser;
    },
    [pendingEmail],
  );

  const resendOtp = useCallback(async () => {
    if (!pendingEmail) {
      throw new Error("Email not found. Please login again.");
    }

    const { api } = await import("@/lib/axios");
    await api.post("/auth/resend-otp", { email: pendingEmail });
  }, [pendingEmail]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setPendingEmail(null);
    clearPersistedAuth();
    clearStoredPendingEmail();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      pendingEmail,
      isAuthenticated: Boolean(token && user),
      loading,
      syncUser,
      sendLoginOtp,
      verifyOtp,
      resendOtp,
      logout,
    }),
    [
      user,
      token,
      pendingEmail,
      loading,
      syncUser,
      sendLoginOtp,
      verifyOtp,
      resendOtp,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthGuard({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthenticated, user } = useAuth();

  // Prevent redirects during the short window after OTP verification,
  // when localStorage is updated before React state reflects it.
  const storedAuth = getStoredAuth();
  const effectiveIsAuthenticated =
    isAuthenticated || Boolean(storedAuth?.token);
  const effectiveRole = user?.role ?? storedAuth?.user?.role ?? null;
  const defaultPrivatePath =
    effectiveRole === "teacher"
      ? "/teacher"
      : effectiveRole === "student"
        ? "/student"
        : "/select-role";

  const isPublicPath =
    PUBLIC_EXACT_ROUTES.has(pathname) ||
    PUBLIC_PREFIX_ROUTES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!effectiveIsAuthenticated && !isPublicPath) {
      router.replace("/login");
      return;
    }

    if (
      effectiveIsAuthenticated &&
      (pathname === "/login" || pathname === "/signup")
    ) {
      router.replace(defaultPrivatePath);
    }
  }, [
    defaultPrivatePath,
    effectiveIsAuthenticated,
    isPublicPath,
    loading,
    pathname,
    router,
  ]);

  if (loading) {
    return null;
  }

  if (!effectiveIsAuthenticated && !isPublicPath) {
    return null;
  }

  if (
    effectiveIsAuthenticated &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    return null;
  }

  return <>{children}</>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
