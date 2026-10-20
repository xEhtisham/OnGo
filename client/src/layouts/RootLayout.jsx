import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-sans antialiased">
      <Navbar />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Modern Stitch Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container shadow-[0_-1px_8px_rgba(0,0,0,0.02)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Link to="/">
                <Logo />
              </Link>
              <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
                Find events, book tickets, and show up. The modern pulse of live entertainment, music festivals, and cultural discovery across Pakistan.
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All systems operational • Verified Ticketing</span>
              </div>
              <div className="text-xs text-muted pt-1">
                © {new Date().getFullYear()} OnGo Inc. All rights reserved.
              </div>
            </div>

            {/* Column 1: Explore */}
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-4">Explore</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
                <li>
                  <Link to="/explore?category=Music" className="hover:text-primary-container transition-colors">
                    Concerts & Music
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=Sports" className="hover:text-primary-container transition-colors">
                    Live Sports & Matches
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=Food%20%26%20Drink" className="hover:text-primary-container transition-colors">
                    Food & Festivals
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=Arts%20%26%20Culture" className="hover:text-primary-container transition-colors">
                    Arts & Theatre
                  </Link>
                </li>
                <li>
                  <Link to="/explore?category=Technology" className="hover:text-primary-container transition-colors">
                    Tech & Conferences
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Metros */}
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-4">Top Cities</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
                <li>
                  <Link to="/explore?city=Islamabad" className="hover:text-primary-container transition-colors">
                    Islamabad
                  </Link>
                </li>
                <li>
                  <Link to="/explore?city=Lahore" className="hover:text-primary-container transition-colors">
                    Lahore
                  </Link>
                </li>
                <li>
                  <Link to="/explore?city=Karachi" className="hover:text-primary-container transition-colors">
                    Karachi
                  </Link>
                </li>
                <li>
                  <Link to="/explore?city=Rawalpindi" className="hover:text-primary-container transition-colors">
                    Rawalpindi
                  </Link>
                </li>
                <li>
                  <Link to="/explore?city=Peshawar" className="hover:text-primary-container transition-colors">
                    Peshawar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: For Organizers */}
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-4">For Organizers</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
                <li>
                  <Link to="/organizer/events/new" className="hover:text-primary-container transition-colors">
                    Host an Event
                  </Link>
                </li>
                <li>
                  <Link to="/organizer/dashboard" className="hover:text-primary-container transition-colors">
                    Organizer Studio
                  </Link>
                </li>
                <li>
                  <Link to="/organizer/events" className="hover:text-primary-container transition-colors">
                    Attendee Rosters
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="hover:text-primary-container transition-colors">
                    Discovery Marketplace
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Account & Safety */}
            <div>
              <h4 className="font-bold text-sm text-on-surface mb-4">Account & Safety</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-on-surface-variant">
                <li>
                  <Link to="/my-tickets" className="hover:text-primary-container transition-colors">
                    My Tickets
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="hover:text-primary-container transition-colors">
                    Profile Settings
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary-container transition-colors">
                    Attendee Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-primary-container transition-colors">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
            <div className="flex items-center gap-6">
              <span>PCI-DSS Compliant</span>
              <span>•</span>
              <span>Encrypted Checkout</span>
              <span>•</span>
              <span>Instant Digital Pass Generation</span>
            </div>
            <div>
              Internship ID: <span className="font-mono font-bold text-on-surface">ZYNVEX-CERT-1436</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
