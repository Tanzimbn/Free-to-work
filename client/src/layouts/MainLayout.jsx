/**
 * MainLayout provides the main layout structure for the application.
 * It includes a background glow effect and a fixed navbar.
 * The children elements will be rendered inside this layout.
 */

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#d11f0c]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      {children}
    </div>
  );
}

export default MainLayout;