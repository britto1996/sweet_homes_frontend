import Header from "./components/Header";
import Reveal from "./components/Animations/Reveal";
import IPhonePreview from "./components/IPhonePreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Top nav */}
      <Header />

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
                  <span className="badge badge-primary badge-sm">New</span>
                  <span className="opacity-80">Smart search + instant shortlists</span>
                </div>

                <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                  Discover beautiful homes in minutes.
                </h1>
                <p className="mt-4 max-w-xl text-pretty text-base/7 opacity-80">
                  Search, compare, and save listings with a clean, fast interface built for real people.
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
                      placeholder="City, neighborhood, or ZIP"
                      aria-label="Search location"
                    />
                  </label>
                  <button className="btn btn-primary">Search</button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="badge badge-outline">Apartments</span>
                  <span className="badge badge-outline">Villas</span>
                  <span className="badge badge-outline">Studios</span>
                  <span className="badge badge-outline">Near metro</span>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-base-200 bg-base-100/70 p-4 backdrop-blur">
                    <div className="text-lg font-semibold">10k+</div>
                    <div className="text-xs opacity-70">Active listings</div>
                  </div>
                  <div className="rounded-2xl border border-base-200 bg-base-100/70 p-4 backdrop-blur">
                    <div className="text-lg font-semibold">4.9</div>
                    <div className="text-xs opacity-70">Avg. rating</div>
                  </div>
                  <div className="rounded-2xl border border-base-200 bg-base-100/70 p-4 backdrop-blur">
                    <div className="text-lg font-semibold">2 min</div>
                    <div className="text-xs opacity-70">To shortlist</div>
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
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Everything you need to pick faster</h2>
                <p className="mt-2 max-w-2xl opacity-80">
                  A clean landing experience with modern cards, smooth hierarchy, and clear calls to action.
                </p>
              </div>
              <button className="btn btn-outline btn-sm self-start md:self-auto">See how it works</button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Smart search",
                  desc: "Find homes by area, price, and lifestyle filters — quickly.",
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
                  title: "Shortlist & share",
                  desc: "Save favorites and send them to friends in seconds.",
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
                  title: "Tour-ready",
                  desc: "Everything important at a glance: price, specs, and next steps.",
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
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Trending listings</h2>
                <button className="btn btn-primary btn-sm">Browse all</button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  { name: "Sunset Loft", tag: "Downtown", price: "$1,420/mo" },
                  { name: "Garden House", tag: "Quiet area", price: "$2,080/mo" },
                  { name: "City Studio", tag: "Near metro", price: "$990/mo" },
                ].map((c, idx) => (
                  <Reveal key={c.name} delayMs={idx * 90}>
                    <div className="card bg-base-100 shadow-sm">
                      <div className="card-body">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold">{c.name}</div>
                            <div className="text-sm opacity-70">{c.tag}</div>
                          </div>
                          <span className="badge badge-outline">Featured</span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-primary font-semibold">{c.price}</div>
                          <button className="btn btn-outline btn-sm">View</button>
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
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">People love the simplicity</h2>
                <p className="mt-2 opacity-80">
                  A landing experience that feels premium without being heavy.
                </p>
                <div className="mt-5 flex gap-2">
                  <button className="btn btn-primary">Start searching</button>
                  <button className="btn btn-ghost">Contact</button>
                </div>
              </div>
              <div className="grid gap-4">
                {[
                  {
                    quote: "The UI is clean and fast — I shortlisted 6 places in 5 minutes.",
                    name: "Ayesha",
                    role: "Renter",
                  },
                  {
                    quote: "Filters are exactly where I expect them. No confusion.",
                    name: "Omar",
                    role: "Buyer",
                  },
                ].map((t, idx) => (
                  <Reveal key={t.name} delayMs={idx * 120}>
                    <div className="card border border-base-200 bg-base-100">
                      <div className="card-body">
                        <p className="text-sm opacity-90">“{t.quote}”</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold">{t.name}</div>
                            <div className="text-xs opacity-70">{t.role}</div>
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
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">Ready to find your next home?</h3>
                  <p className="mt-2 opacity-80">Start with a search and build a shortlist you can trust.</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary">Get started</button>
                  <button className="btn btn-outline">View listings</button>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="border-t border-base-200 bg-base-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <div className="text-sm opacity-70">© {new Date().getFullYear()} SweetHomes. All rights reserved.</div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a className="link-hover opacity-70" href="#features">
              Features
            </a>
            <a className="link-hover opacity-70" href="#listings">
              Listings
            </a>
            <a className="link-hover opacity-70" href="#testimonials">
              Reviews
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
