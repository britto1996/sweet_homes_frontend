"use client";

import React, { Suspense, useState } from "react";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import Card from "../components/UI/Card";
import { useI18n } from "../components/I18n/I18nProvider";
import { useAuth } from "../components/Auth/AuthProvider";
import { useToast } from "../components/UI/Toast";
import { useReusableFormik } from "../lib/forms/useReusableFormik";
import { strongPasswordRegex } from "../lib/validation/password";
import { PATHS } from "@/constants/path";
import { axiosClient } from "@/app/lib/http/axiosClient";

function ResetPasswordForm() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token") ?? "";
  const email = decodeURIComponent(params.get("email") ?? "");

  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const formik = useReusableFormik<{ newPassword: string }>({
    initialValues: { newPassword: "" },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required(t("auth.errors.newPasswordRequired"))
        .matches(strongPasswordRegex(), t("auth.errors.passwordWeak")),
    }),
    onSubmit: async (values, helpers) => {
      if (!token || !email) {
        showToast(t("auth.errors.generic"), "error");
        helpers.setSubmitting(false);
        return;
      }
      try {
        await axiosClient.post(
          "/auth/reset-password",
          { email, resetToken: token, newPassword: values.newPassword },
          { timeout: 15000 }
        );
        showToast(t("auth.resetPasswordSuccess"), "success");
        setDone(true);
        // Auto-login with the new credentials and redirect to home
        setLoggingIn(true);
        try {
          await login({ email, password: values.newPassword });
          router.push(PATHS.home);
        } catch {
          // If auto-login fails, fall back to the login page
          setTimeout(() => router.push(PATHS.login), 1200);
        } finally {
          setLoggingIn(false);
        }
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? ((err.response?.data as { message?: string } | undefined)?.message ?? t("auth.errors.generic"))
          : t("auth.errors.generic");
        showToast(msg, "error");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const passwordHasError = Boolean(formik.touched.newPassword && formik.errors.newPassword);
  const inputBase =
    "input input-bordered w-full bg-base-100 border-2 border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

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

  if (!token || !email) {
    return (
      <main className="min-h-[calc(100vh-64px)] sweethomes-hero grid place-items-center px-4 py-10 text-base-content">
        <div className="rounded-2xl border border-error/30 bg-error/10 px-6 py-5 text-sm text-error max-w-sm text-center">
          {t("auth.errors.generic")}
          <div className="mt-3">
            <button className="btn btn-ghost btn-sm" onClick={() => router.push(PATHS.forgotPassword)}>
              ← {t("auth.forgotPasswordTitle")}
            </button>
          </div>
        </div>
      </main>
    );
  }

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

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t("auth.resetPassword")}</h1>
          <p className="mt-2 opacity-80">{t("auth.forgotPasswordSubtitle")}</p>
          {email ? <p className="mt-2 font-medium text-primary">{email}</p> : null}
        </div>

        {/* Right: Form */}
        <Card className="shadow-lg bg-base-100/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {brandMark}
              <div className="leading-tight">
                <div className="text-lg font-semibold">{t("auth.resetPassword")}</div>
                <div className="text-xs opacity-70">{t("brand.name")}</div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => router.push(PATHS.login)}
              aria-label={t("actions.back")}
            >
              ← {t("actions.back")}
            </button>
          </div>

          {done ? (
            <div className="grid gap-4 place-items-center py-4 text-center">
              <div className="rounded-xl bg-success/10 border border-success/30 px-4 py-4 text-sm text-success w-full">
                {t("auth.resetPasswordSuccess")}
              </div>
              {loggingIn && (
                <div className="flex items-center gap-3 text-sm opacity-70">
                  <span className="loading loading-spinner loading-sm" />
                  {t("auth.loggingInAfterReset")}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="grid gap-4">
              {/* Email display (read-only) */}
              <div className="rounded-xl bg-base-200/60 px-4 py-3 text-sm">
                <span className="opacity-60">{t("auth.email")}:</span>{" "}
                <span className="font-medium">{email}</span>
              </div>

              {/* New password */}
              <div className="grid gap-1">
                <div className="text-sm font-medium">{t("auth.newPassword")}</div>
                <div className="relative">
                  <input
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    className={`${inputBase} pr-12` + (passwordHasError ? " input-error border-error focus:border-error focus:ring-error/20" : "")}
                    placeholder={t("auth.newPasswordPlaceholder")}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.2 0 10 7 10 7a17.7 17.7 0 0 1-3 3.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M6.2 6.2A17.7 17.7 0 0 0 2 12s3.8 7 10 7c1 0 2-.2 3-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordHasError ? (
                  <div className="text-xs text-error">{formik.errors.newPassword}</div>
                ) : null}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm" />
                    {t("auth.resettingPassword")}
                  </span>
                ) : (
                  t("auth.resetPassword")
                )}
              </button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
