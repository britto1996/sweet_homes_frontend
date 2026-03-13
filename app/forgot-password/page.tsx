"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";

import Card from "../components/UI/Card";
import { useI18n } from "../components/I18n/I18nProvider";
import { useToast } from "../components/UI/Toast";
import { useReusableFormik } from "../lib/forms/useReusableFormik";
import { PATHS } from "@/constants/path";
import { axiosClient } from "@/app/lib/http/axiosClient";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const router = useRouter();
  const [sent, setSent] = useState(false);

  const formik = useReusableFormik<{ email: string }>({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().trim().email(t("auth.errors.emailInvalid")).required(t("auth.errors.emailRequired")),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await axiosClient.post(
          "/auth/forgot-password",
          { email: values.email.trim() },
          { timeout: 15000 }
        );
        showToast(t("auth.otpSent"), "success");
        setSent(true);
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

  const emailHasError = Boolean(formik.touched.email && formik.errors.email);
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

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t("auth.forgotPasswordTitle")}</h1>
          <p className="mt-2 opacity-80">{t("auth.forgotPasswordSubtitle")}</p>
        </div>

        {/* Right: Form */}
        <Card className="shadow-lg bg-base-100/80 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {brandMark}
              <div className="leading-tight">
                <div className="text-lg font-semibold">{t("auth.forgotPasswordTitle")}</div>
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

          {sent ? (
            <div className="grid gap-4">
              <div className="rounded-xl bg-success/10 border border-success/30 px-4 py-4 text-sm text-success">
                {t("auth.otpSent")}
              </div>
              <p className="text-sm opacity-70 text-center">
                {t("auth.forgotPasswordSubtitle")}
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-sm w-full"
                onClick={() => router.push(PATHS.login)}
              >
                ← {t("actions.login")}
              </button>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="grid gap-4">
              <div className="grid gap-1">
                <div className="text-sm font-medium">{t("auth.email")}</div>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    className={
                      `${inputBase} pr-10` +
                      (emailHasError ? " input-error border-error focus:border-error focus:ring-error/20" : "")
                    }
                    placeholder={t("auth.emailPlaceholder")}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="email"
                    inputMode="email"
                  />
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
                  >
                    <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </div>
                {emailHasError ? <div className="text-xs text-error">{formik.errors.email}</div> : null}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm" />
                    {t("auth.sendingOtp")}
                  </span>
                ) : (
                  t("auth.sendOtp")
                )}
              </button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
