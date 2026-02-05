"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";

import Card from "@/app/components/UI/Card";
import { useI18n } from "@/app/components/I18n/I18nProvider";
import { useReusableFormik } from "@/app/lib/forms/useReusableFormik";
import type { PropertyFacility } from "@/app/data/properties";
import { useSellerProperties } from "@/app/components/Seller/SellerPropertiesProvider";
import { useAuth } from "@/app/components/Auth/AuthProvider";

const MIN_IMAGES = 6;
const MAX_IMAGES = 12;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

const ALL_FACILITIES: PropertyFacility[] = [
  "metro",
  "parking",
  "gym",
  "pool",
  "security",
  "petFriendly",
  "seaView",
  "smartHome",
  "park",
  "school",
];

function FacilityLabel({ f }: { f: PropertyFacility }) {
  const { t } = useI18n();
  return <span className="text-sm">{t(`facilities.${f}`)}</span>;
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("READ_FAILED"));
    reader.readAsDataURL(file);
  });
}

type ReadImagesResult = {
  urls: string[];
  rejectedReason: "type" | "size" | "read" | null;
};

async function readImageFiles(files: File[]): Promise<ReadImagesResult> {
  for (const f of files) {
    if (!f.type.startsWith("image/")) return { urls: [], rejectedReason: "type" };
    if (f.size > MAX_IMAGE_BYTES) return { urls: [], rejectedReason: "size" };
  }

  try {
    const urls = await Promise.all(files.map((f) => fileToDataUrl(f)));
    return { urls: urls.filter(Boolean), rejectedReason: null };
  } catch {
    return { urls: [], rejectedReason: "read" };
  }
}

type CreateValues = {
  name: string;
  description: string;
  priceUsd: string;
  facilities: PropertyFacility[];
};

