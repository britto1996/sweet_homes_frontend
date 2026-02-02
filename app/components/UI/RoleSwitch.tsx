"use client";

import React from "react";

export type UserRole = "buyer" | "seller";

type Props = {
  value: UserRole;
  onChange: (value: UserRole) => void;
  labels: { buyer: string; seller: string };
  showBrandIcon?: boolean;
  brandIcon?: React.ReactNode;
};

export default function RoleSwitch({ value, onChange, labels, showBrandIcon = true, brandIcon }: Props) {
  const isBuyer = value === "buyer";
  const isSeller = value === "seller";

  const defaultBrandIcon = (
    <div className="grid h-7 w-7 place-items-center rounded-xl bg-primary text-primary-content">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <div className="join w-full">
      <button
        type="button"
        className={`btn join-item flex-1 ${isBuyer ? "btn-primary" : "btn-outline"}`}
        onClick={() => onChange("buyer")}
        aria-pressed={isBuyer}
      >
        {labels.buyer}
      </button>

      {showBrandIcon ? (
        <button
          type="button"
          className="btn join-item btn-ghost pointer-events-none"
          aria-hidden="true"
          tabIndex={-1}
        >
          {brandIcon ?? defaultBrandIcon}
        </button>
      ) : null}

      <button
        type="button"
        className={`btn join-item flex-1 ${isSeller ? "btn-primary" : "btn-outline"}`}
        onClick={() => onChange("seller")}
        aria-pressed={isSeller}
      >
        {labels.seller}
      </button>
    </div>
  );
}
