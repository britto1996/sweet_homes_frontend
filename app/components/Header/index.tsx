"use client";

import { useI18n } from "../I18n/I18nProvider";

const Header = () => {
  const { locale, currency, setLocale, setCurrency, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-base-200/70 bg-base-100/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
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
        </div>

        <div className="flex items-center gap-2">
          <div className="dropdown dropdown-end">
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              tabIndex={0}
              aria-label={t("translator.title")}
              title={t("translator.title")}
            >
              <span className="hidden sm:inline">{locale.toUpperCase()}</span>
              <span className="opacity-70">•</span>
              <span>{currency}</span>
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
                <div className="text-xs font-semibold opacity-70">{t("translator.language")}</div>
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
                <div className="text-xs font-semibold opacity-70">{t("translator.currency")}</div>
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

          <button className="btn btn-ghost btn-sm hidden md:inline-flex">
            {t("actions.login")}
          </button>
          <button className="btn btn-primary btn-sm">{t("actions.getStarted")}</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
