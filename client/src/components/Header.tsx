import { useState } from "react";
import { Link } from "react-router-dom";

export function Header({ subtitle }: { subtitle?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0a2540] text-[#ff8c1a] shadow-md">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight text-slate-900">
              Nashik <span className="text-[#ff8c1a]">Startup Map</span>
            </h1>
            <p className="text-xs text-slate-500">
              {subtitle ?? "Explore startups & companies hiring in Nashik"}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/">Explore</NavLink>
          <NavLink to="/submit">Submit a company</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://github.com/OMD-123"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            GitHub
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden rounded-lg border border-slate-300 p-2"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/" onClick={() => setOpen(false)}>Explore</NavLink>
            <NavLink to="/submit" onClick={() => setOpen(false)}>Submit a company</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  );
}