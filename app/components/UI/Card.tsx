import React from "react";

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export default function Card({ title, subtitle, className, children }: Props) {
  return (
    <div className={`card border border-base-200 bg-base-100 ${className ?? ""}`.trim()}>
      <div className="card-body gap-4">
        {title ? (
          <div>
            <div className="text-lg font-semibold">{title}</div>
            {subtitle ? <div className="mt-1 text-sm opacity-70">{subtitle}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
