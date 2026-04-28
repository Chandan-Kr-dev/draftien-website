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

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  mobileNumber: string | null;
  role: "student" | "teacher" | null;
  isVerified: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  pendingEmail: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  sendLoginOtp: (email: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<AuthUser>;
  resendOtp: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
const PUBLIC_ROUTES = new Set(["/", "/login", "/verify-otp"]);

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
    const storedAuth = getStoredAuth();
    const storedPendingEmail = getStoredPendingEmail();

    if (storedAuth) {
      setUser(storedAuth.user);
      setToken(storedAuth.token);
    }

    if (storedPendingEmail) {
      setPendingEmail(storedPendingEmail);
    }

    setLoading(false);
  }, []);

  const sendLoginOtp = useCallback(async (email: string) => {
    const { api } = await import("@/lib/axios");
    await api.post("/api/auth/login", { email });
    setPendingEmail(email);
    setStoredPendingEmail(email);
  }, []);

  const verifyOtp = useCallback(
    async (otp: string) => {
      if (!pendingEmail) {
        throw new Error("Email not found. Please login again.");
      }

      const { api } = await import("@/lib/axios");
      const response = await api.post("/api/auth/verify-otp", {
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
    await api.post("/api/auth/resend-otp", { email: pendingEmail });
  }, [pendingEmail]);

  const refreshUser = useCallback(async () => {
    const { api } = await import("@/lib/axios");
    try {
      const response = await api.get("/api/users/me");
      const userData = response.data?.data as AuthUser | undefined;
      if (userData) {
        setUser(userData);
        // Also update stored auth
        const storedAuth = getStoredAuth();
        if (storedAuth) {
          persistAuth({ ...storedAuth, user: userData });
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, []);

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
      sendLoginOtp,
      verifyOtp,
      resendOtp,
      refreshUser,
      logout,
    }),
    [
      user,
      token,
      pendingEmail,
      loading,
      sendLoginOtp,
      verifyOtp,
      resendOtp,
      refreshUser,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthGuard({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  // Prevent redirects during the short window after OTP verification,
  // when localStorage is updated before React state reflects it.
  const storedAuth = getStoredAuth();
  const effectiveIsAuthenticated =
    isAuthenticated || Boolean(storedAuth?.token);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!effectiveIsAuthenticated && !PUBLIC_ROUTES.has(pathname)) {
      router.replace("/login");
      return;
    }

    if (effectiveIsAuthenticated && pathname === "/login") {
      router.replace("/");
    }
  }, [effectiveIsAuthenticated, loading, pathname, router]);

  if (loading) {
    return null;
  }

  if (!effectiveIsAuthenticated && !PUBLIC_ROUTES.has(pathname)) {
    return null;
  }

  if (effectiveIsAuthenticated && pathname === "/login") {
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
