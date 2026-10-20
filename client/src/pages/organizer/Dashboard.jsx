import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getOrganizerStats();
      if (response?.data) {
        setStats(response.data.stats);
        setUpcomingEvents(response.data.upcomingEvents || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-on-surface-variant">Loading organizer dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700">
          <h2 className="text-lg font-bold">Failed to load dashboard</h2>
          <p className="text-xs mt-1">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Events',
      value: stats?.totalEvents ?? 0,
      description: 'All created events',
      icon: 'calendar_month',
      iconColor: 'text-primary-container',
      barColor: 'bg-primary-container',
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents ?? 0,
      description: 'Live on marketplace',
      icon: 'upcoming',
      iconColor: 'text-tertiary-container',
      barColor: 'bg-emerald-600',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      description: 'Confirmed attendee orders',
      icon: 'receipt_long',
      iconColor: 'text-primary-container',
      barColor: 'bg-primary',
    },
    {
      title: 'Tickets Sold',
      value: stats?.ticketsSold ?? 0,
      description: 'Across all ticket tiers',
      icon: 'confirmation_number',
      iconColor: 'text-secondary-container',
      barColor: 'bg-secondary-container',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-surface-container">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span>Organizer Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Track real-time event status, ticket sales quotas, and attendee bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/organizer/events"
            className="px-4 py-2.5 rounded-xl border border-surface-container bg-surface-container-lowest text-on-surface font-bold text-sm hover:bg-surface-container-low transition shadow-xs"
          >
            Manage Events
          </Link>
          <Link
            to="/organizer/events/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Create Event</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metricCards.map((card, index) => (
          <div
            key={index}
            className="relative bg-surface-container-lowest rounded-2xl border border-surface-container p-6 shadow-xs flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
                <span className={`material-symbols-outlined text-[22px] ${card.iconColor}`}>
                  {card.icon}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-extrabold text-on-surface leading-none tracking-tight">
                {card.value}
              </div>
              <p className="mt-1.5 text-xs text-on-surface-variant">{card.description}</p>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${card.barColor}`}></div>
          </div>
        ))}
      </div>

      {/* Quick Navigation Strip */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/organizer/events/new"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center group-hover:bg-primary-container group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-on-surface truncate">Create Event</span>
              <span className="text-[11px] text-muted">New ticketed listing</span>
            </div>
          </Link>

          <Link
            to="/organizer/events"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface flex items-center justify-center group-hover:bg-primary-container group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">format_list_bulleted</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-on-surface truncate">Manage Events</span>
              <span className="text-[11px] text-muted">Edit details &amp; quotas</span>
            </div>
          </Link>

          <Link
            to="/organizer/events"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface flex items-center justify-center group-hover:bg-primary-container group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-on-surface truncate">Attendee Rosters</span>
              <span className="text-[11px] text-muted">Search &amp; CSV export</span>
            </div>
          </Link>

          <Link
            to="/explore"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary-container/10 text-secondary-container flex items-center justify-center group-hover:bg-secondary-container group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">explore</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-on-surface truncate">Live Marketplace</span>
              <span className="text-[11px] text-muted">View public listings</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-xs text-on-surface-variant">Your published live events.</p>
          </div>
          <Link
            to="/organizer/events"
            className="text-xs font-bold text-primary-container hover:underline inline-flex items-center gap-1"
          >
            <span>View All ({upcomingEvents.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => {
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
                  className="bg-surface-container-lowest rounded-3xl border border-surface-container p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4"
                >
                  {/* Thumbnail Poster */}
                  <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-fixed text-primary uppercase">
                          {event.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                          {event.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-on-surface text-base line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-1">
                        📅 {eventDate} {event.startTime ? `• ⏰ ${event.startTime}` : ''}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        📍 {event.venueName}, {event.city}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-muted">Tickets: </span>
                        <span className="font-extrabold text-on-surface">
                          {totalSold} / {event.totalCapacity} ({percentSold}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/events/${event._id}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition"
                        >
                          View
                        </Link>
                        <Link
                          to={`/organizer/events/${event._id}/edit`}
                          className="px-3 py-1.5 rounded-xl border border-surface-container text-xs font-bold text-primary-container hover:bg-surface-container-low transition shadow-xs"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-surface-container rounded-3xl bg-surface-container-lowest p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">event_available</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">No Upcoming Events</h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              You do not have any published upcoming events scheduled. Create one now to start discovery and ticketing.
            </p>
            <Link
              to="/organizer/events/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold shadow-xs hover:bg-primary transition"
            >
              + Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
