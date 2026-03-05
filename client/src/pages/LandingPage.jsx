import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    quote:
      'I started posting driving jobs for my shop. Within a day I can usually find someone nearby who wants extra work.',
    name: 'Rahim',
    role: 'Shop owner · Chattogram',
  },
  {
    quote:
      'As a student I use FreeToWork to find weekend tutoring and design gigs so I can earn without fixed hours.',
    name: 'Nila',
    role: 'University student · Dhaka',
  },
  {
    quote:
      'We hired a reliable home cook through the platform and now recommend it to our neighbours in the building.',
    name: 'Farzana & Imran',
    role: 'Family · Sylhet',
  },
];

function LandingPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="relative z-30">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="flex items-center justify-between gap-3 rounded-full border border-slate-800 bg-slate-950/95 px-4 py-2 shadow-xl shadow-emerald-500/20 backdrop-blur md:grid md:grid-cols-[1fr_auto_1fr] md:px-5">
            <nav className="hidden items-center gap-5 text-xs font-medium text-slate-100 md:flex">
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:text-white"
              >
                <span>How it works</span>
                <span className="text-[9px]">▾</span>
              </button>
              <a href="#categories" className="hover:text-white">
                Categories
              </a>
              <a href="#community" className="hover:text-white">
                Community
              </a>
            </nav>
            <Link to="/" className="flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d11f0c] text-[11px] font-semibold text-white shadow-sm shadow-[#d11f0c]/40">
                FT
              </div>
              <span className="text-sm font-semibold text-slate-50">FreeToWork</span>
            </Link>
            <div className="flex items-center justify-end gap-2 text-xs font-medium text-slate-100">
              <Link to="/login" className="px-2 hover:text-white">
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-500/40 hover:bg-emerald-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(248,113,113,0.18),_transparent_55%)]" />
          <div className="pointer-events-none absolute -left-72 top-10 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-72 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#d11f0c]/25 blur-3xl" />
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-24 text-center">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-[11px] font-medium text-slate-200 shadow-sm shadow-sky-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Turn free time into income, anywhere in Bangladesh
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
                Find nearby work and trusted help in a few taps.
              </h1>
              <p className="text-sm text-slate-100/80 sm:text-base">
                FreeToWork connects students, professionals, and everyday workers with real
                opportunities nearby. Discover flexible jobs, or hire reliable people for what you
                need done.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/40 hover:bg-emerald-600"
                >
                  Start finding work
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-slate-950/60 px-5 py-2.5 text-sm font-medium text-slate-50 hover:border-white/70"
                >
                  I am hiring
                </Link>
              </div>
              <dl className="grid max-w-md grid-cols-3 gap-4 pt-4 text-xs text-slate-100/80 sm:text-sm mx-auto">
                <div>
                  <dt className="font-semibold text-white">10K+</dt>
                  <dd className="text-[11px] sm:text-xs">Jobs posted</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">24/7</dt>
                  <dd className="text-[11px] sm:text-xs">Access from anywhere</dd>
                </div>
                <div>
                  <dt className="font-semibold text-white">100%</dt>
                  <dd className="text-[11px] sm:text-xs">Free to get started</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-slate-800/60 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-14 lg:py-16">
            <div className="mb-8 max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                How it works
              </p>
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                A simple flow to connect people and work.
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                FreeToWork is designed for Bangladesh but powered by simple technology. Post jobs,
                discover opportunities, and build trust in just a few steps.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-semibold text-slate-400">01</p>
                <h3 className="mt-2 text-sm font-semibold text-slate-50">Create your profile</h3>
                <p className="mt-2 text-xs text-slate-300">
                  Sign up using your email and basic information. Verify to build trust in the
                  community.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-semibold text-slate-400">02</p>
                <h3 className="mt-2 text-sm font-semibold text-slate-50">Post or discover work</h3>
                <p className="mt-2 text-xs text-slate-300">
                  Browse nearby jobs or post what you need done, from driving to home repairs.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-semibold text-slate-400">03</p>
                <h3 className="mt-2 text-sm font-semibold text-slate-50">Filter and chat</h3>
                <p className="mt-2 text-xs text-slate-300">
                  Use filters by category, location, and budget to quickly find the right match.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <p className="text-xs font-semibold text-slate-400">04</p>
                <h3 className="mt-2 text-sm font-semibold text-slate-50">Work, review, repeat</h3>
                <p className="mt-2 text-xs text-slate-300">
                  Complete the work, leave reviews, and grow your reputation and opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="border-b border-slate-800/60 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-14 lg:py-16">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                  Categories
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-50 sm:text-3xl">
                  Built for everyday needs in Bangladesh.
                </h2>
              </div>
              <p className="max-w-md text-xs text-slate-300 sm:text-sm">
                From daily commuting to software support, FreeToWork brings real-world services into
                one simple, trusted place.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                <p className="text-xs font-semibold text-slate-400">Transport</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">Drivers & riders</p>
                <p className="mt-2 text-xs text-slate-300">
                  Reliable drivers for offices, universities, and city travel.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                <p className="text-xs font-semibold text-slate-400">Home</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">Kitchen & support</p>
                <p className="mt-2 text-xs text-slate-300">
                  Home cooks, helpers, and trusted household support.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                <p className="text-xs font-semibold text-slate-400">Technical</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">IT & mechanics</p>
                <p className="mt-2 text-xs text-slate-300">
                  Software help, mobile repairs, mechanics, and more.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                <p className="text-xs font-semibold text-slate-400">Care</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">Personal & medical</p>
                <p className="mt-2 text-xs text-slate-300">
                  Support for elders, children, and those needing extra care.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-14 lg:py-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Community
              </p>
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Built with real people across Bangladesh.
              </h2>
              <p className="text-sm text-slate-300 sm:text-base">
                FreeToWork grows with every driver, student, home cook, and small business using it.
                Here is how the community already uses their free hours.
              </p>
            </div>
            <div className="mt-8 overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((item) => (
                  <article
                    key={item.name}
                    className="min-w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
                  >
                    <p className="text-sm text-slate-200">{`“${item.quote}”`}</p>
                    <div className="mt-4 text-[11px] text-slate-400">
                      <p className="font-semibold text-slate-100">{item.name}</p>
                      <p>{item.role}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 w-2 rounded-full ${
                      index === activeTestimonial ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                    aria-label={`Show testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 text-sm text-slate-300 sm:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d11f0c] text-[10px] font-semibold text-white">
                FT
              </div>
              <span className="text-sm font-semibold text-slate-50">FreeToWork</span>
            </div>
            <p className="text-xs text-slate-400">
              A modern way to connect nearby work with people who have free time across Bangladesh.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Product
            </p>
            <a href="#how-it-works" className="block text-xs hover:text-slate-100">
              How it works
            </a>
            <a href="#categories" className="block text-xs hover:text-slate-100">
              Categories
            </a>
            <Link to="/login" className="block text-xs hover:text-slate-100">
              Sign in
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Community
            </p>
            <a href="#community" className="block text-xs hover:text-slate-100">
              Stories
            </a>
            <Link to="/newsfeed" className="block text-xs hover:text-slate-100">
              Newsfeed
            </Link>
            <Link to="/list" className="block text-xs hover:text-slate-100">
              Find workers
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Contact
            </p>
            <p className="text-xs text-slate-400">CUET, Chattogram</p>
            <p className="text-xs text-slate-400">freetowork@gmail.com</p>
          </div>
        </div>
        <div className="border-t border-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-4 text-center text-[11px] text-slate-500 sm:text-xs">
            <span>© {new Date().getFullYear()} FreeToWork. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
