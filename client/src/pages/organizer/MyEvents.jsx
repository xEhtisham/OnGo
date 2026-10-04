import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import { Card, CardTitle, CardDescription } from '../../components/Card';

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

  const handleOpenAttendees = async (event) => {
    setAttendeeModalEvent(event);
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
      'Sold Out': 'bg-coral/10 text-coral border-coral/20',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-text tracking-tight">My Events</h1>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-muted text-xs font-bold">
              {events.length} {events.length === 1 ? 'Event' : 'Events'}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Manage your draft and published event listings, ticket allocations, and entries.
          </p>
        </div>

        <Link to="/organizer/events/new">
          <Button variant="cta" size="md">
            + Create New Event
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border text-sm">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-text hover:bg-slate-100'
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
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, venue name, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-text"
              >
                &times;
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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

      {/* Events Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted">Loading events...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-error text-center">
          <p className="font-bold">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchEvents} className="mt-3">
            Try Again
          </Button>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventDate = new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            // Calculate starting ticket price
            const prices = event.ticketTypes?.map((t) => Number(t.price)) || [];
            const startingPrice = prices.length ? Math.min(...prices) : 0;

            // Calculate total tickets sold & capacity
            const totalSold = event.ticketTypes?.reduce((sum, t) => sum + (t.sold || 0), 0) || 0;
            const capacity = event.totalCapacity || 1;
            const percentageSold = Math.min(100, Math.round((totalSold / capacity) * 100));

            const isDraft = event.status === 'Draft';

            return (
              <Card
                key={event._id}
                className="flex flex-col justify-between overflow-hidden p-0 border-border hover:shadow-lg transition-all group"
              >
                <div>
                  {/* Event Poster Header */}
                  <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-bold text-text shadow-sm">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">{getStatusBadge(event.status)}</div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-text text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-1 text-xs text-muted">
                      <p className="flex items-center gap-1.5 font-medium">
                        <span>📅</span>
                        <span>
                          {eventDate} • {event.startTime} - {event.endTime}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5 font-medium">
                        <span>📍</span>
                        <span className="truncate">
                          {event.venueName}, {event.city}
                        </span>
                      </p>
                    </div>

                    {/* Pricing & Capacity Metric */}
                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                      <div>
                        <span className="text-muted block">Starting from</span>
                        <span className="font-extrabold text-text text-sm text-primary">
                          PKR {startingPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted block">Tickets Sold</span>
                        <span className="font-bold text-text">
                          {totalSold} / {event.totalCapacity} ({percentageSold}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentageSold}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-border flex items-center justify-between gap-2">
                  {isDraft ? (
                    <Link
                      to={`/organizer/events/${event._id}/edit`}
                      className="flex-1"
                    >
                      <Button variant="primary" size="sm" className="w-full">
                        Continue Editing
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-1">
                      <Link to={`/events/${event._id}`} className="flex-1">
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                          View
                        </Button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenAttendees(event)}
                        className="flex-1 px-2.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-primary text-xs font-bold transition-colors"
                      >
                        Attendees
                      </button>
                      <Link to={`/organizer/events/${event._id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(event._id, event.title)}
                    disabled={deletingId === event._id}
                    className="p-2 rounded-lg text-muted hover:text-error hover:bg-red-50 disabled:opacity-50 transition-colors"
                    title="Delete event"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-16 border-dashed border-border bg-slate-50/50">
          <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <CardTitle className="text-xl">No events found</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-1 mb-6">
            {searchQuery || selectedStatus !== 'All' || selectedCategory !== 'All Categories'
              ? 'No events match your current filter and search query. Try clearing filters or altering search keywords.'
              : 'You have not created any events yet. Create your first event now to begin discovery and ticketing.'}
          </CardDescription>

          {searchQuery || selectedStatus !== 'All' || selectedCategory !== 'All Categories' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedStatus('All');
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
            >
              Clear All Filters
            </Button>
          ) : (
            <Link to="/organizer/events/new">
              <Button variant="cta" size="md">
                + Create Your First Event
              </Button>
            </Link>
          )}
        </Card>
      )}

      {/* Attendee Roster Modal */}
      {attendeeModalEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-xl font-extrabold text-text">Attendee Roster</h3>
                <p className="text-xs text-muted mt-0.5">{attendeeModalEvent.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setAttendeeModalEvent(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-text hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl border border-border">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Confirmed Bookings
                </span>
                <span className="text-xl font-extrabold text-primary">
                  {eventAttendees.length}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-border">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Tickets Reserved
                </span>
                <span className="text-xl font-extrabold text-text">
                  {eventAttendees.reduce((sum, b) => sum + (b.totalTickets || 0), 0)}
                </span>
              </div>
            </div>

            {/* Body */}
            {loadingAttendees ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <div className="w-7 h-7 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-muted">Loading attendee list...</p>
              </div>
            ) : attendeeError ? (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {attendeeError}
              </div>
            ) : eventAttendees.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <span className="text-3xl">👥</span>
                <h4 className="text-sm font-bold text-text">No attendees yet</h4>
                <p className="text-xs text-muted max-w-xs mx-auto">
                  When attendees reserve tickets for this event, their contact information and booking references will appear here.
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
                {eventAttendees.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-text font-bold text-sm">
                          {booking.attendeeDetails?.fullName || booking.user?.name || 'Attendee'}
                        </strong>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold">
                          {booking.bookingReference}
                        </span>
                      </div>
                      <p className="text-muted text-[11px]">
                        {booking.attendeeDetails?.email || booking.user?.email}{' '}
                        {booking.attendeeDetails?.phone ? `• ${booking.attendeeDetails.phone}` : ''}
                      </p>
                    </div>

                    <div className="sm:text-right space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                      <div className="font-semibold text-text">
                        {booking.tickets?.map((t) => `${t.name} (×${t.quantity})`).join(', ')}
                      </div>
                      <div className="text-[11px] text-muted font-bold text-primary">
                        PKR {booking.totalAmount?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => setAttendeeModalEvent(null)}
            >
              Close Roster
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
