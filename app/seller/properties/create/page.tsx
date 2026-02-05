"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/components/Auth/AuthProvider";
import { useI18n } from "@/app/components/I18n/I18nProvider";
import { PATHS } from "@/constants/path";
import PropertyCreateForm from "@/app/components/Seller/PropertyCreateForm";
import Reveal from "@/app/components/Animations/Reveal";

export default function SellerCreatePropertyPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const currentUser = user;
    if (!currentUser) {
      router.replace(PATHS.login);
      return;
    }
    if (currentUser.role !== "seller") {
      router.replace(PATHS.home);
    }
  }, [router, user]);

  if (!user) return null;
  if (user.role !== "seller") return null;

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t("seller.createTitle")}</h1>
            <p className="mt-1 text-sm opacity-70">{t("seller.subtitle")}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push(PATHS.sellerProperties)}>
            ← {t("actions.back")}
          </button>
        </div>

        <div className="mt-6">
          <Reveal>
            <PropertyCreateForm onCreated={() => router.push(PATHS.sellerProperties)} />
          </Reveal>
        </div>
      </main>
    </div>
  );
}
