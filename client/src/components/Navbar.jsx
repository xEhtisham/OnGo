import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinkClasses = ({ isActive }) =>
    `font-semibold text-sm transition-colors px-2 py-1 ${
      isActive
        ? 'text-primary-container font-bold border-b-2 border-primary-container'
        : 'text-on-surface-variant hover:text-on-surface'
    }`;

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-8 shrink-0">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink to="/explore" className={navLinkClasses}>
                Explore Events
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink to="/my-tickets" className={navLinkClasses}>
                    My Tickets
                  </NavLink>
                  <NavLink to="/organizer/dashboard" className={navLinkClasses}>
                    Organizer Hub
                  </NavLink>
                  <NavLink to="/organizer/events" className={navLinkClasses}>
                    My Events
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Quick Search Capsule */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 gap-2 max-w-xs w-full border border-transparent focus-within:border-primary-container/30 focus-within:bg-white transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, vibes, artists..."
              className="bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none w-full"
            />
          </form>

          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/organizer/events/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Create Event</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container-low transition-colors focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-surface-container shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-surface-container">
                        <p className="text-sm font-bold text-on-surface truncate">{user?.name}</p>
                        <p className="text-xs text-muted truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/my-tickets"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            confirmation_number
                          </span>
                          <span>My Tickets</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            person
                          </span>
                          <span>User Profile</span>
                        </Link>
                        <Link
                          to="/organizer/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            dashboard
                          </span>
                          <span>Organizer Studio</span>
                        </Link>
                        <Link
                          to="/organizer/events"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-primary-container">
                            event
                          </span>
                          <span>Manage Events</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-surface-container">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-error hover:bg-red-50 transition-colors font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="font-semibold text-sm text-on-surface hover:text-primary-container px-3.5 py-2 rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center font-bold text-sm text-white bg-primary-container hover:bg-primary px-4 py-2 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-on-surface hover:bg-surface-container-low transition"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-surface-container py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">
                search
              </span>
            </form>

            <NavLink
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-on-surface hover:bg-surface-container-low"
            >
              Explore Events
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/my-tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  My Tickets
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  User Profile
                </NavLink>
                <NavLink
                  to="/organizer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  Organizer Studio
                </NavLink>
                <NavLink
                  to="/organizer/events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  My Events
                </NavLink>
                <NavLink
                  to="/organizer/events/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-bold text-primary-container bg-primary-fixed/30"
                >
                  + Create New Event
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-base font-semibold text-error hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-surface-container flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-sm text-on-surface rounded-xl bg-surface-container-low"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-sm text-white rounded-xl bg-primary-container"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