export default function PropertyCreateForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const { create } = useSellerProperties();

  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const inputBase =
    "input input-bordered w-full bg-base-100 border-2 border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";
  const textareaBase =
    "textarea textarea-bordered w-full bg-base-100 border-2 border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

  const onPickImages = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setImageError(null);

      const picked = Array.from(files);
      const { urls, rejectedReason } = await readImageFiles(picked);

      if (rejectedReason === "type") {
        setImageError(t("seller.errors.imagesType"));
        return;
      }
      if (rejectedReason === "size") {
        setImageError(t("seller.errors.imagesTooLarge"));
        return;
      }
      if (rejectedReason === "read") {
        setImageError(t("seller.errors.imageReadFailed"));
        return;
      }

      setImages((prev) => {
        const next = [...prev, ...urls];
        if (next.length > MAX_IMAGES) {
          setImageError(t("seller.errors.imagesMax"));
        }
        return next.slice(0, MAX_IMAGES);
      });
    },
    [t]
  );

  const onDropImages = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      await onPickImages(e.dataTransfer.files);
    },
    [onPickImages]
  );

  const formik = useReusableFormik<CreateValues>({
    initialValues: {
      name: "",
      description: "",
      priceUsd: "",
      facilities: [],
    },
    validate: (values) => {
      const errors: Partial<Record<keyof CreateValues, string>> = {};

      if (!values.name.trim()) errors.name = t("seller.errors.nameRequired");
      if (!values.description.trim()) errors.description = t("seller.errors.descriptionRequired");

      const price = values.priceUsd ? Number(values.priceUsd) : NaN;
      if (!Number.isFinite(price) || price <= 0) errors.priceUsd = t("seller.errors.priceInvalid");

      return errors;
    },
    onSubmit: async (values, helpers) => {
      setImageError(null);

      if (!user) {
        setImageError(t("seller.errors.notSeller"));
        helpers.setSubmitting(false);
        return;
      }
      if (user.role !== "seller") {
        setImageError(t("seller.errors.notSeller"));
        helpers.setSubmitting(false);
        return;
      }

      if (!images.length) {
        setImageError(t("seller.errors.imagesRequired"));
        helpers.setSubmitting(false);
        return;
      }

      if (images.length < MIN_IMAGES) {
        setImageError(t("seller.errors.imagesMin"));
        helpers.setSubmitting(false);
        return;
      }

      const priceUsd = Number(values.priceUsd);

      try {
        create({
          name: values.name,
          description: values.description,
          priceUsd,
          facilities: values.facilities,
          images,
        });

        helpers.resetForm();
        setImages([]);
        setImageError(null);
        onCreated?.();
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Card title={t("seller.createTitle")}>
      <form onSubmit={formik.handleSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <div className="text-sm font-medium">{t("seller.fields.name")}</div>
          <input
            name="name"
            className={inputBase}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={locale === "ar" ? "مثال: شقة بإطلالة بحر" : "e.g. Sea view apartment"}
          />
          {formik.touched.name && formik.errors.name ? <div className="text-xs text-error">{formik.errors.name}</div> : null}
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">{t("seller.fields.price")}</div>
          <input
            name="priceUsd"
            className={inputBase}
            inputMode="numeric"
            value={formik.values.priceUsd}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="2500"
          />
          {formik.touched.priceUsd && formik.errors.priceUsd ? (
            <div className="text-xs text-error">{formik.errors.priceUsd}</div>
          ) : null}
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">{t("seller.fields.description")}</div>
          <textarea
            name="description"
            className={textareaBase}
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder={locale === "ar" ? "اكتب وصفاً مختصراً للعقار…" : "Write a short description…"}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-xs text-error">{formik.errors.description}</div>
          ) : null}
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">{t("seller.fields.facilities")}</div>
          <div className="grid grid-cols-2 gap-2">
            {ALL_FACILITIES.map((f) => {
              const checked = formik.values.facilities.includes(f);
              return (
                <label
                  key={f}
                  className={
                    "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 transition-colors " +
                    (checked ? "border-primary bg-primary/5" : "border-base-200 bg-base-100 hover:bg-base-200/40")
                  }
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary border-2"
                    checked={checked}
                    onChange={() => {
                      formik.setFieldValue(
                        "facilities",
                        checked ? formik.values.facilities.filter((x) => x !== f) : [...formik.values.facilities, f]
                      );
                    }}
                  />
                  <FacilityLabel f={f} />
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium">{t("seller.fields.images")}</div>
          <div className="text-xs opacity-70">{t("seller.images.hint")}</div>

          <div
            className={
              "rounded-2xl border-2 border-dotted p-4 transition-colors " +
              (isDragging ? "border-primary bg-primary/5" : "border-base-200 bg-base-100")
            }
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
              setImageError(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDrop={(e) => void onDropImages(e)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            onClick={() => fileInputRef.current?.click()}
            aria-label={t("seller.fields.images")}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="text-sm font-semibold">{t("seller.images.dropHere")}</div>
              <div className="text-xs opacity-70">
                {t("seller.images.or")} <span className="link link-primary">{t("seller.images.browse")}</span>
              </div>
              <div className="mt-1 text-xs opacity-70">
                {t("seller.images.count")}: {images.length} / {MAX_IMAGES} (min {MIN_IMAGES})
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              void onPickImages(e.target.files);
              e.currentTarget.value = "";
            }}
          />

          {imageError ? <div className="text-xs text-error">{imageError}</div> : null}
          {!imageError && images.length > 0 && images.length < MIN_IMAGES ? (
            <div className="text-xs text-warning">{t("seller.errors.imagesMin")}</div>
          ) : null}

          {images.length ? (
            <div className="grid grid-cols-4 gap-2">
              {images.map((src, idx) => (
                <div key={src + idx} className="relative aspect-square overflow-hidden rounded-xl border border-base-200 bg-base-200">
                  <Image src={src} alt="Uploaded" fill className="object-cover" sizes="96px" />
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost absolute right-1 top-1 bg-base-100/70"
                    onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label={t("seller.actions.remove")}
                    title={t("seller.actions.remove")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <button className="btn btn-primary" type="submit" disabled={formik.isSubmitting}>
          {t("seller.actions.create")}
        </button>
      </form>
    </Card>
  );
}
