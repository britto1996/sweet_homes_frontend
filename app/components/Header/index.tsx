"use client";

import Link from "next/link";
import React from "react";
import { PATHS } from "@/constants/path";
import { useI18n } from "../I18n/I18nProvider";
import { useWishlist } from "../Wishlist/WishlistProvider";
import { useAuth } from "../Auth/AuthProvider";
import { ShoppingBag } from "lucide-react";

const Header = () => {
  const { locale, currency, setLocale, setCurrency, t } = useI18n();
  const { count: wishlistCount } = useWishlist();
  const { user, profile, logout } = useAuth();

  const displayEmail = profile?.email ?? user?.email;
  const displayRole = profile?.role ?? user?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-base-200/70 bg-base-100/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href={PATHS.home} className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-content shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 11.5 12 4l9 7.5v8.5a2 2 0 0 1-2 2h-4v-6a3 3 0 0 0-6 0v6H5a2 2 0 0 1-2-2v-8.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">
              {t("brand.name")}
            </div>
            <div className="text-xs opacity-70">{t("brand.tagline")}</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Seller: My properties */}
          {user?.role === "seller" ? (
            <Link
              href={PATHS.sellerProperties}
              className="btn btn-ghost btn-sm hidden md:inline-flex"
              aria-label={t("nav.myProperties")}
              title={t("nav.myProperties")}
            >
              {t("nav.myProperties")}
            </Link>
          ) : null}

          {/* Desktop wishlist button */}
          <Link
            href={PATHS.wishlist}
            className="btn btn-ghost btn-sm hidden md:inline-flex"
            aria-label={t("nav.wishlist")}
            title={t("nav.wishlist")}
          >
            <span className="relative inline-flex items-center gap-2">
              <span>
                <ShoppingBag />
              </span>
              {wishlistCount > 0 ? (
                <div className="absolute -top-2 -right-1 flex size-5 pl-2 pr-2 items-center justify-center rounded-full bg-red-500">
                  <p className="text-xs text-white">
                    {wishlistCount}
                  </p>
                </div>
              ) : null}
            </span>
          </Link>

          <div className="dropdown dropdown-end">
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              tabIndex={0}
              aria-label={t("translator.title")}
              title={t("translator.title")}
            >
              <span className="hidden sm:inline">{locale.toUpperCase()}</span>
              <span className="hidden sm:inline opacity-70">•</span>
              <span className="hidden sm:inline">{currency}</span>
              <span className="sm:hidden">{currency}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="ml-1 opacity-70"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              tabIndex={0}
              className="dropdown-content z-60 mt-2 w-64 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
            >
              <div className="px-2 py-2 text-xs font-semibold opacity-70">
                {t("translator.title")}
              </div>

              <div className="px-2 pb-2">
                <div className="text-xs font-semibold opacity-70">
                  {t("translator.language")}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    className={`btn btn-sm ${locale === "en" ? "btn-primary" : "btn-outline"}`}
                    type="button"
                    onClick={() => setLocale("en")}
                  >
                    {t("translator.english")}
                  </button>
                  <button
                    className={`btn btn-sm ${locale === "ar" ? "btn-primary" : "btn-outline"}`}
                    type="button"
                    onClick={() => setLocale("ar")}
                  >
                    {t("translator.arabic")}
                  </button>
                </div>
              </div>

              <div className="divider my-1" />

              <div className="px-2 pb-2">
                <div className="text-xs font-semibold opacity-70">
                  {t("translator.currency")}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    className={`btn btn-sm ${currency === "USD" ? "btn-primary" : "btn-outline"}`}
                    type="button"
                    onClick={() => setCurrency("USD")}
                  >
                    {t("translator.usd")}
                  </button>
                  <button
                    className={`btn btn-sm ${currency === "AED" ? "btn-primary" : "btn-outline"}`}
                    type="button"
                    onClick={() => setCurrency("AED")}
                  >
                    {t("translator.aed")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop auth */}
          {user ? (
            <div className="dropdown dropdown-end hidden md:inline-flex">
              <button
                className="btn btn-ghost btn-sm"
                type="button"
                tabIndex={0}
                aria-label={t("auth.account")}
                title={t("auth.account")}
              >
                <span className="max-w-48 truncate">{displayEmail}</span>
                {displayRole ? (
                  <span className="badge badge-outline badge-sm ml-2">
                    {t(displayRole === "buyer" ? "auth.buyer" : "auth.seller")}
                  </span>
                ) : null}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="ml-1 opacity-70"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                tabIndex={0}
                className="dropdown-content z-60 mt-2 w-72 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
              >
                <div className="px-2 py-2 text-xs font-semibold opacity-70">
                  {t("auth.signedInAs")}
                </div>
                <div className="px-2 pb-2 text-sm">
                  <div className="font-medium truncate">{displayEmail}</div>
                  {displayRole ? (
                    <div className="mt-1 text-xs opacity-70">
                      {t("auth.role")}:{" "}
                      {t(
                        displayRole === "buyer" ? "auth.buyer" : "auth.seller",
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="divider my-1" />

                <button
                  className="btn btn-ghost btn-sm w-full justify-start"
                  type="button"
                  onClick={logout}
                >
                  {t("actions.logout")}
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                className="btn btn-ghost btn-sm hidden md:inline-flex"
                href={PATHS.login}
              >
                {t("actions.login")}
              </Link>
              <Link
                className="btn btn-primary btn-sm hidden md:inline-flex"
                href={PATHS.register}
              >
                {t("actions.getStarted")}
              </Link>
            </>
          )}

          {/* Mobile menu */}
          <div className="dropdown dropdown-end md:hidden">
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              tabIndex={0}
              aria-label="Menu"
              title="Menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 6h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 12h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div
              tabIndex={0}
              className="dropdown-content z-60 mt-2 w-72 rounded-2xl border border-base-200 bg-base-100 p-2 shadow-xl"
            >
              <div className="px-2 py-2 text-xs font-semibold opacity-70">
                {t("brand.name")}
              </div>

              <div className="divider my-1" />

              {user?.role === "seller" ? (
                <Link
                  className="btn btn-ghost btn-sm w-full justify-start"
                  href={PATHS.sellerProperties}
                >
                  {t("nav.myProperties")}
                </Link>
              ) : null}

              <Link
                className="btn btn-ghost btn-sm w-full justify-start"
                href={PATHS.wishlist}
              >
                <span className="flex w-full items-center justify-between">
                  <span>{t("nav.wishlist")}</span>
                  {wishlistCount > 0 ? (
                    <div className="absolute left-25 flex size-5 items-center justify-center rounded-full bg-red-500">
                      <p className="text-xs text-white">
                        {wishlistCount}
                      </p>
                    </div>
                  ) : null}
                </span>
              </Link>

              <div className="divider my-1" />

              {user ? (
                <button
                  className="btn btn-ghost btn-sm w-full justify-start"
                  type="button"
                  onClick={logout}
                >
                  {t("actions.logout")}
                </button>
              ) : (
                <Link
                  className="btn btn-ghost btn-sm w-full justify-start"
                  href={PATHS.login}
                >
                  {t("actions.login")}
                </Link>
              )}
              {!user ? (
                <Link
                  className="btn btn-primary btn-sm w-full justify-start"
                  href={PATHS.register}
                >
                  {t("actions.getStarted")}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
