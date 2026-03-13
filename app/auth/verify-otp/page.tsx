"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Card from "../../components/UI/Card";
import { useI18n } from "../../components/I18n/I18nProvider";
import { useToast } from "../../components/UI/Toast";
import { useAuth } from "../../components/Auth/AuthProvider";
import { TOKEN_KEY } from "../../components/Auth/AuthProvider";
import { PATHS } from "@/constants/path";
import { axiosClient } from "@/app/lib/http/axiosClient";

const OTP_LENGTH = 6;

function getOtpSession() {
  if (typeof window === "undefined") return { email: "", userId: "" };
  try {
    return {
      email: sessionStorage.getItem("sweethomes_otp_email") ?? "",
      userId: sessionStorage.getItem("sweethomes_otp_userId") ?? "",
    };
  } catch {
    return { email: "", userId: "" };
  }
}

export default function VerifyOtpPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const { refreshProfile } = useAuth();
  const router = useRouter();

  const [session, setSession] = useState({ email: "", userId: "" });
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const s = getOtpSession();
    setSession(s);
    if (!s.email) {
      router.replace(PATHS.login);
    } else {
      // Auto-focus first box
      inputRefs.current[0]?.focus();
    }
  }, [router]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    const lastIdx = Math.min(text.length, OTP_LENGTH - 1);
    inputRefs.current[lastIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = digits.join("");
    if (otpCode.length < OTP_LENGTH || digits.some((d) => !d)) {
      showToast(t("auth.otp.required"), "error");
      return;
    }
    setSubmitting(true);
    try {
      const resp = await axiosClient.post(
        "/auth/verify-otp",
        { otpCode, email: session.email, userId: session.userId },
        { timeout: 15000 }
      );

      // Store any token returned by the backend so refreshProfile can use it
      const data = (resp.data ?? {}) as Record<string, unknown>;
      const token =
        (typeof data.accessToken === "string" && data.accessToken.trim() ? data.accessToken : null) ||
        (typeof data.token === "string" && data.token.trim() ? data.token : null) ||
        (typeof data.jwt === "string" && data.jwt.trim() ? data.jwt : null) ||
        null;
      if (token) {
        try {
          localStorage.setItem(TOKEN_KEY, token);
        } catch {
          // ignore
        }
      }

      // Clear OTP session
      try {
        sessionStorage.removeItem("sweethomes_otp_email");
        sessionStorage.removeItem("sweethomes_otp_userId");
      } catch {
        // ignore
      }

      showToast(t("auth.otp.success"), "success");
      await refreshProfile();
      router.push(PATHS.home);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? ((err.response?.data as { message?: string } | undefined)?.message ?? t("auth.errors.generic"))
        : t("auth.errors.generic");
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!session.email) return;
    setResending(true);
    try {
      await axiosClient.post("/auth/resend-otp", { email: session.email }, { timeout: 15000 });
      showToast(t("auth.otp.resendSuccess"), "success");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? ((err.response?.data as { message?: string } | undefined)?.message ?? t("auth.errors.generic"))
        : t("auth.errors.generic");
      showToast(msg, "error");
    } finally {
      setResending(false);
    }
  };

  const otpComplete = digits.every(Boolean);

  const brandMark = (
    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-content shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 11.5 12 4l9 7.5v8.5a2 2 0 0 1-2 2h-4v-6a3 3 0 0 0-6 0v6H5a2 2 0 0 1-2-2v-8.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  return (
    <main className="relative min-h-[calc(100vh-64px)] sweethomes-hero overflow-hidden text-base-content">
      <div className="pointer-events-none absolute inset-0">
        <div className="sweethomes-grid-mask" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 md:grid-cols-2">
        {/* Left: Brand */}
        <div className="relative">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 right-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

          <div className="inline-flex items-center gap-3 rounded-2xl border border-base-200 bg-base-100/70 px-4 py-3 shadow-sm backdrop-blur">
            {brandMark}
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">{t("brand.name")}</div>
              <div className="text-xs opacity-70">{t("brand.tagline")}</div>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t("auth.otp.title")}</h1>
          <p className="mt-2 opacity-80">{t("auth.otp.subtitle")}</p>

          {session.email ? (
            <p className="mt-2 font-medium text-primary">{session.email}</p>
          ) : null}
        </div>

        {/* Right: Form */}
        <Card className="shadow-lg bg-base-100/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {brandMark}
              <div className="leading-tight">
                <div className="text-lg font-semibold">{t("auth.otp.title")}</div>
                <div className="text-xs opacity-70">{t("brand.name")}</div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => router.push(PATHS.login)}
              aria-label={t("actions.back")}
              title={t("actions.back")}
            >
              ← {t("actions.back")}
            </button>
          </div>

          {session.email ? (
            <div className="text-sm opacity-70">
              {t("auth.otp.subtitle")}
              <span className="ml-1 font-medium text-base-content">{session.email}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* OTP digit boxes */}
            <div className="grid gap-2">
              <div className="text-sm font-medium">{t("auth.otp.label")}</div>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {Array.from({ length: OTP_LENGTH }, (_, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    className={
                      "w-11 h-14 rounded-xl border-2 bg-base-100 text-center text-xl font-bold outline-none transition-all " +
                      "focus:border-primary focus:ring-2 focus:ring-primary/20 " +
                      (digits[i]
                        ? "border-primary text-base-content"
                        : "border-base-300 text-base-content/40")
                    }
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={submitting || !otpComplete}
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  {t("auth.otp.verifying")}
                </span>
              ) : (
                t("auth.otp.submit")
              )}
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm w-full"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="loading loading-spinner loading-xs" />
                  {t("auth.otp.resending")}
                </span>
              ) : (
                t("auth.otp.resend")
              )}
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}
