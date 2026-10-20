import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';

const CATEGORIES = [
  { name: 'All', icon: '✨' },
  { name: 'Music', icon: '🎵' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Food & Drink', icon: '🍽️' },
  { name: 'Arts & Culture', icon: '🎭' },
  { name: 'Business', icon: '💼' },
  { name: 'Education', icon: '📚' },
  { name: 'Technology', icon: '💻' },
  { name: 'Other', icon: '🎪' },
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

const PRICE_PRESETS = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Free', min: '0', max: '0' },
  { label: 'Under PKR 2,000', min: '0', max: '2000' },
  { label: 'PKR 2K - 5K', min: '2000', max: '5000' },
  { label: 'PKR 5,000+', min: '5000', max: '' },
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
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialAvailability = searchParams.get('availability') === 'available';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedTimeframe, setSelectedTimeframe] = useState(initialTimeframe);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [onlyAvailable, setOnlyAvailable] = useState(initialAvailability);
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
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;
      if (onlyAvailable) params.availability = 'available';

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
      if (minPrice !== '') newParams.set('minPrice', minPrice);
      if (maxPrice !== '') newParams.set('maxPrice', maxPrice);
      if (onlyAvailable) newParams.set('availability', 'available');
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
    minPrice,
    maxPrice,
    onlyAvailable,
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

  // Reset to page 1 on filter changes
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

  const handlePricePresetSelect = (preset) => {
    setMinPrice(preset.min);
    setMaxPrice(preset.max);
    setCurrentPage(1);
  };

  const handleToggleAvailable = () => {
    setOnlyAvailable((prev) => !prev);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCity('All Cities');
    setSelectedTimeframe('upcoming');
    setSelectedSort('date-asc');
    setMinPrice('');
    setMaxPrice('');
    setOnlyAvailable(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedCity !== 'All Cities' ||
    selectedTimeframe !== 'upcoming' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    onlyAvailable ||
    selectedSort !== 'date-asc';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-primary-container text-xs font-bold uppercase tracking-wider border border-surface-container shadow-xs">
          <span className="material-symbols-outlined text-[16px]">explore</span>
          <span>Marketplace Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
          Explore Live Experiences
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          Browse upcoming concerts, tech summits, cultural exhibitions, and community festivals.
          Find your next experience and reserve tickets instantly.
        </p>
      </div>

      {/* Search & Filter Hub */}
      <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-5 sm:p-6 shadow-xs space-y-5">
        {/* Search bar & dropdowns row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title, venue, or artist..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-container bg-surface-container-low/50 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-low/50 text-sm text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition cursor-pointer"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-low/50 text-sm text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition cursor-pointer"
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-low/50 text-sm text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition cursor-pointer"
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
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
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

        {/* Price Presets & Availability Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-surface-container">
          {/* Price Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <span className="text-outline font-bold mr-1 text-[11px] uppercase tracking-wider">
              Price Range:
            </span>
            {PRICE_PRESETS.map((preset, idx) => {
              const isActive = minPrice === preset.min && maxPrice === preset.max;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePricePresetSelect(preset)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Availability Toggle */}
          <button
            type="button"
            onClick={handleToggleAvailable}
            className={`flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              onlyAvailable
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant border-surface-container hover:bg-surface-container'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                onlyAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <span>Available Tickets Only</span>
          </button>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-surface-container text-xs text-on-surface-variant">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="px-2 py-0.5 rounded-md bg-primary-container/10 text-primary-container font-semibold">
                  {selectedCategory}
                </span>
              )}
              {selectedCity !== 'All Cities' && (
                <span className="px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface font-semibold">
                  {selectedCity}
                </span>
              )}
              {selectedTimeframe !== 'upcoming' && (
                <span className="px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface font-semibold">
                  {TIMEFRAMES.find((t) => t.value === selectedTimeframe)?.label}
                </span>
              )}
              {(minPrice !== '' || maxPrice !== '') && (
                <span className="px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface font-semibold">
                  Price: {minPrice ? `PKR ${Number(minPrice).toLocaleString()}` : 'PKR 0'} -{' '}
                  {maxPrice ? `PKR ${Number(maxPrice).toLocaleString()}` : 'Any'}
                </span>
              )}
              {onlyAvailable && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                  In Stock Only
                </span>
              )}
              {searchQuery.trim() && (
                <span className="px-2 py-0.5 rounded-md bg-surface-container-low text-on-surface font-semibold">
                  &ldquo;{searchQuery.trim()}&rdquo;
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary-container hover:underline font-bold flex-shrink-0 ml-3"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-on-surface-variant">
        <p>
          Showing <span className="font-bold text-on-surface">{events.length}</span> of{' '}
          <span className="font-bold text-on-surface">{totalCount}</span> verified experiences
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-2xl border border-surface-container p-4 space-y-4 animate-pulse shadow-xs"
            >
              <div className="aspect-[16/10] bg-surface-container rounded-xl w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-surface-container rounded w-1/3" />
                <div className="h-6 bg-surface-container rounded w-3/4" />
                <div className="h-4 bg-surface-container rounded w-1/2" />
              </div>
              <div className="h-8 bg-surface-container rounded w-full pt-2" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container-low flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[32px]">event_busy</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-on-surface">No events match your criteria</h3>
            <p className="text-xs text-on-surface-variant">
              We couldn&apos;t find any events with the current filters. Try adjusting your search
              keywords, price range, or expanding your city selection.
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold shadow-xs hover:bg-primary transition"
            >
              Reset All Filters
            </button>
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
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-surface-container bg-surface-container-lowest text-xs font-bold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-surface-container-lowest transition"
          >
            ← Previous
          </button>

          <span className="px-4 text-xs font-bold text-on-surface-variant">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-surface-container bg-surface-container-lowest text-xs font-bold text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-surface-container-lowest transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
