import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import CheckoutModal from '../components/CheckoutModal';
import EventCard from '../components/EventCard';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);

  // Selected quantities for each ticket type: { [ticketId]: quantity }
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const response = await api.getEventById(id);
        if (response?.data?.event) {
          const loadedEvent = response.data.event;
          setEvent(loadedEvent);

          // Initialize selected quantities
          const initial = {};
          loadedEvent.ticketTypes?.forEach((t) => {
            initial[t._id] = 0;
          });
          setSelectedQuantities(initial);

          // Fetch similar events in the same category
          try {
            const similarRes = await api.getPublicEvents({
              category: loadedEvent.category,
              limit: 4,
            });
            const matches = (similarRes?.data?.events || []).filter(
              (e) => e._id !== loadedEvent._id
            );
            setSimilarEvents(matches.slice(0, 3));
          } catch (simErr) {
            console.error('Failed to load similar events', simErr);
          }
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-on-surface-variant">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-error flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">error</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface">Event Not Found</h2>
          <p className="text-xs text-on-surface-variant mt-2 mb-6">
            {error || 'The event you are looking for does not exist or has been removed.'}
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white text-sm font-bold shadow-xs hover:bg-primary transition"
          >
            <span>Browse Other Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOrganizer = user?._id && event.organizer?._id === user._id;

  const eventDateFormatted = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate total tickets and subtotal price
  const totalSelectedTickets = Object.values(selectedQuantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const totalPrice = event.ticketTypes.reduce((sum, ticket) => {
    const qty = selectedQuantities[ticket._id] || 0;
    return sum + qty * Number(ticket.price);
  }, 0);

  const handleQuantityChange = (ticketId, delta, remainingCapacity) => {
    const currentQty = selectedQuantities[ticketId] || 0;
    const nextQty = currentQty + delta;

    if (nextQty < 0) return;
    if (nextQty > remainingCapacity) return;

    const projectedTotal = totalSelectedTickets + delta;
    if (projectedTotal > event.maxTicketsPerBooking) {
      toast.info(`Maximum limit is ${event.maxTicketsPerBooking} tickets per booking.`);
      return;
    }

    setSelectedQuantities((prev) => ({
      ...prev,
      [ticketId]: nextQty,
    }));
  };

  const handleBookingClick = () => {
    if (totalSelectedTickets === 0) return;
    setIsCheckoutOpen(true);
  };

  const handleBookingSuccess = async () => {
    try {
      const response = await api.getEventById(id);
      if (response?.data?.event) {
        setEvent(response.data.event);
        const reset = {};
        response.data.event.ticketTypes?.forEach((t) => {
          reset[t._id] = 0;
        });
        setSelectedQuantities(reset);
      }
    } catch (err) {
      console.error('Error refreshing event capacity:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    toast.info('Event link copied to clipboard!');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownloadICS = () => {
    if (!event) return;
    const startDate = new Date(event.date);
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OnGo Events//PK',
      'BEGIN:VEVENT',
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description?.replace(/\n/g, ' ') || ''}`,
      `LOCATION:${event.venueName}, ${event.city}`,
      `DTSTART:${startDate.toISOString().replace(/-|:|\.\d+/g, '')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Calendar event (.ics) downloaded!');
  };

  // Min ticket price
  const prices = event.ticketTypes?.map((t) => Number(t.price)) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  // Capacity calculation
  const totalCapacity = event.ticketTypes?.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0) || 0;
  const totalSold = event.ticketTypes?.reduce((acc, t) => acc + (Number(t.sold) || 0), 0) || 0;
  const isSoldOut = event.status === 'Sold Out' || totalCapacity - totalSold <= 0;

  return (
    <div className="w-full pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4 text-xs font-semibold">
          <nav className="flex items-center gap-1.5 text-on-surface-variant truncate">
            <Link to="/" className="hover:text-primary-container transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <Link
              to={`/explore?category=${encodeURIComponent(event.category)}`}
              className="hover:text-primary-container transition-colors"
            >
              {event.category}
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="text-on-surface font-bold truncate max-w-[200px] sm:max-w-none">
              {event.title}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                {linkCopied ? 'check' : 'share'}
              </span>
              <span>{linkCopied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handleDownloadICS}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary-container">
                event
              </span>
              <span>Calendar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Organizer Shortcut Banner */}
        {isOrganizer && (
          <div className="p-4 rounded-2xl bg-primary-fixed/20 border border-primary-container/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                ★
              </span>
              <div>
                <p className="text-sm font-bold text-on-surface">You are the host of this event</p>
                <p className="text-xs text-on-surface-variant">
                  Status: <strong className="text-on-surface">{event.status}</strong> • Total Capacity:{' '}
                  <strong className="text-on-surface">{event.totalCapacity}</strong>
                </p>
              </div>
            </div>
            <Link
              to={`/organizer/events/${event._id}/edit`}
              className="px-4 py-2 rounded-xl bg-white border border-surface-container text-xs font-bold text-on-surface shadow-xs hover:bg-surface-container-low transition"
            >
              Manage & Edit Event
            </Link>
          </div>
        )}

        {/* HERO MEDIA & HEADER BLOCK */}
        <section className="flex flex-col gap-4">
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden bg-surface-container shadow-md">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            {/* Badges Floating on Image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-container text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md">
                  <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
                  {event.category}
                </span>

                {isSoldOut ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-error text-white text-xs font-bold rounded-full shadow-sm">
                    SOLD OUT
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-container text-white text-xs font-bold rounded-full shadow-sm animate-pulse">
                    <span>🔥</span> SELLING FAST
                  </span>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-emerald-700">{totalSold} passes reserved</span>
              </div>
            </div>

            {/* Bottom Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1 text-white">
              <span className="text-xs uppercase tracking-wider text-primary-fixed-dim font-bold">
                {event.city} • Verified Event
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-sm tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Metadata Strip Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs">
            {/* Date & Time */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[22px]">calendar_today</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Date &amp; Time
                </span>
                <span className="font-bold text-sm text-on-surface truncate">
                  {eventDateFormatted}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {event.startTime ? `${event.startTime} PKT` : 'Door opens early'}
                </span>
              </div>
            </div>

            {/* Venue & City */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
                <span className="material-symbols-outlined text-[22px]">location_on</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Location
                </span>
                <span className="font-bold text-sm text-on-surface truncate">
                  {event.venueName}
                </span>
                <span className="text-xs text-on-surface-variant truncate">
                  {event.city}, Pakistan
                </span>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50">
              <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0 font-bold text-sm">
                {event.organizer?.name ? event.organizer.name[0].toUpperCase() : 'O'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Hosted by
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-on-surface truncate">
                    {event.organizer?.name || 'OnGo Partner'}
                  </span>
                  <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                </div>
                <span className="text-xs text-emerald-700 font-medium">Verified Organizer</span>
              </div>
            </div>

            {/* Entry Price Preview */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low/50">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0 text-secondary">
                <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Starting Price
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-base text-secondary-container">
                    {minPrice === 0 ? 'Free' : `PKR ${minPrice.toLocaleString()}`}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">● Instant Mobile Pass</span>
              </div>
            </div>
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT: MAIN CONTENT (8 COLS) & STICKY BOOKING PANEL (4 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* ABOUT EVENT SECTION */}
            <div className="p-6 sm:p-8 bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                  About this experience
                </h2>
                <span className="px-3 py-1 bg-surface-container text-primary-container text-xs font-bold rounded-full">
                  {event.category}
                </span>
              </div>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
                {event.description}
              </p>

              {/* Highlights */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low/50 rounded-2xl border border-surface-container">
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Guaranteed Entry</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Direct barcode scanning at official venue gates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low/50 rounded-2xl border border-surface-container">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Paperless Boarding Pass</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      Digital ticket pass saved directly in your OnGo account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* IMPORTANT GUIDELINES SECTION */}
            <div className="p-6 sm:p-8 bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xs space-y-4">
              <h3 className="text-lg font-extrabold text-on-surface">Important Event Guidelines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl">
                  <span className="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">
                    badge
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Identification</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Original student card or government CNIC may be requested at entry turnstiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-surface-container-low rounded-2xl">
                  <span className="material-symbols-outlined text-primary-container text-[20px] shrink-0 mt-0.5">
                    door_open
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface">Door Opening</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Gates open approximately 60 minutes before scheduled kickoff. Early arrival is recommended.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* VENUE & LOCATION SECTION */}
            <div className="p-6 sm:p-8 bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-on-surface">Location &amp; Venue</h3>
                  <p className="text-xs text-on-surface-variant">
                    {event.venueName}, {event.city}, Pakistan
                  </p>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${event.venueName}, ${event.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-container-low hover:bg-surface-container text-primary-container font-bold text-xs rounded-xl transition shadow-xs self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* ORGANIZER PROFILE CARD */}
            <div className="p-6 bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-white flex items-center justify-center font-extrabold text-2xl shadow-xs shrink-0">
                  {event.organizer?.name ? event.organizer.name[0].toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-base text-on-surface">{event.organizer?.name}</h4>
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Host &amp; Event Producer</p>
                  <p className="text-[11px] text-muted mt-0.5">{event.organizer?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY TICKET BOOKING PANEL */}
          <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 border border-surface-container shadow-xl flex flex-col gap-5">
              {/* Header */}
              <div className="flex flex-col gap-1 pb-3 border-b border-surface-container">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-on-surface">Select Tickets</h3>
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                    verified_user
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Instant digital pass delivery • 100% Guaranteed
                </p>
              </div>

              {/* TIER SELECTION */}
              <div className="flex flex-col gap-3">
                {event.ticketTypes.map((ticket) => {
                  const qty = selectedQuantities[ticket._id] || 0;
                  const remaining = Math.max(0, (ticket.capacity || 0) - (ticket.sold || 0));
                  const tierSoldOut = remaining <= 0;

                  return (
                    <div
                      key={ticket._id}
                      className={`p-4 rounded-2xl border transition-all ${
                        qty > 0
                          ? 'border-primary-container bg-primary-fixed/20 shadow-xs'
                          : 'border-surface-container bg-surface-container-low/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-bold text-sm text-on-surface block">
                            {ticket.name}
                          </span>
                          <span className="font-extrabold text-base text-primary-container">
                            {Number(ticket.price) === 0
                              ? 'Free'
                              : `PKR ${Number(ticket.price).toLocaleString()}`}
                          </span>
                        </div>

                        {tierSoldOut ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-error text-white uppercase">
                            Sold Out
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                            {remaining} Left
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-surface-container/60">
                        <span className="text-xs text-muted font-medium">Quantity</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(ticket._id, -1, remaining)}
                            disabled={qty <= 0 || event.bookingStatus !== 'Open'}
                            className="w-7 h-7 rounded-lg border border-surface-container bg-white flex items-center justify-center font-bold text-sm text-on-surface hover:bg-surface-container-low disabled:opacity-30 transition"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-on-surface">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(ticket._id, 1, remaining)}
                            disabled={
                              tierSoldOut ||
                              qty >= remaining ||
                              totalSelectedTickets >= event.maxTicketsPerBooking ||
                              event.bookingStatus !== 'Open'
                            }
                            className="w-7 h-7 rounded-lg border border-surface-container bg-white flex items-center justify-center font-bold text-sm text-on-surface hover:bg-surface-container-low disabled:opacity-30 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary & Booking CTA */}
              <div className="pt-4 border-t border-surface-container space-y-3">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>Selected Passes</span>
                  <span className="font-bold text-on-surface">{totalSelectedTickets}</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="font-bold text-on-surface">Total Amount</span>
                  <span className="font-extrabold text-xl text-primary-container">
                    PKR {totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={
                    totalSelectedTickets === 0 ||
                    event.bookingStatus !== 'Open' ||
                    event.status === 'Draft'
                  }
                  onClick={handleBookingClick}
                  className="w-full py-3.5 rounded-xl bg-primary-container hover:bg-primary disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                  <span>
                    {event.status === 'Draft'
                      ? 'Draft Preview'
                      : event.bookingStatus !== 'Open'
                      ? 'Bookings Closed'
                      : totalSelectedTickets === 0
                      ? 'Select Tickets'
                      : `Proceed to Book (PKR ${totalPrice.toLocaleString()})`}
                  </span>
                </button>

                <p className="text-[11px] text-muted text-center">
                  Instant digital ticket delivery with encrypted checkout.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Events Discovery Section */}
        {similarEvents.length > 0 && (
          <section className="pt-12 border-t border-surface-container space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
                    Similar Events You Might Like
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  More top-rated experiences in <strong className="text-on-surface">{event.category}</strong>
                </p>
              </div>
              <Link
                to={`/explore?category=${encodeURIComponent(event.category)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-container hover:underline transition group"
              >
                <span>Explore all {event.category}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarEvents.map((simEvent) => (
                <EventCard key={simEvent._id} event={simEvent} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Checkout & Reservation Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        event={event}
        selectedQuantities={selectedQuantities}
        totalSelectedTickets={totalSelectedTickets}
        totalPrice={totalPrice}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
