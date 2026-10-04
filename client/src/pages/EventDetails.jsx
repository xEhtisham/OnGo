import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/Button';
import { Card, CardTitle, CardDescription } from '../components/Card';
import CheckoutModal from '../components/CheckoutModal';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Selected quantities for each ticket type: { [ticketId]: quantity }
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError('');
        const response = await api.getEventById(id);
        if (response?.data?.event) {
          setEvent(response.data.event);

          // Initialize selected quantities
          const initial = {};
          response.data.event.ticketTypes?.forEach((t) => {
            initial[t._id] = 0;
          });
          setSelectedQuantities(initial);
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
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Card className="border-border">
          <div className="w-16 h-16 rounded-full bg-red-50 text-error flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <CardTitle className="text-xl">Event Not Found</CardTitle>
          <CardDescription className="mt-1 mb-6">
            {error || 'The event you are looking for does not exist or has been removed.'}
          </CardDescription>
          <Link to="/">
            <Button variant="primary" size="md">
              Back to Home
            </Button>
          </Link>
        </Card>
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

    // Check individual remaining availability
    if (nextQty > remainingCapacity) return;

    // Check max tickets per booking constraint across all ticket types
    const projectedTotal = totalSelectedTickets + delta;
    if (projectedTotal > event.maxTicketsPerBooking) return;

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
      // Reload event to update remaining ticket capacities
      const response = await api.getEventById(id);
      if (response?.data?.event) {
        setEvent(response.data.event);
        // Reset selected quantities
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Organizer Shortcut Banner */}
      {isOrganizer && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
              ★
            </span>
            <div>
              <p className="text-sm font-bold text-text">You are the organizer of this event</p>
              <p className="text-xs text-muted">
                Status: <strong className="text-text">{event.status}</strong> • Total Capacity:{' '}
                <strong className="text-text">{event.totalCapacity}</strong>
              </p>
            </div>
          </div>

          <Link to={`/organizer/events/${event._id}/edit`}>
            <Button variant="outline" size="sm">
              Edit Event Details
            </Button>
          </Link>
        </div>
      )}

      {/* Hero Cover Image Banner */}
      <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-border">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-text shadow-sm">
            {event.category}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
              event.status === 'Published'
                ? 'bg-emerald-500 text-white'
                : event.status === 'Draft'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-700 text-white'
            }`}
          >
            {event.status}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white max-w-4xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-sm">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Event Details & Description */}
        <div className="lg:col-span-7 space-y-8">
          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="flex items-start gap-3 p-4 border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-lg">
                📅
              </div>
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Date & Time</span>
                <p className="text-sm font-bold text-text mt-0.5">{eventDateFormatted}</p>
                <p className="text-xs text-muted">
                  {event.startTime} - {event.endTime}
                </p>
              </div>
            </Card>

            <Card className="flex items-start gap-3 p-4 border-border">
              <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center flex-shrink-0 text-lg">
                📍
              </div>
              <div>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Venue Location</span>
                <p className="text-sm font-bold text-text mt-0.5">{event.venueName}</p>
                <p className="text-xs text-muted truncate">
                  {event.streetAddress}, {event.city}
                </p>
              </div>
            </Card>
          </div>

          {/* Description Section */}
          <Card className="border-border space-y-4">
            <CardTitle className="text-xl">About This Event</CardTitle>
            <div className="prose text-sm text-text leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </Card>

          {/* Organizer Card */}
          <Card className="border-border">
            <CardTitle className="text-lg">Event Organizer</CardTitle>
            <div className="mt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {event.organizer?.name ? event.organizer.name[0].toUpperCase() : 'O'}
              </div>
              <div>
                <p className="font-bold text-text text-base">{event.organizer?.name || 'OnGo Organizer'}</p>
                <p className="text-xs text-muted">{event.organizer?.email}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Interactive Ticket Selection Widget */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <Card className="border-border shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <CardTitle className="text-xl">Select Tickets</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Max {event.maxTicketsPerBooking} tickets per order
                </CardDescription>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  event.bookingStatus === 'Open'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {event.bookingStatus === 'Open' ? 'Bookings Open' : 'Bookings Closed'}
              </span>
            </div>

            {/* Ticket Types List */}
            <div className="divide-y divide-border py-2">
              {event.ticketTypes.map((ticket) => {
                const remaining = Math.max(0, ticket.capacity - (ticket.sold || 0));
                const isSoldOut = remaining === 0;
                const qty = selectedQuantities[ticket._id] || 0;

                return (
                  <div key={ticket._id} className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-text text-base">{ticket.name}</h4>
                        <p className="text-xs text-muted mt-0.5">
                          {isSoldOut ? (
                            <span className="text-error font-bold">Sold Out</span>
                          ) : (
                            <span>{remaining} tickets available</span>
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-primary">
                          PKR {Number(ticket.price).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector Counter */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(ticket._id, -1, remaining)}
                        disabled={qty <= 0 || event.bookingStatus !== 'Open'}
                        className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center font-bold text-text hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-text">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(ticket._id, 1, remaining)}
                        disabled={
                          isSoldOut ||
                          qty >= remaining ||
                          totalSelectedTickets >= event.maxTicketsPerBooking ||
                          event.bookingStatus !== 'Open'
                        }
                        className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center font-bold text-text hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & Booking CTA */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Selected Tickets</span>
                <span className="font-bold text-text">{totalSelectedTickets}</span>
              </div>
              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-text">Total Amount</span>
                <span className="font-extrabold text-xl text-primary">
                  PKR {totalPrice.toLocaleString()}
                </span>
              </div>

              <Button
                variant="cta"
                size="lg"
                disabled={
                  totalSelectedTickets === 0 ||
                  event.bookingStatus !== 'Open' ||
                  event.status === 'Draft'
                }
                onClick={handleBookingClick}
                className="w-full"
              >
                {event.status === 'Draft'
                  ? 'Draft Preview Only'
                  : event.bookingStatus !== 'Open'
                  ? 'Bookings Closed'
                  : totalSelectedTickets === 0
                  ? 'Select Tickets'
                  : `Proceed to Book (PKR ${totalPrice.toLocaleString()})`}
              </Button>

              <p className="text-[11px] text-muted text-center">
                Instant digital ticket generation with verified entry.
              </p>
            </div>
          </Card>
        </div>
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
