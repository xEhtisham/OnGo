import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from './Button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary font-semibold' : 'text-muted hover:text-text'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                O
              </span>
              <span className="text-xl font-extrabold text-text tracking-tight">
                On<span className="text-primary">Go</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={navLinkClasses} end>
                Home
              </NavLink>
              <NavLink to="/explore" className={navLinkClasses}>
                Explore
              </NavLink>
            </nav>
          </div>

          {/* Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="cta" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              Explore
            </NavLink>
          </nav>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Log In
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="cta" size="sm" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
