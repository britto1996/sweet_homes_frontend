"use client";

import React, { useMemo, useRef } from "react";
import { animated, to, useSpring } from "@react-spring/web";

type Listing = {
  title: string;
  meta: string;
  price: string;
};

const listings: Listing[] = [
  {
    title: "Modern Apartment",
    meta: "2 bed • 2 bath • 1,120 sqft",
    price: "$1,650 / mo",
  },
  {
    title: "Cozy Studio",
    meta: "Studio • 1 bath • 540 sqft",
    price: "$980 / mo",
  },
  {
    title: "Family Home",
    meta: "3 bed • 2 bath • 1,860 sqft",
    price: "$2,250 / mo",
  },
];

export default function IPhonePreview() {
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
                  <div className="text-sm font-semibold">Nearby picks</div>
                  <div className="badge badge-primary badge-sm">Live</div>
                </div>

                <div className="mt-3 grid gap-3">
                  {listings.map((item) => (
                    <div
                      key={item.title}
                      className="card border border-base-300 bg-base-100 shadow-sm"
                    >
                      <div className="card-body gap-2 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold leading-tight">{item.title}</div>
                            <div className="text-xs opacity-70">{item.meta}</div>
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
                          <div className="text-sm font-semibold text-primary">{item.price}</div>
                          <div className="flex gap-1">
                            <span className="badge badge-outline badge-sm">Tour</span>
                            <span className="badge badge-outline badge-sm">Map</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-base-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">One-tap filters</div>
                    <div className="text-xs opacity-70">Updated now</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-primary badge-sm">Pet friendly</span>
                    <span className="badge badge-ghost badge-sm">Furnished</span>
                    <span className="badge badge-ghost badge-sm">Parking</span>
                    <span className="badge badge-ghost badge-sm">Gym</span>
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
          No clutter UI
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-primary" />
          Fast shortlist
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-info" />
          Mobile-first
        </span>
      </div>
    </div>
  );
}
