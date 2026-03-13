"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { UserRole } from "../UI/RoleSwitch";
import { axiosClient } from "@/app/lib/http/axiosClient";

export type AuthUser = {
  id?: string;
  email: string;
  role?: UserRole | "user";
  verified?: string;
  token?: string;
  createdAt?: number;
  updatedAt?: number;
};

export type UserProfile = {
  id?: string;
  email: string;
  role?: UserRole | "user";
  verified?: string;
  name?: string;
  imageUrl?: string;
  createdAt?: number;
  updatedAt?: number;
};

type LoginInput = {
  email: string;
  password: string;
};

type LoginResult = {
  requiresOtp: boolean;
  userId?: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  profile: UserProfile | null;
  login: (input: LoginInput) => Promise<LoginResult>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "sweethomes_auth_v1";
export const TOKEN_KEY = "sweethomes_token_v1";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

function clearToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

function safeParseUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (typeof parsed.email !== "string") return null;
    const token = typeof parsed.token === "string" && parsed.token.trim() ? parsed.token : undefined;
    return { ...parsed, email: parsed.email, token };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchProfile = useCallback(async (token: string): Promise<UserProfile | null> => {
    try {
      const resp = await axiosClient.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        timeout: 15000,
      });
      const data = (resp.data ?? {}) as Record<string, unknown>;
      if (typeof data.email === "string") {
        const prof: UserProfile = {
          id: typeof data.id === "string" ? data.id : undefined,
          email: data.email,
          role: (() => {
            const r = data.role;
            if (r === "admin") return "seller" as UserProfile["role"];
            if (r === "user" || r === "buyer" || r === "seller") return r as UserProfile["role"];
            return undefined;
          })(),
          verified: typeof data.verified === "string" ? data.verified : undefined,
          createdAt: typeof data.createdAt === "number" ? data.createdAt : undefined,
          updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : undefined,
        };
        setProfile(prof);
        return prof;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const load = () => {
      setUser(safeParseUser());
      setHydrated(true);
      const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      if (token) void fetchProfile(token);
    };

    if (typeof queueMicrotask === "function") {
      queueMicrotask(load);
    } else {
      void Promise.resolve().then(load);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (!user) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch {
      // ignore
    }
  }, [hydrated, user]);

  const login = useCallback(async ({ email, password }: LoginInput): Promise<LoginResult> => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const resp = await axiosClient.post(
        "/auth/login",
        { email: normalizedEmail, password },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      const data = (resp.data ?? {}) as Record<string, unknown>;

      const token =
        (typeof data.accessToken === "string" && data.accessToken.trim() ? data.accessToken : null) ||
        (typeof data.token === "string" && data.token.trim() ? data.token : null) ||
        (typeof data.jwt === "string" && data.jwt.trim() ? data.jwt : null) ||
        null;

      const userId =
        (typeof data.userId === "string" && data.userId.trim() ? data.userId : null) ||
        (typeof data.id === "string" && data.id.trim() ? data.id : null) ||
        null;

      const apiEmail = typeof data.email === "string" ? data.email.trim() : normalizedEmail;

      const nextUser: AuthUser = {
        email: apiEmail,
        ...(token ? { token } : {}),
        ...(userId ? { id: userId } : {}),
      };

      setUser(nextUser);

      if (token) {
        storeToken(token);
        void fetchProfile(token);
      }

      // Persist email + userId in sessionStorage for OTP verification step
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("sweethomes_otp_email", apiEmail);
          if (userId) sessionStorage.setItem("sweethomes_otp_userId", userId);
        } catch {
          // ignore
        }
      }

      return { requiresOtp: true, userId: userId ?? undefined, email: apiEmail };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403) throw new Error("INVALID_CREDENTIALS");
        const msg = (err.response?.data as { message?: string } | undefined)?.message;
        if (msg) throw new Error(msg);
      }
      throw err instanceof Error ? err : new Error("LOGIN_FAILED");
    }
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    const token = getStoredToken();
    if (token) await fetchProfile(token);
  }, [fetchProfile]);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    clearToken();
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("sweethomes_otp_email");
        sessionStorage.removeItem("sweethomes_otp_userId");
      } catch {
        // ignore
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, profile, login, logout, refreshProfile }),
    [login, logout, profile, refreshProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
