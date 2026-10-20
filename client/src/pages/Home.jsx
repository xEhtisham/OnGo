import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';

const CATEGORIES = [
  { name: 'All Categories', icon: '✨' },
  { name: 'Music', icon: '🎵' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Food & Drink', icon: '🍽️' },
  { name: 'Arts & Culture', icon: '🎭' },
  { name: 'Business', icon: '💼' },
  { name: 'Technology', icon: '💻' },
  { name: 'Education', icon: '📚' },
  { name: 'Festivals', icon: '🎪' },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Search capsule state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchTimeframe, setSearchTimeframe] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const params = { limit: 8, sort: 'date-asc' };
        if (selectedCategory !== 'All Categories') {
          params.category = selectedCategory;
        }
        const res = await api.getPublicEvents(params);
        setEvents(res?.data?.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.set('search', searchQuery.trim());
    if (searchCity) queryParams.set('city', searchCity);
    if (searchTimeframe) queryParams.set('timeframe', searchTimeframe);
    navigate(`/explore?${queryParams.toString()}`);
  };

  const featuredEvent = events[0] || null;
  const secondaryEvent1 = events[1] || null;
  const secondaryEvent2 = events[2] || null;

  return (
    <div className="flex flex-col w-full pb-20">
      {/* HERO SECTION */}
      <section className="relative w-full px-4 sm:px-6 lg:px-8 pt-10 pb-16 overflow-hidden">
        {/* Ambient Gradient Backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-gradient-to-b from-primary-fixed/60 via-surface-container/30 to-transparent blur-3xl pointer-events-none -z-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Live Counter Pill */}
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-1.5 rounded-full shadow-xs mb-6 border border-surface-container">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
            <span className="text-xs text-on-surface-variant font-bold tracking-wide">
              Live Events & Experiences across Pakistan
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-on-surface max-w-4xl leading-tight sm:leading-tight">
            WHAT&apos;S HAPPENING <span className="text-primary-container">NEAR YOU?</span>
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mt-4 mb-8">
            Discover concerts, workshops, sports, festivals, and curated cultural experiences worth showing up for.
          </p>

          {/* 4-Field Search Capsule */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-5xl bg-surface-container-lowest rounded-2xl shadow-xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 relative z-20 border border-surface-container"
          >
            {/* Keyword Input */}
            <div className="lg:col-span-4 flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-outline text-[22px] shrink-0">
                search
              </span>
              <div className="flex flex-col text-left w-full min-w-0">
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
                  Search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Events, artists or vibes"
                  className="bg-transparent font-semibold text-sm text-on-surface placeholder:text-outline focus:outline-none w-full truncate"
                />
              </div>
            </div>

            {/* City Selector */}
            <div className="lg:col-span-3 flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-primary-container text-[22px] shrink-0">
                location_on
              </span>
              <div className="flex flex-col text-left w-full min-w-0">
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
                  City
                </span>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="bg-transparent font-semibold text-sm text-on-surface focus:outline-none cursor-pointer w-full truncate"
                >
                  <option value="">All Cities</option>
                  <option value="Islamabad">Islamabad, PK</option>
                  <option value="Lahore">Lahore, PK</option>
                  <option value="Karachi">Karachi, PK</option>
                  <option value="Rawalpindi">Rawalpindi, PK</option>
                  <option value="Peshawar">Peshawar, PK</option>
                </select>
              </div>
            </div>

            {/* When Selector */}
            <div className="lg:col-span-3 flex items-center gap-3 px-4 py-2.5 bg-surface-container-low rounded-xl">
              <span className="material-symbols-outlined text-outline text-[22px] shrink-0">
                calendar_month
              </span>
              <div className="flex flex-col text-left w-full min-w-0">
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider">
                  When
                </span>
                <select
                  value={searchTimeframe}
                  onChange={(e) => setSearchTimeframe(e.target.value)}
                  className="bg-transparent font-semibold text-sm text-on-surface focus:outline-none cursor-pointer w-full truncate"
                >
                  <option value="">Anytime</option>
                  <option value="today">Today & Tonight</option>
                  <option value="this-weekend">This Weekend</option>
                  <option value="this-month">This Month</option>
                  <option value="upcoming">All Upcoming</option>
                </select>
              </div>
            </div>

            {/* Action CTA */}
            <div className="lg:col-span-2 flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] bg-primary-container hover:bg-primary text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 px-4 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">explore</span>
                <span>Find Events</span>
              </button>
            </div>
          </form>
        </div>

        {/* Editorial Hero Mosaic */}
        {featuredEvent && (
          <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Primary Featured Card */}
            <div className="md:col-span-8 relative rounded-2xl overflow-hidden shadow-lg group min-h-[380px] lg:min-h-[440px] flex flex-col justify-end p-6 sm:p-8">
              <img
                src={featuredEvent.coverImage}
                alt={featuredEvent.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="relative z-10 flex flex-col gap-2 text-left max-w-xl text-white">
                <div className="flex items-center gap-2">
                  <span className="bg-primary-container text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    POPULAR CHOICE
                  </span>
                  <span className="text-white/80 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">
                      verified
                    </span>{' '}
                    Verified Organizer
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {featuredEvent.title}
                </h2>
                <p className="text-sm text-white/80 line-clamp-2">
                  {featuredEvent.description}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-white font-bold text-base">
                    From PKR {featuredEvent.ticketTypes?.[0]?.price ? Number(featuredEvent.ticketTypes[0].price).toLocaleString() : '0'}
                  </span>
                  <Link
                    to={`/events/${featuredEvent._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary-container hover:bg-secondary text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
                  >
                    <span>Book Pass</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Secondary Editorial Cards */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {secondaryEvent1 && (
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-md group min-h-[190px] flex flex-col justify-end p-5">
                  <img
                    src={secondaryEvent1.coverImage}
                    alt={secondaryEvent1.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="relative z-10 text-left text-white">
                    <span className="bg-secondary-container text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {secondaryEvent1.category}
                    </span>
                    <Link to={`/events/${secondaryEvent1._id}`}>
                      <h3 className="font-bold text-base sm:text-lg mt-1 text-white group-hover:text-primary-fixed transition-colors line-clamp-1">
                        {secondaryEvent1.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-white/80">
                      {secondaryEvent1.city} · From PKR{' '}
                      {secondaryEvent1.ticketTypes?.[0]?.price
                        ? Number(secondaryEvent1.ticketTypes[0].price).toLocaleString()
                        : '0'}
                    </p>
                  </div>
                </div>
              )}

              {secondaryEvent2 && (
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-md group min-h-[190px] flex flex-col justify-end p-5">
                  <img
                    src={secondaryEvent2.coverImage}
                    alt={secondaryEvent2.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="relative z-10 text-left text-white">
                    <span className="bg-tertiary-container text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {secondaryEvent2.category}
                    </span>
                    <Link to={`/events/${secondaryEvent2._id}`}>
                      <h3 className="font-bold text-base sm:text-lg mt-1 text-white group-hover:text-primary-fixed transition-colors line-clamp-1">
                        {secondaryEvent2.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-white/80">
                      {secondaryEvent2.city} · From PKR{' '}
                      {secondaryEvent2.ticketTypes?.[0]?.price
                        ? Number(secondaryEvent2.ticketTypes[0].price).toLocaleString()
                        : '0'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* QUICK DISCOVERY CATEGORY BAR */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-3 bg-surface-container-lowest border-y border-surface-container sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold text-xs transition-all ${
                    isActive
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          <Link
            to="/explore"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary-container hover:text-primary transition shrink-0"
          >
            <span>All Filters</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </Link>
        </div>
      </section>

      {/* TRENDING / DISCOVERY EVENTS GRID */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1 text-primary-container text-xs font-bold uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                <span>High Demand Experiences</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                Trending in {selectedCategory === 'All Categories' ? 'Pakistan' : selectedCategory}
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Hand-picked gigs, matches, workshops, and gatherings selling out fast
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center gap-1 text-sm font-bold text-primary-container hover:text-primary transition group self-start sm:self-auto"
            >
              <span>Explore all ({events.length}+)</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-surface-container-low h-80 animate-pulse border border-surface-container"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-surface-container p-8">
              <span className="text-4xl">🎪</span>
              <h3 className="font-bold text-lg text-on-surface mt-2">No events found in this category</h3>
              <p className="text-xs text-muted mt-1">Try switching categories or view all upcoming events.</p>
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className="mt-4 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold"
              >
                Reset to All Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW ONGO WORKS (3-STEP EXPERIENCE) */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-surface-container-low/50 border-y border-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-primary-container uppercase tracking-wider">
              Simple & Hassle-Free
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              How OnGo Works
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Everything you need from live discovery to digital door check-in in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                01
              </div>
              <h3 className="font-bold text-lg text-on-surface">Discover</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Filter hundreds of live events by city, price range, and date. Every organizer is vetted for authentic entry.
              </p>
              <div className="flex items-center gap-1.5 text-primary-container text-xs font-semibold mt-auto pt-2">
                <span className="material-symbols-outlined text-[16px]">search_check</span>
                <span>Curated & Verified</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                02
              </div>
              <h3 className="font-bold text-lg text-on-surface">Book Instantly</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Choose your pass tier, select quantities, and checkout in under 30 seconds with transparent zero hidden surprise fees.
              </p>
              <div className="flex items-center gap-1.5 text-secondary-container text-xs font-semibold mt-auto pt-2">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Safe 256-bit checkout</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                03
              </div>
              <h3 className="font-bold text-lg text-on-surface">Attend & Scan</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                No printing required. Simply present your digital boarding pass or QR barcode right from your phone for instant entry.
              </p>
              <div className="flex items-center gap-1.5 text-tertiary-container text-xs font-semibold mt-auto pt-2">
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                <span>One-tap gate pass</span>
              </div>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 pt-4 text-xs font-bold text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">verified</span>
              <span>100% Guaranteed Tickets</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary-container text-[20px]">bolt</span>
              <span>Instant Digital Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">currency_exchange</span>
              <span>Protected Refund Policy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ORGANIZER CALLOUT */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-12">
        <div className="max-w-7xl mx-auto bg-surface-container rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-surface-container-high relative overflow-hidden">
          <div className="flex flex-col gap-2 max-w-xl text-left relative z-10">
            <span className="text-xs text-primary-container font-bold uppercase tracking-wider">
              Ticketing & Box Office Tools
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
              Have an event to host?
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Create your event page, set tiered pricing, manage ticket quotas, and scan attendee QR codes right from your phone. Zero setup costs.
            </p>
            <Link
              to="/organizer/events/new"
              className="text-xs font-bold text-primary-container hover:underline inline-flex items-center gap-1 mt-2"
            >
              <span>Explore organizer studio features</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="shrink-0 relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              to="/organizer/events/new"
              className="w-full sm:w-auto bg-primary-container hover:bg-primary text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Create an Event</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
