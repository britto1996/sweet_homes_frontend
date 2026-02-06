"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { UserRole } from "../UI/RoleSwitch";
import { axiosClient } from "@/app/lib/http/axiosClient";

export type AuthUser = {
  email: string;
  role: UserRole;
  token?: string;
};

type LoginInput = {
  email: string;
  password: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "sweethomes_auth_v1";

function safeParseUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (typeof parsed.email !== "string") return null;
    if (parsed.role !== "buyer" && parsed.role !== "seller") return null;
    const token = typeof parsed.token === "string" && parsed.token.trim() ? parsed.token : undefined;
    return { email: parsed.email, role: parsed.role, token };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Don't read localStorage during the initial render; it can cause hydration mismatches.
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = () => {
      setUser(safeParseUser());
      setHydrated(true);
    };

    // Defer state update to avoid synchronous setState in effect.
    if (typeof queueMicrotask === "function") {
      queueMicrotask(load);
    } else {
      void Promise.resolve().then(load);
    }
  }, []);

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

  const login = useCallback(async ({ email, password, role }: LoginInput) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const resp = await axiosClient.post(
        "/auth/login",
        { email: normalizedEmail, password, role },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      const data = resp.data as unknown;
      const anyData = (data ?? {}) as Record<string, unknown>;

      const tokenCandidate =
        (typeof anyData.token === "string" && anyData.token) ||
        (typeof anyData.accessToken === "string" && anyData.accessToken) ||
        (typeof anyData.jwt === "string" && anyData.jwt) ||
        undefined;

      const userCandidate =
        (typeof anyData.user === "object" && anyData.user !== null ? (anyData.user as Record<string, unknown>) : null) ||
        (typeof anyData.data === "object" && anyData.data !== null
          ? ((anyData.data as Record<string, unknown>).user as Record<string, unknown> | undefined) ?? null
          : null);

      const apiEmail = typeof userCandidate?.email === "string" ? userCandidate.email : undefined;
      const apiRole = userCandidate?.role === "buyer" || userCandidate?.role === "seller" ? userCandidate.role : undefined;

      const nextUser: AuthUser = {
        email: (apiEmail ?? normalizedEmail).trim(),
        role: apiRole ?? role,
        ...(tokenCandidate ? { token: tokenCandidate } : {}),
      };

      setUser(nextUser);
      return nextUser;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          throw new Error("INVALID_CREDENTIALS");
        }
      }
      throw err instanceof Error ? err : new Error("LOGIN_FAILED");
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout }), [login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
