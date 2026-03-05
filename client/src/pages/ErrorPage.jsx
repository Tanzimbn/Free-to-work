import { useNavigate, useLocation } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-50">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Big 404 */}
      <p className="select-none text-[160px] font-black leading-none tracking-tighter text-slate-800 sm:text-[220px]">
        404
      </p>

      {/* Content overlaid on top */}
      <div className="-mt-12 flex flex-col items-center text-center sm:-mt-16">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6 text-violet-400">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          The page{' '}
          <span className="font-mono text-slate-400">{location.pathname}</span>
          {' '}doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-5 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/30"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
