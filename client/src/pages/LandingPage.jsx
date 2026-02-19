import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './LandingPage.css';

const techItems = [
  {
    icon: 'search-outline',
    title: 'Find nearby work in minutes',
    text: "FreeToWork connects you with nearby opportunities so you can start earning from your free time. Post or discover flexible jobs based on your skills and availability.",
  },
  {
    icon: 'notifications-outline',
    title: 'Stay notified and in control',
    text: 'Sign up using your NID to help keep the community safe and trusted. Turn on your online status to get timely notifications when new jobs match your profile.',
  },
  {
    icon: 'swap-vertical-outline',
    title: 'Filter jobs to fit your life',
    text: 'Use smart filters by category, location, and type of work to quickly reach the opportunities that actually match your needs and preferences.',
  },
  {
    icon: 'server',
    title: 'Built for Bangladesh, powered by tech',
    text: "FreeToWork uses modern technology to connect job seekers and employers across Bangladesh, helping people turn free hours into real income and impact.",
  },
];

const serviceCards = [
  { image: '/home_page/images/pic5.jpg', title: 'Reliable drivers for daily commutes' },
  { image: '/home_page/images/pic6.jpg', title: 'Home cooks and kitchen helpers' },
  { image: '/home_page/images/pic7.jpg', title: 'Personal assistants you can trust' },
  { image: '/home_page/images/pic8.jpg', title: 'Software and IT problem solvers' },
  { image: '/home_page/images/pic9.jpg', title: 'Skilled mechanics near your area' },
  { image: '/home_page/images/pic10.jpg', title: 'Local electricians on demand' },
  { image: '/home_page/images/pic11.jpg', title: 'Support for medical assistance' },
  { image: '/home_page/images/pic12.jpg', title: 'Professional cleaners for any space' },
];

