import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import Button from '../components/Button';

const CATEGORIES = [
  'All',
  'Music',
  'Sports',
  'Food & Drink',
  'Arts & Culture',
  'Business',
  'Education',
  'Technology',
  'Other',
];

const CITIES = [
  'All Cities',
  'Islamabad',
  'Lahore',
  'Karachi',
  'Rawalpindi',
  'Peshawar',
  'Faisalabad',
  'Multan',
  'Quetta',
];

const TIMEFRAMES = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Today', value: 'today' },
  { label: 'This Weekend', value: 'this-weekend' },
  { label: 'This Month', value: 'this-month' },
  { label: 'All Dates', value: 'all' },
];

const SORTS = [
  { label: 'Soonest First', value: 'date-asc' },
  { label: 'Latest First', value: 'date-desc' },
  { label: 'Newly Added', value: 'newest' },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL parameters or defaults
  const initialCategory = searchParams.get('category') || 'All';
  const initialCity = searchParams.get('city') || 'All Cities';
  const initialSearch = searchParams.get('search') || '';
  const initialTimeframe = searchParams.get('timeframe') || 'upcoming';
  const initialSort = searchParams.get('sort') || 'date-asc';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedTimeframe, setSelectedTimeframe] = useState(initialTimeframe);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page: currentPage,
        limit: 9,
        sort: selectedSort,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedCity !== 'All Cities') params.city = selectedCity;
      if (selectedTimeframe !== 'upcoming') params.timeframe = selectedTimeframe;

      const response = await api.getPublicEvents(params);

      setEvents(response?.data?.events || []);
      setTotalCount(response?.total || 0);
      setTotalPages(response?.totalPages || 1);

      // Keep URL search params in sync
      const newParams = new URLSearchParams();
      if (searchQuery.trim()) newParams.set('search', searchQuery.trim());
      if (selectedCategory !== 'All') newParams.set('category', selectedCategory);
      if (selectedCity !== 'All Cities') newParams.set('city', selectedCity);
      if (selectedTimeframe !== 'upcoming') newParams.set('timeframe', selectedTimeframe);
      if (selectedSort !== 'date-asc') newParams.set('sort', selectedSort);
      if (currentPage > 1) newParams.set('page', currentPage.toString());

      setSearchParams(newParams, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to discover events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedTimeframe,
    selectedSort,
    currentPage,
    setSearchParams,
  ]);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  // Reset to page 1 whenever search, category, or city changes
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setCurrentPage(1);
  };

  const handleTimeframeChange = (e) => {
    setSelectedTimeframe(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCity('All Cities');
    setSelectedTimeframe('upcoming');
    setSelectedSort('date-asc');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedCity !== 'All Cities' ||
    selectedTimeframe !== 'upcoming' ||
    selectedSort !== 'date-asc';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          Marketplace Discovery
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
          Explore Events in Pakistan
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl">
          Browse upcoming concerts, tech summits, cultural exhibitions, and community festivals.
          Find your next experience and reserve tickets instantly.
        </p>
      </div>

      {/* Search & Filter Hub */}
      <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-sm space-y-5">
        {/* Search bar & dropdowns row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, venue, or artist..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-text"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* City Selector */}
          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm text-text font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selector */}
          <div className="md:col-span-2">
            <select
              value={selectedTimeframe}
              onChange={handleTimeframeChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm text-text font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-2">
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm text-text font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-100 text-muted hover:text-text hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-muted">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Filtering by:</span>
              {selectedCategory !== 'All' && (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                  {selectedCategory}
                </span>
              )}
              {selectedCity !== 'All Cities' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-text font-medium">
                  {selectedCity}
                </span>
              )}
              {selectedTimeframe !== 'upcoming' && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-text font-medium">
                  {TIMEFRAMES.find((t) => t.value === selectedTimeframe)?.label}
                </span>
              )}
              {searchQuery.trim() && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-text font-medium">
                  "{searchQuery.trim()}"
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary hover:underline font-semibold flex-shrink-0 ml-3"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-muted">
        <p>
          Showing <span className="font-bold text-text">{events.length}</span> of{' '}
          <span className="font-bold text-text">{totalCount}</span> events
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/9] bg-slate-200 rounded-xl w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
              <div className="h-8 bg-slate-200 rounded w-full pt-2" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text">No events match your search</h3>
            <p className="text-sm text-muted">
              We couldn't find any events with the current filters. Try adjusting your search
              keywords, selecting "All Categories", or expanding your city selection.
            </p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          )}
        </div>
      ) : (
        /* Event Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>

          <span className="px-4 text-xs font-semibold text-muted">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
