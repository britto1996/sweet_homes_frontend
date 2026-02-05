"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";

import Card from "../components/UI/Card";
import { useI18n } from "../components/I18n/I18nProvider";
import { useAuth } from "../components/Auth/AuthProvider";
import { useReusableFormik } from "../lib/forms/useReusableFormik";
import { checkStrongPassword, strongPasswordRegex } from "../lib/validation/password";
import { PATHS } from "@/constants/path";
import { axiosClient } from "@/app/lib/http/axiosClient";

type Values = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(() => {
    return Yup.object({
      email: Yup.string()
        .trim()
        .email(t("auth.errors.emailInvalid"))
        .required(t("auth.errors.emailRequired")),
      password: Yup.string()
        .required(t("auth.errors.passwordRequired"))
        .matches(strongPasswordRegex(), t("auth.errors.passwordWeak")),
      confirmPassword: Yup.string()
        .required(t("auth.errors.confirmPasswordRequired"))
        .oneOf([Yup.ref("password")], t("auth.errors.passwordsDontMatch")),
    });
  }, [t]);

  const formik = useReusableFormik<Values>({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema: schema,
    onSubmit: async (values, helpers) => {
      setSubmitMessage(null);
      setSubmitError(null);

      try {
        await axiosClient.post(
          "/auth/signup",
          {
            email: values.email.trim(),
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
          { timeout: 15000 }
        );
        helpers.resetForm();
        setShowPassword(false);
        setShowConfirmPassword(false);
        setSubmitMessage(t("auth.registerMockSuccess"));
        setTimeout(() => router.push(PATHS.home), 400);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const apiMessage = (err.response?.data as { message?: unknown } | undefined)?.message;
          const msg = typeof apiMessage === "string" && apiMessage.trim() ? apiMessage : err.message;
          setSubmitError(msg || t("auth.errors.generic"));
        } else {
          setSubmitError(t("auth.errors.generic"));
        }
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const pwdCheck = useMemo(
    () => checkStrongPassword(formik.values.password),
    [formik.values.password],
  );

  const emailHasError = Boolean(formik.touched.email && formik.errors.email);
  const passwordHasError = Boolean(
    formik.touched.password && formik.errors.password,
  );
  const confirmPasswordHasError = Boolean(
    formik.touched.confirmPassword && formik.errors.confirmPassword,
  );

  const inputBase =
    "input input-bordered w-full bg-base-100 border-2 border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

  useEffect(() => {
    if (user) {
      router.replace(PATHS.home);
    }
  }, [user, router]);

  if (user) {
    return (
      <main className="min-h-[calc(100vh-64px)] sweethomes-hero grid place-items-center px-4 py-10 text-base-content">
        <div className="flex items-center gap-3 rounded-2xl border border-base-200 bg-base-100/70 px-5 py-4 shadow-sm backdrop-blur">
          <span className="loading loading-spinner loading-sm" />
          <span className="text-sm opacity-80">{t("auth.loggingIn")}</span>
        </div>
      </main>
    );
  }

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
              <div className="text-sm font-semibold tracking-tight">
                {t("brand.name")}
              </div>
              <div className="text-xs opacity-70">{t("brand.tagline")}</div>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            {t("auth.registerTitle")}
          </h1>
          <p className="mt-2 opacity-80">{t("auth.registerSubtitle")}</p>
        </div>

        {/* Right: Form */}
        <Card className="shadow-lg bg-base-100/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {brandMark}
              <div className="leading-tight">
                <div className="text-lg font-semibold">
                  {t("auth.registerTitle")}
                </div>
                <div className="text-xs opacity-70">{t("brand.name")}</div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => router.push(PATHS.home)}
              aria-label={t("actions.back")}
              title={t("actions.back")}
            >
              ← {t("actions.back")}
            </button>
          </div>

          <div className="text-sm">
            <span className="opacity-70">{t("auth.haveAccount")}</span>{" "}
            <button
              type="button"
              className="link link-primary"
              onClick={() => router.push(PATHS.login)}
            >
              {t("actions.login")}
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="grid gap-4">
            {/* Email */}
            <div className="grid gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{t("auth.email")}</div>
              </div>

              <div className="relative">
                <input
                  name="email"
                  type="email"
                  className={
                    `${inputBase} pr-10 ` +
                    (emailHasError
                      ? " input-error border-error focus:border-error focus:ring-error/20"
                      : "")
                  }
                  placeholder={t("auth.emailPlaceholder")}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="email"
                  inputMode="email"
                />
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
                >
                  <path
                    d="M4 6h16v12H4V6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {emailHasError ? (
                <div className="text-xs text-error">{formik.errors.email}</div>
              ) : null}
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{t("auth.password")}</div>
              </div>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={
                    `${inputBase} pr-12 ` +
                    (passwordHasError
                      ? " input-error border-error focus:border-error focus:ring-error/20"
                      : "")
                  }
                  placeholder={t("auth.passwordPlaceholder")}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  title={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path
                        d="M10.6 10.6a3 3 0 0 0 4.2 4.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.2 0 10 7 10 7a17.7 17.7 0 0 1-3 3.8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.2 6.2A17.7 17.7 0 0 0 2 12s3.8 7 10 7c1 0 2-.2 3-.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="text-xs opacity-70">
                {t("auth.passwordHint")}
                <span
                  className={`ml-2 ${pwdCheck.ok ? "text-success" : "text-warning"}`}
                >
                  {pwdCheck.ok ? t("auth.passwordStrong") : t("auth.passwordNotStrong")}
                </span>
              </div>

              {passwordHasError ? (
                <div className="text-xs text-error">{formik.errors.password}</div>
              ) : null}
            </div>

            {/* Confirm Password */}
            <div className="grid gap-1">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">{t("auth.confirmPassword")}</div>
              </div>

              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={
                    `${inputBase} pr-12 ` +
                    (confirmPasswordHasError
                      ? " input-error border-error focus:border-error focus:ring-error/20"
                      : "")
                  }
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  title={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path
                        d="M10.6 10.6a3 3 0 0 0 4.2 4.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.2 0 10 7 10 7a17.7 17.7 0 0 1-3 3.8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6.2 6.2A17.7 17.7 0 0 0 2 12s3.8 7 10 7c1 0 2-.2 3-.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {confirmPasswordHasError ? (
                <div className="text-xs text-error">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>

            {submitError ? (
              <div role="alert" className="alert alert-error">
                <span className="text-sm">{submitError}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSubmitError(null)}
                  aria-label={t("actions.close")}
                  title={t("actions.close")}
                >
                  ✕
                </button>
              </div>
            ) : null}

            {submitMessage ? (
              <div role="alert" className="alert alert-success">
                <span className="text-sm">{submitMessage}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSubmitMessage(null)}
                  aria-label={t("actions.close")}
                  title={t("actions.close")}
                >
                  ✕
                </button>
              </div>
            ) : null}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  {t("auth.registering")}
                </span>
              ) : (
                t("actions.createAccount")
              )}
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}
