import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/Button';
import { Card, CardTitle, CardDescription } from '../../components/Card';

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
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted">Loading organizer dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-error">
          <h2 className="text-lg font-bold">Failed to load dashboard</h2>
          <p className="text-sm mt-1">{error}</p>
          <Button variant="outline" size="sm" onClick={loadDashboardData} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Events',
      value: stats?.totalEvents ?? 0,
      description: 'All created events',
      iconBg: 'bg-primary/10 text-primary',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents ?? 0,
      description: 'Published & scheduled',
      iconBg: 'bg-emerald-100 text-emerald-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      description: 'Confirmed attendee orders',
      iconBg: 'bg-amber-100 text-amber-700',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Tickets Sold',
      value: stats?.ticketsSold ?? 0,
      description: 'Across all ticket tiers',
      iconBg: 'bg-coral/10 text-coral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Organizer Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your event schedule, ticket availability, and operational metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/organizer/events">
            <Button variant="secondary" size="md">
              Manage Events
            </Button>
          </Link>
          <Link to="/organizer/events/new">
            <Button variant="cta" size="md">
              + Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <Card key={index} className="flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
              {card.icon}
            </div>
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">{card.title}</span>
              <p className="text-2xl font-extrabold text-text mt-0.5">{card.value}</p>
              <p className="text-xs text-muted mt-0.5">{card.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">Upcoming Events</h2>
            <p className="text-xs text-muted">Your scheduled and published live events.</p>
          </div>
          <Link to="/organizer/events" className="text-sm font-bold text-primary hover:underline">
            View All Events &rarr;
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
                <Card key={event._id} className="flex flex-col sm:flex-row gap-4 p-5 hover:shadow-md transition-shadow">
                  {/* Thumbnail Poster */}
                  <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-border">
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
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          {event.category}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {event.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-text text-base line-clamp-1">{event.title}</h3>
                      <p className="text-xs text-muted mt-1">
                        📅 {eventDate} • ⏰ {event.startTime} - {event.endTime}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        📍 {event.venueName}, {event.city}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-muted">Tickets: </span>
                        <span className="font-bold text-text">
                          {totalSold} / {event.totalCapacity} ({percentSold}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link to={`/events/${event._id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link to={`/organizer/events/${event._id}/edit`}>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12 border-dashed border-border bg-slate-50/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-lg">No Upcoming Events</CardTitle>
            <CardDescription className="max-w-sm mx-auto mt-1 mb-6">
              You do not have any published upcoming events scheduled. Create one now to start discovery and ticketing.
            </CardDescription>
            <Link to="/organizer/events/new">
              <Button variant="cta" size="sm">
                + Create Your First Event
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
