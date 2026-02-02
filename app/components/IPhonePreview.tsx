"use client";

import React, { useMemo, useRef } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import { useI18n } from "./I18n/I18nProvider";

type Listing = {
  titleKey: string;
  metaKey: string;
  usdPrice: number;
};

const listings: Listing[] = [
  {
    titleKey: "preview.listings.modernApartment.title",
    metaKey: "preview.listings.modernApartment.meta",
    usdPrice: 1650,
  },
  {
    titleKey: "preview.listings.cozyStudio.title",
    metaKey: "preview.listings.cozyStudio.meta",
    usdPrice: 980,
  },
  {
    titleKey: "preview.listings.familyHome.title",
    metaKey: "preview.listings.familyHome.meta",
    usdPrice: 2250,
  },
];

export default function IPhonePreview() {
  const { t, priceFromUsd } = useI18n();
  const frameRef = useRef<HTMLDivElement | null>(null);

  const floatSpring = useSpring({
    from: { floatY: 0 },
    to: async (next) => {
      // Subtle continuous float (Apple-ish)
      while (true) {
        await next({ floatY: -10 });
        await next({ floatY: 0 });
      }
    },
    config: { mass: 3, tension: 140, friction: 18 },
  });

  const [{ rotX, rotY, scale }, tiltApi] = useSpring(() => ({
    rotX: 0,
    rotY: 0,
    scale: 1,
    config: { mass: 1.2, tension: 220, friction: 22 },
  }));

  const transform = useMemo(
    () =>
      to([floatSpring.floatY, rotX, rotY, scale], (fy, x, y, s) => {
        return `perspective(900px) translate3d(0, ${fy}px, 0) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
      }),
    [floatSpring.floatY, rotX, rotY, scale]
  );

  return (
    <div className="relative flex flex-col items-center">
      {/* Smaller on mobile, crisp sizing (no scale hacks) */}
      <animated.div
        ref={frameRef}
        className="select-none"
        style={{ transform, willChange: "transform" }}
        onPointerMove={(e) => {
          const node = frameRef.current;
          if (!node) return;
          const rect = node.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const nx = (px - 0.5) * 2;
          const ny = (py - 0.5) * 2;
          tiltApi.start({
            rotX: ny * -6,
            rotY: nx * 8,
            scale: 1.02,
          });
        }}
        onPointerLeave={() => {
          tiltApi.start({ rotX: 0, rotY: 0, scale: 1 });
        }}
      >
        <div className="relative mx-auto w-63 sm:w-75">
          {/* Outer frame */}
          <div className="rounded-[2.8rem] bg-neutral p-2.5 shadow-2xl shadow-base-300/70">
            <div className="relative overflow-hidden rounded-[2.25rem] bg-base-200">
              {/* Dynamic Island */}
              <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-7 w-30 -translate-x-1/2 rounded-full bg-neutral/90" />
              {/* Side buttons */}
              <div className="pointer-events-none absolute -left-0.75 top-16 h-10 w-0.75 rounded-full bg-neutral/70" />
              <div className="pointer-events-none absolute -left-0.75 top-28 h-14 w-0.75 rounded-full bg-neutral/70" />
              <div className="pointer-events-none absolute -right-0.75 top-24 h-16 w-0.75 rounded-full bg-neutral/70" />

              {/* Screen */}
              <div className="relative z-10 px-4 pb-4 pt-11">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{t("preview.nearbyPicks")}</div>
                  <div className="badge badge-primary badge-sm">{t("preview.live")}</div>
                </div>

                <div className="mt-3 grid gap-3">
                  {listings.map((item) => (
                    <div
                      key={item.titleKey}
                      className="card border border-base-300 bg-base-100 shadow-sm"
                    >
                      <div className="card-body gap-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold leading-tight">{t(item.titleKey)}</div>
                            <div className="text-xs opacity-70">{t(item.metaKey)}</div>
                          </div>
                          <button className="btn btn-ghost btn-xs" aria-label="Save listing">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M12 21s-7-4.4-9.2-8.6C.8 8.8 3.1 6 6.3 6c1.8 0 3.4.9 4.3 2.2C11.6 6.9 13.2 6 15 6c3.2 0 5.5 2.8 3.5 6.4C19 16.6 12 21 12 21Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-primary">
                            {priceFromUsd(item.usdPrice)} {t("money.perMonthSuffix")}
                          </div>
                          <div className="flex gap-1">
                            <span className="badge badge-outline badge-sm">{t("preview.filters.tour")}</span>
                            <span className="badge badge-outline badge-sm">{t("preview.filters.map")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-base-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{t("preview.oneTapFilters")}</div>
                    <div className="text-xs opacity-70">{t("preview.updatedNow")}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-primary badge-sm">{t("preview.filters.petFriendly")}</span>
                    <span className="badge badge-ghost badge-sm">{t("preview.filters.furnished")}</span>
                    <span className="badge badge-ghost badge-sm">{t("preview.filters.parking")}</span>
                    <span className="badge badge-ghost badge-sm">{t("preview.filters.gym")}</span>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="pointer-events-none mt-4 flex justify-center">
                  <div className="h-1 w-24 rounded-full bg-neutral/20" />
                </div>
              </div>

              {/* Screen gloss */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-70" />
            </div>
          </div>
        </div>
      </animated.div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs opacity-70">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-success" />
          {t("preview.badges.noClutter")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-primary" />
          {t("preview.badges.fastShortlist")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-info" />
          {t("preview.badges.mobileFirst")}
        </span>
      </div>
    </div>
  );
}