const LandingNavbar = ({ mobileMenuOpen, toggleMobileMenu, activeNav, handleNavClick }) => (
  <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
    <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-full bg-[#d11f0c] flex items-center justify-center text-xs font-semibold text-white">
          FT
        </div>
        <div className="flex flex-col leading-snug">
          <span className="text-sm font-semibold text-slate-900">FreeToWork</span>
          <span className="text-[11px] text-slate-500">Smart job marketplace</span>
        </div>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className={`transition-colors ${activeNav === 'home' ? 'text-[#d11f0c]' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <a href="#home">Home</a>
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('tech')}
          className={`transition-colors ${activeNav === 'tech' ? 'text-[#d11f0c]' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <a href="#tech">How it works</a>
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('jobs')}
          className={`transition-colors ${activeNav === 'jobs' ? 'text-[#d11f0c]' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <a href="#services">Job categories</a>
        </button>
      </div>
      <div className="hidden md:flex">
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-full bg-[#d11f0c] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#b91a09] transition"
        >
          Sign in
        </Link>
      </div>
      <div className="md:hidden flex items-center gap-3">
        <Link
          to="/login"
          className="inline-flex items-center justify-center rounded-full bg-[#d11f0c] px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#b91a09] transition"
        >
          Sign in
        </Link>
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <span className="sr-only">Open navigation</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-slate-800 transition-transform ${
                mobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-slate-800 transition-opacity ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-slate-800 transition-transform ${
                mobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </div>
    </nav>
    {mobileMenuOpen && (
      <div className="md:hidden border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left rounded-lg px-3 py-2 ${
              activeNav === 'home' ? 'bg-slate-100 text-[#d11f0c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <a href="#home">Home</a>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('tech')}
            className={`block w-full text-left rounded-lg px-3 py-2 ${
              activeNav === 'tech' ? 'bg-slate-100 text-[#d11f0c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <a href="#tech">How it works</a>
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('jobs')}
            className={`block w-full text-left rounded-lg px-3 py-2 ${
              activeNav === 'jobs' ? 'bg-slate-100 text-[#d11f0c]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <a href="#services">Job categories</a>
          </button>
        </div>
      </div>
    )}
  </header>
);

const HeroSection = () => (
  <section
    id="home"
    className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-50"
  >
    <div className="absolute inset-0 opacity-40">
      <div className="pointer-events-none absolute -left-10 top-10 h-64 w-64 rounded-full bg-[#d11f0c]/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
    </div>
    <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-16 lg:py-20 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Turn free hours into income, anywhere in Bangladesh
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
          A modern way to find nearby work and trusted help.
        </h1>
        <p className="text-sm sm:text-base text-slate-200/80 max-w-xl">
          FreeToWork connects students, professionals, and daily workers with real opportunities
          around them. Discover flexible jobs, or hire reliable people for what you need done.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-[#d11f0c] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#d11f0c]/40 hover:bg-[#b91a09] transition"
          >
            Get started now
          </Link>
          <a
            href="#tech"
            className="inline-flex items-center justify-center rounded-full border border-slate-500/80 bg-transparent px-5 py-3 text-sm font-medium text-slate-50 hover:bg-slate-800/70 transition"
          >
            Learn how it works
          </a>
        </div>
        <dl className="grid grid-cols-3 gap-4 pt-4 text-xs sm:text-sm">
          <div>
            <dt className="font-semibold text-slate-50">10K+</dt>
            <dd className="text-slate-300">Jobs posted</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-50">24/7</dt>
            <dd className="text-slate-300">Access from anywhere</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-50">100%</dt>
            <dd className="text-slate-300">Free to get started</dd>
          </div>
        </dl>
      </div>
      <div className="relative">
        <div className="absolute -top-6 -left-6 h-28 w-28 rounded-3xl bg-sky-500/40 blur-2xl" />
        <div className="absolute -bottom-10 -right-8 h-40 w-40 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="relative rounded-3xl bg-slate-900/60 shadow-2xl shadow-black/50 ring-1 ring-slate-600/80 p-4">
          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-800/80 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-300">Job seekers</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">Discover work nearby</p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-slate-100 text-lg">
                <ion-icon name="walk-outline" />
              </span>
            </div>
            <div className="rounded-2xl bg-slate-800/80 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-300">Job posters</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">Hire trusted people fast</p>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-slate-100 text-lg">
                <ion-icon name="briefcase-outline" />
              </span>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-600/70 bg-slate-900/40 p-4">
              <p className="text-xs font-medium text-slate-300">Safe and verified</p>
              <p className="mt-1 text-xs text-slate-300">
                NID-based sign up helps create a safer, more responsible community for everyone.
              </p>
            </div>
          </div>
          <img
            id="main__img"
            src="/home_page/images/pic1.svg"
            alt="People collaborating through FreeToWork"
            className="mt-4 w-full h-40 object-contain opacity-80"
          />
        </div>
      </div>
    </div>
  </section>
);

const TechSection = () => (
  <section id="tech" className="bg-white">
    <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
      <div className="space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <ion-icon name="barcode-outline" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">
          How FreeToWork uses technology to match people and work.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl">
          FreeToWork is designed for Bangladesh, but powered by simple, smart technology. We make
          it easy to post jobs, discover opportunities, and build trust between people who work and
          people who hire.
        </p>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl">
          Whether you want a nearby driver, a home tutor, a mechanic, or a software expert, our
          platform brings everything into one place so you spend less time searching and more time
          doing.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {techItems.map((item) => (
          <li key={item.title} className="h-full">
            <div className="h-full rounded-2xl bg-slate-50 px-5 py-4 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:ring-sky-100 transition">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <ion-icon name={item.icon} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const ServicesSection = ({ productContainerRef, scrollContainer }) => (
  <section id="services" className="bg-slate-50">
    <div className="max-w-6xl mx-auto px-4 py-16 lg:py-20 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-sky-700 uppercase mb-2">
            Job categories
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            What kind of help are you looking for today?
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-md">
            Browse categories that match everyday needs in Bangladeshi homes, businesses, and
            streets. Each card opens a path to people ready to work.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollContainer('prev')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <span className="sr-only">Previous</span>
            <img src="/home_page/images/arrow.png" alt="" className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollContainer('next')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <span className="sr-only">Next</span>
            <img src="/home_page/images/arrow.png" alt="" className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          ref={productContainerRef}
          className="flex gap-6 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
        >
          {serviceCards.map((card, index) => (
            <div
              key={card.title}
              className="relative flex-none w-64 sm:w-72 snap-start overflow-hidden rounded-2xl bg-slate-900 shadow-lg shadow-slate-900/40"
            >
              <div className="relative h-40">
                <img
                  src={card.image}
                  className="h-full w-full object-cover"
                  alt={`Service ${index + 1}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
                <h3 className="text-sm sm:text-base font-medium text-white">{card.title}</h3>
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-[#d11f0c] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#b91a09] transition"
                >
                  Browse jobs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const LandingFooter = ({
  feedbackEmail,
  feedbackMessage,
  onEmailChange,
  onMessageChange,
  onSubmit,
  submitting,
}) => (
  <footer className="bg-slate-950 text-slate-200">
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">About FreeToWork</h2>
        <p className="text-sm text-slate-300">
          FreeToWork is Bangladesh&apos;s online job marketplace where your free time turns into
          earnings. Discover nearby jobs, hire trusted people, and build a more flexible way to
          work and live.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <a
            href="https://www.facebook.com/TANZIMBINNASIR00"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
          >
            <span className="fab fa-facebook-f" />
          </a>
          <a
            href="https://www.linkedin.com/in/aninda-roy-dhruba-aa0039201/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
          >
            <span className="fab fa-linkedin" />
          </a>
          <a
            href="https://www.instagram.com/nafiztalukder/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
          >
            <span className="fab fa-instagram" />
          </a>
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
          >
            <span className="fab fa-youtube" />
          </a>
        </div>
        <div className="pt-4 space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <span className="fas fa-map-marker-alt" />
            <a href="https://shorturl.at/eqzJL" className="hover:text-slate-100">
              CUET, Chittagong
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="fas fa-phone-alt" />
            <span>+880-1712345678</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fas fa-envelope" />
            <span>freetowork@gmail.com</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Share your feedback</h2>
        <p className="text-sm text-slate-300">
          Tell us what you love, what is confusing, or what you want next. Your feedback helps us
          build a better marketplace for everyone.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="feedback_email" className="text-xs font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              id="feedback_email"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={feedbackEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_message" className="text-xs font-medium text-slate-200">
              Message
            </label>
            <textarea
              id="feedback_message"
              name="message"
              rows="3"
              required
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
              value={feedbackMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Share your thoughts with us..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-full bg-[#d11f0c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#b91a09] disabled:cursor-not-allowed disabled:opacity-70 transition"
          >
            {submitting ? 'Sending...' : 'Send feedback'}
          </button>
        </form>
      </div>
    </div>
    <div className="border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
        <span>
          Created by{' '}
          <a href="#" className="text-slate-300 hover:text-slate-100">
            Tanzim, Nafiz, Dhrubo
          </a>{' '}
          · 2020 All rights reserved.
        </span>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const productContainerRef = useRef(null);
  const [activeNav, setActiveNav] = useState('home');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
    setMobileMenuOpen(false);
  };

  const scrollContainer = (direction) => {
    if (productContainerRef.current) {
      const container = productContainerRef.current;
      const width = container.getBoundingClientRect().width;
      if (direction === 'next') {
        container.scrollLeft += width;
      } else {
        container.scrollLeft -= width;
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackMessage) {
      toast.error('Please provide both email and message.');
      return;
    }
    try {
      setSubmittingFeedback(true);
      await api.post('/feedback', {
        email: feedbackEmail,
        message: feedbackMessage,
      });
      toast.success('Feedback submitted successfully!');
      setFeedbackEmail('');
      setFeedbackMessage('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
      <LandingNavbar
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        activeNav={activeNav}
        handleNavClick={handleNavClick}
      />
      <main className="flex-1">
        <HeroSection />
        <TechSection />
        <ServicesSection
          productContainerRef={productContainerRef}
          scrollContainer={scrollContainer}
        />
      </main>
      <LandingFooter
        feedbackEmail={feedbackEmail}
        feedbackMessage={feedbackMessage}
        onEmailChange={setFeedbackEmail}
        onMessageChange={setFeedbackMessage}
        onSubmit={handleFeedbackSubmit}
        submitting={submittingFeedback}
      />
    </div>
  );
};

export default LandingPage;
