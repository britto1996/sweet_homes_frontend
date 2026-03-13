"use client";

import React from "react";
import { useI18n } from "../I18n/I18nProvider";
import type { UserProfile } from "./AuthProvider";

type Props = {
  profile: UserProfile;
};

function formatDate(ts: number | undefined): string {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function ProfileView({ profile }: Props) {
  const { t } = useI18n();

  const roleLabel =
    profile.role === "buyer" || profile.role === "user"
      ? t("auth.buyer")
      : profile.role === "seller" || profile.role === "admin"
      ? t("auth.seller")
      : profile.role ?? "—";

  const rows: { label: string; value: string }[] = [
    { label: t("auth.profile.id"), value: profile.id ?? "—" },
    { label: t("auth.profile.email"), value: profile.email },
    { label: t("auth.profile.role"), value: roleLabel },
    {
      label: t("auth.profile.verified"),
      value: profile.verified ?? "—",
    },
    { label: t("auth.profile.createdAt"), value: formatDate(profile.createdAt) },
  ];

  return (
    <div className="rounded-2xl border border-base-200 bg-base-100/80 backdrop-blur shadow-sm overflow-hidden max-w-lg w-full">
      {/* Header */}
      <div className="flex items-center gap-4 bg-primary/5 px-6 py-5 border-b border-base-200">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-content text-xl font-bold shadow">
          {profile.email.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{profile.email}</div>
          <div className="text-xs opacity-60 capitalize">{roleLabel}</div>
          {profile.verified === "verified" ? (
            <span className="badge badge-success badge-sm mt-1">{profile.verified}</span>
          ) : profile.verified ? (
            <span className="badge badge-warning badge-sm mt-1">{profile.verified}</span>
          ) : null}
        </div>
      </div>

      {/* Rows */}
      <dl className="divide-y divide-base-200">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start gap-4 px-6 py-3">
            <dt className="w-32 shrink-0 text-xs font-medium opacity-60 pt-0.5">{row.label}</dt>
            <dd className="flex-1 text-sm break-all">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
