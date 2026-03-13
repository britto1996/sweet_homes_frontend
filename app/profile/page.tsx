"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/Auth/AuthProvider";
import ProfileView from "../components/Auth/ProfileView";
import { useI18n } from "../components/I18n/I18nProvider";
import { PATHS } from "@/constants/path";

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace(PATHS.login);
      return;
    }
    void refreshProfile();
  }, [user, router, refreshProfile]);

  if (!user) {
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

      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          {brandMark}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("auth.profile.title")}</h1>
            <p className="text-sm opacity-70">{user.email}</p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm ml-auto"
            onClick={() => router.back()}
          >
            ← {t("actions.back")}
          </button>
        </div>

        {profile ? (
          <ProfileView profile={profile} />
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-base-200 bg-base-100/70 px-5 py-6 shadow-sm backdrop-blur max-w-lg">
            <span className="loading loading-spinner loading-sm" />
            <span className="text-sm opacity-80">Loading profile…</span>
          </div>
        )}
      </div>
    </main>
  );
}
