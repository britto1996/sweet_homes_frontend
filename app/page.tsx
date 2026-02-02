"use client";

import Image from "next/image";
import Reveal from "./components/Animations/Reveal";
import IPhonePreview from "./components/IPhonePreview";
import { useI18n } from "./components/I18n/I18nProvider";
import Link from "next/link";
import { PATHS } from "@/constants/path";
import { PROPERTIES } from "./data/properties";

export default function Home() {
  const { t, priceFromUsd } = useI18n();

  const trendingDubai = PROPERTIES.filter((p) => p.country === "UAE" && p.city.en === "Dubai" && p.status === "available").slice(0, 3);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Hero */}
      <main>
        <section className="sweethomes-hero relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="sweethomes-blob -left-20 -top-24 bg-primary/20" />
            <div className="sweethomes-blob -right-24 top-14 bg-accent/20" />
            <div className="sweethomes-grid-mask" />
          </div>

          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
            <Reveal delayMs={40} threshold={0.05}>
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-base-200 bg-base-100/70 px-3 py-1 text-xs backdrop-blur">
                  <span className="badge badge-primary badge-sm">{t("hero.badgeNew")}</span>
                  <span className="opacity-80">{t("hero.badgeText")}</span>
                </div>

                <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                  {t("hero.title")}
                </h1>
                <p className="mt-4 max-w-xl text-pretty text-base/7 opacity-80">
                  {t("hero.subtitle")}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-md">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="opacity-60"
                    >
                      <path
                        d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      type="text"
                      className="grow"
                      placeholder={t("hero.searchPlaceholder")}
                      aria-label="Search location"
                    />
                  </label>
                  <button className="btn btn-primary">{t("actions.search")}</button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="badge badge-outline">{t("hero.chips.apartments")}</span>
                  <span className="badge badge-outline">{t("hero.chips.villas")}</span>
                  <span className="badge badge-outline">{t("hero.chips.studios")}</span>
                  <span className="badge badge-outline">{t("hero.chips.nearMetro")}</span>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-base-200 bg-base-100/70 p-4 backdrop-blur">
                    <div className="text-lg font-semibold">{t("hero.stats.activeValue")}</div>
                    <div className="text-xs opacity-70">{t("hero.stats.activeListings")}</div>
                  </div>
                  <div className="rounded-2xl border border-base-200 bg-base-100/70 p-4 backdrop-blur">
                    <div className="text-lg font-semibold">{t("hero.stats.ratingValue")}</div>
                    <div className="text-xs opacity-70">{t("hero.stats.avgRating")}</div>
                  </div>
                  <div className="rounded-2xl border border-base-200 bg-base-100/70 p-4 backdrop-blur">
                    <div className="text-lg font-semibold">{t("hero.stats.shortlistValue")}</div>
                    <div className="text-xs opacity-70">{t("hero.stats.toShortlist")}</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right preview */}
            <Reveal delayMs={120} threshold={0.05}>
              <IPhonePreview />
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <Reveal>
          <section id="features" className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("sections.features.title")}</h2>
                <p className="mt-2 max-w-2xl opacity-80">
                  {t("sections.features.subtitle")}
                </p>
              </div>
              <button className="btn btn-outline btn-sm self-start md:self-auto">{t("actions.seeHow")}</button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: t("sections.features.cards.smartSearch.title"),
                  desc: t("sections.features.cards.smartSearch.desc"),
                  icon: (
                    <path
                      d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  ),
                },
                {
                  title: t("sections.features.cards.shortlistShare.title"),
                  desc: t("sections.features.cards.shortlistShare.desc"),
                  icon: (
                    <path
                      d="M7 7h10v10H7V7Zm-3 3h3m10 0h3m-3 7h3m-16 0h3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  ),
                },
                {
                  title: t("sections.features.cards.tourReady.title"),
                  desc: t("sections.features.cards.tourReady.desc"),
                  icon: (
                    <path
                      d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  ),
                },
              ].map((f, idx) => (
                <Reveal key={f.title} delayMs={idx * 90}>
                  <div className="card border border-base-200 bg-base-100">
                    <div className="card-body">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            {f.icon}
                          </svg>
                        </div>
                        <div className="font-semibold">{f.title}</div>
                      </div>
                      <p className="mt-1 opacity-80">{f.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Listings */}
        <Reveal>
          <section id="listings" className="bg-base-200/60">
            <div className="mx-auto w-full max-w-6xl px-4 py-14">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("sections.trending.title")}</h2>
                <Link className="btn btn-primary btn-sm" href={PATHS.listings}>
                  {t("actions.browseAll")}
                </Link>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {trendingDubai.map((p, idx) => (
                  <Reveal key={p.id} delayMs={idx * 90}>
                    <div className="card h-full overflow-hidden bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                      <figure className="relative aspect-[16/10] w-full bg-base-200">
                        <Image
                          src={p.images[0] ?? "/apartments/apartment-1.svg"}
                          alt={p.name.en}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-base-100/70 via-transparent to-transparent" />
                      </figure>

                      <div className="card-body flex h-full flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold">{p.name.en}</div>
                            <div className="text-sm opacity-70">{p.location.en}</div>
                          </div>
                          <span className="badge badge-outline">{t("sections.trending.featured")}</span>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="text-primary font-semibold">
                            {priceFromUsd(p.usdPricePerMonth)} {t("money.perMonthSuffix")}
                          </div>
                          <Link className="btn btn-outline btn-sm" href={PATHS.property(p.id)}>
                            {t("actions.view")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Testimonials */}
        <Reveal>
          <section id="testimonials" className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{t("sections.testimonials.title")}</h2>
                <p className="mt-2 opacity-80">
                  {t("sections.testimonials.subtitle")}
                </p>
                <div className="mt-5 flex gap-2">
                  <button className="btn btn-primary">{t("actions.startSearching")}</button>
                  <button className="btn btn-ghost">{t("actions.contact")}</button>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    quote: t("sections.testimonials.quotes.a.quote"),
                    name: t("sections.testimonials.quotes.a.name"),
                    role: t("sections.testimonials.quotes.a.role"),
                  },
                  {
                    quote: t("sections.testimonials.quotes.b.quote"),
                    name: t("sections.testimonials.quotes.b.name"),
                    role: t("sections.testimonials.quotes.b.role"),
                  },
                ].map((tItem, idx) => (
                  <Reveal key={tItem.name} delayMs={idx * 120}>
                    <div className="card border border-base-200 bg-base-100">
                      <div className="card-body">
                        <p className="text-sm opacity-90">“{tItem.quote}”</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold">{tItem.name}</div>
                            <div className="text-xs opacity-70">{tItem.role}</div>
                          </div>
                          <div className="rating rating-sm">
                            <input type="radio" className="mask mask-star-2 bg-warning" readOnly checked />
                            <input type="radio" className="mask mask-star-2 bg-warning" readOnly checked />
                            <input type="radio" className="mask mask-star-2 bg-warning" readOnly checked />
                            <input type="radio" className="mask mask-star-2 bg-warning" readOnly checked />
                            <input type="radio" className="mask mask-star-2 bg-warning" readOnly checked />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <section className="mx-auto w-full max-w-6xl px-4 pb-16">
            <div className="rounded-3xl border border-base-200 bg-linear-to-br from-primary/10 via-base-100 to-accent/10 p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{t("sections.cta.title")}</h3>
                  <p className="mt-2 opacity-80">{t("sections.cta.subtitle")}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary">{t("actions.getStarted")}</button>
                  <button className="btn btn-outline">{t("actions.viewListings")}</button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="border-t border-base-200 bg-base-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="text-sm opacity-70">
            © {new Date().getFullYear()} {t("brand.name")}. {t("footer.copyright")}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a className="link-hover opacity-70" href="#features">
              {t("nav.features")}
            </a>
            <a className="link-hover opacity-70" href="#listings">
              {t("nav.listings")}
            </a>
            <a className="link-hover opacity-70" href="#testimonials">
              {t("nav.reviews")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
