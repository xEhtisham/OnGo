import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const STATUS_TABS = ['All', 'Published', 'Drafts', 'Sold Out', 'Ended'];

const CATEGORIES = [
  'All Categories',
  'Music',
  'Sports',
  'Food & Drink',
  'Arts & Culture',
  'Business',
  'Education',
  'Technology',
  'Other',
];

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [deletingId, setDeletingId] = useState(null);

  // Attendee roster state
  const [attendeeModalEvent, setAttendeeModalEvent] = useState(null);
  const [eventAttendees, setEventAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [attendeeError, setAttendeeError] = useState('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [attendeeTierFilter, setAttendeeTierFilter] = useState('All');

  const handleOpenAttendees = async (event) => {
    setAttendeeModalEvent(event);
    setAttendeeSearch('');
    setAttendeeTierFilter('All');
    try {
      setLoadingAttendees(true);
      setAttendeeError('');
      const res = await api.getEventBookings(event._id);
      setEventAttendees(res?.data?.bookings || []);
    } catch (err) {
      setAttendeeError(err.message || 'Failed to load attendee roster');
    } finally {
      setLoadingAttendees(false);
    }
  };

  const handleExportCSV = () => {
    if (!eventAttendees.length || !attendeeModalEvent) return;

    const headers = [
      'Booking Reference',
      'Attendee Name',
      'Email',
      'Phone',
      'Tickets',
      'Total PKR',
      'Status',
      'Booking Date',
    ];
    const rows = eventAttendees.map((b) => {
      const name = b.attendeeDetails?.fullName || b.user?.name || 'Attendee';
      const email = b.attendeeDetails?.email || b.user?.email || '';
      const phone = b.attendeeDetails?.phone || '';
      const tickets = (b.tickets || []).map((t) => `${t.name} (x${t.quantity})`).join('; ');
      const amount = b.totalAmount || 0;
      const status = b.status || 'confirmed';
      const date = b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '';

      return [
        `"${b.bookingReference || ''}"`,
        `"${name.replace(/"/g, '""')}"`,
        `"${email.replace(/"/g, '""')}"`,
        `"${phone.replace(/"/g, '""')}"`,
        `"${tickets.replace(/"/g, '""')}"`,
        amount,
        `"${status}"`,
        `"${date}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = attendeeModalEvent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('href', url);
    link.setAttribute('download', `${safeTitle}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All Categories') params.category = selectedCategory;

      const response = await api.getOrganizerEvents(params);
      setEvents(response?.data?.events || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch your events.');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(eventId);
      await api.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      alert(err.message || 'Failed to delete event.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      Draft: 'bg-amber-100 text-amber-800 border-amber-200',
      'Sold Out': 'bg-rose-100 text-rose-800 border-rose-200',
      Ended: 'bg-slate-200 text-slate-700 border-slate-300',
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
          styles[status] || 'bg-slate-100 text-slate-700'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-surface-container">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">My Events</h1>
            <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-bold">
              {events.length} {events.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">
            Manage your draft and published event listings, ticket allocations, and entry rosters.
          </p>
        </div>

        <Link
          to="/organizer/events/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Create New Event</span>
        </Link>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-surface-container text-xs font-bold scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search Input */}
          <div className="sm:col-span-8 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, venue name, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-container bg-surface-container-lowest text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container placeholder:text-outline shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-lowest text-on-surface text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container cursor-pointer shadow-xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-surface-container-low animate-pulse border border-surface-container"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventDate = new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            const totalSold = event.ticketTypes?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0;
            const capacity = event.totalCapacity || 1;
            const percentSold = Math.min(100, Math.round((totalSold / capacity) * 100));

            return (
              <div
                key={event._id}
                className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                {/* Media 16:9 */}
                <div className="relative aspect-video w-full bg-surface-container overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">{getStatusBadge(event.status)}</div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-primary-container font-bold">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      <span>{eventDate}</span>
                      <span className="text-outline">•</span>
                      <span>{event.startTime || 'TBA'}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-on-surface line-clamp-1">{event.title}</h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 line-clamp-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">pin_drop</span>
                      <span>
                        {event.venueName}, {event.city}
                      </span>
                    </p>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted">Tickets:</span>
                        <span className="font-bold text-on-surface">
                          {totalSold} / {event.totalCapacity} ({percentSold}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className="h-full bg-primary-container rounded-full transition-all duration-300"
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAttendees(event)}
                      className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-xs font-bold text-on-surface transition flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">group</span>
                      <span>Attendees</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/events/${event._id}`}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition"
                      >
                        View
                      </Link>
                      <Link
                        to={`/organizer/events/${event._id}/edit`}
                        className="px-3 py-1.5 rounded-xl border border-surface-container text-xs font-bold text-primary-container hover:bg-surface-container-low transition shadow-xs"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(event._id, event.title)}
                        disabled={deletingId === event._id}
                        className="p-1.5 rounded-xl text-outline hover:text-error hover:bg-red-50 transition"
                        title="Delete event"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container-low flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[32px]">event_busy</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-on-surface">No events found</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              {searchQuery || selectedStatus !== 'All' || selectedCategory !== 'All Categories'
                ? 'No events match your current filter and search query. Try clearing filters.'
                : 'You have not created any events yet. Create your first event now to begin ticketing.'}
            </p>
          </div>

          <Link
            to="/organizer/events/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold shadow-xs hover:bg-primary transition"
          >
            + Create Your First Event
          </Link>
        </div>
      )}

      {/* Attendee Roster Modal */}
      {attendeeModalEvent && (() => {
        const rosterTiers = [
          'All',
          ...new Set(eventAttendees.flatMap((b) => (b.tickets || []).map((t) => t.name))),
        ];
        const filteredAttendees = eventAttendees.filter((b) => {
          const q = attendeeSearch.trim().toLowerCase();
          const name = (b.attendeeDetails?.fullName || b.user?.name || '').toLowerCase();
          const email = (b.attendeeDetails?.email || b.user?.email || '').toLowerCase();
          const ref = (b.bookingReference || '').toLowerCase();
          const phone = (b.attendeeDetails?.phone || '').toLowerCase();

          const matchesSearch =
            !q || name.includes(q) || email.includes(q) || ref.includes(q) || phone.includes(q);
          const matchesTier =
            attendeeTierFilter === 'All' || (b.tickets || []).some((t) => t.name === attendeeTierFilter);

          return matchesSearch && matchesTier;
        });

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-surface-container space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container gap-3">
                <div>
                  <h3 className="text-xl font-extrabold text-on-surface">Attendee Roster</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">{attendeeModalEvent.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {eventAttendees.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition shadow-xs"
                      title="Export attendee list as CSV"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Export CSV</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setAttendeeModalEvent(null)}
                    className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container-low transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Confirmed
                  </span>
                  <span className="text-lg font-extrabold text-primary-container">
                    {eventAttendees.length}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Tickets
                  </span>
                  <span className="text-lg font-extrabold text-on-surface">
                    {eventAttendees.reduce((sum, b) => sum + (b.totalTickets || 0), 0)}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600">
                    PKR {eventAttendees.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Filter Toolbar inside Modal */}
              {eventAttendees.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                  <div className="sm:col-span-8 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline text-xs">
                      <span className="material-symbols-outlined text-[16px]">search</span>
                    </span>
                    <input
                      type="text"
                      value={attendeeSearch}
                      onChange={(e) => setAttendeeSearch(e.target.value)}
                      placeholder="Search by name, email, phone, or reference..."
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-surface-container bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 placeholder:text-outline"
                    />
                    {attendeeSearch && (
                      <button
                        onClick={() => setAttendeeSearch('')}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-outline hover:text-on-surface text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="sm:col-span-4">
                    <select
                      value={attendeeTierFilter}
                      onChange={(e) => setAttendeeTierFilter(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container/20 cursor-pointer"
                    >
                      <option value="All">All Tiers ({eventAttendees.length})</option>
                      {rosterTiers
                        .filter((t) => t !== 'All')
                        .map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Roster List */}
              {loadingAttendees ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 border-3 border-primary-container border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-muted">Loading attendee list...</p>
                </div>
              ) : attendeeError ? (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {attendeeError}
                </div>
              ) : eventAttendees.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <span className="text-3xl">👥</span>
                  <h4 className="text-sm font-bold text-on-surface">No attendees yet</h4>
                  <p className="text-xs text-muted max-w-xs mx-auto">
                    When attendees reserve tickets for this event, their booking references will appear here.
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                  {filteredAttendees.map((booking) => (
                    <div
                      key={booking._id}
                      className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-on-surface font-bold text-sm">
                            {booking.attendeeDetails?.fullName || booking.user?.name || 'Attendee'}
                          </strong>
                          <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-primary font-mono text-[10px] font-bold">
                            {booking.bookingReference}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-[11px]">
                          {booking.attendeeDetails?.email || booking.user?.email}{' '}
                          {booking.attendeeDetails?.phone ? `• ${booking.attendeeDetails.phone}` : ''}
                        </p>
                      </div>

                      <div className="sm:text-right space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-container">
                        <div className="font-semibold text-on-surface">
                          {booking.tickets?.map((t) => `${t.name} (×${t.quantity})`).join(', ')}
                        </div>
                        <div className="text-[11px] font-extrabold text-primary-container">
                          PKR {booking.totalAmount?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="w-full py-3 rounded-xl border border-surface-container bg-surface-container-lowest text-on-surface font-bold text-xs hover:bg-surface-container-low transition"
                onClick={() => setAttendeeModalEvent(null)}
              >
                Close Roster
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
