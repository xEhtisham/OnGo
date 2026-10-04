import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import { Card, CardTitle, CardDescription } from '../components/Card';
import EventCard from '../components/EventCard';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedEvents() {
      try {
        setLoading(true);
        const res = await api.getPublicEvents({ limit: 6, sort: 'date-asc' });
        setUpcomingEvents(res?.data?.events || []);
      } catch (err) {
        console.error('Failed to load featured events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedEvents();
  }, []);

  const highlights = [
    {
      title: 'Discover Live Experiences',
      description:
        'Browse concerts, tech summits, sports, and cultural festivals tailored to your interests and city.',
      tag: 'Explore',
      tagColor: 'bg-primary/10 text-primary',
    },
    {
      title: 'Seamless Digital Booking',
      description:
        'Reserve tickets with transparent PKR pricing, instant confirmation, and zero hassle.',
      tag: 'Ticketing',
      tagColor: 'bg-coral/10 text-coral',
    },
    {
      title: 'Organizer Control Hub',
      description:
        'Publish events, manage ticket capacities, and track attendee entries from an intuitive dashboard.',
      tag: 'Organizers',
      tagColor: 'bg-emerald-500/10 text-emerald-700',
    },
  ];

  const popularCities = ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi'];

  return (
    <div className="space-y-20 py-12 md:py-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
          The Next-Gen Event Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-text tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
          Where Unforgettable <span className="text-primary">Events</span> Begin.
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Discover trending events, book digital tickets in seconds, or host and manage your own
          experiences with OnGo.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/explore">
            <Button variant="cta" size="lg">
              Explore Events
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Create an Account
            </Button>
          </Link>
        </div>

        {/* Quick City Jump */}
        <div className="pt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-muted">
          <span>Popular cities:</span>
          {popularCities.map((city) => (
            <Link
              key={city}
              to={`/explore?city=${city}`}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary transition font-medium"
            >
              {city}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-coral uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
              Live Marketplace
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
              Upcoming Live Experiences
            </h2>
            <p className="text-sm text-muted mt-1">
              Handpicked events taking place soon across major cities.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-sm font-bold text-primary hover:text-indigo-700 transition flex items-center gap-1"
          >
            <span>See all events</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border p-4 space-y-4 animate-pulse"
              >
                <div className="aspect-[16/9] bg-slate-200 rounded-xl w-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border p-8 text-center space-y-3">
            <p className="text-base font-semibold text-text">No upcoming public events right now.</p>
            <p className="text-sm text-muted">
              Are you hosting an event? Publish your experience to reach attendees across Pakistan.
            </p>
            <Link to="/organizer/events/new">
              <Button variant="cta" size="sm" className="mt-2">
                + Create First Event
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Feature Highlight Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text">Why Choose OnGo?</h2>
          <p className="text-sm text-muted">
            Engineered for high performance, smooth ticket reservation, and reliable organizer management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <Card key={index} className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-4 ${item.tagColor}`}
                >
                  {item.tag}
                </span>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {item.description}
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
