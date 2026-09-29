import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text font-sans antialiased">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-white mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white font-bold text-xs">
              O
            </span>
            <span className="font-bold text-text">OnGo</span>
            <span className="text-xs text-muted ml-2">
              © {new Date().getFullYear()} OnGo. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted">
            <Link to="/explore" className="hover:text-text transition-colors">
              Explore Events
            </Link>
            <Link to="/login" className="hover:text-text transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-text transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
