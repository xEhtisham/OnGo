import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import { Card } from '../components/Card';
import TicketPass from '../components/TicketPass';
import CancelBookingModal from '../components/CancelBookingModal';

export default function MyTickets() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTicketModal, setActiveTicketModal] = useState(null);
  const [copiedRef, setCopiedRef] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getMyBookings();
      setBookings(response?.data?.bookings || []);
    } catch (err) {
      setError(err.message || 'Failed to load your ticket reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCopy = (ref) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleConfirmCancel = async (bookingId, reason) => {
    try {
      setIsCancelling(true);
      await api.cancelBooking(bookingId, reason);
      setCancelModalBooking(null);
      await fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel reservation');
    } finally {
      setIsCancelling(false);
    }
  };

  // Filter bookings according to active tab
  const now = new Date();
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Cancelled') return b.status === 'Cancelled';
    const eventDate = b.event?.date ? new Date(b.event.date) : null;
    if (activeTab === 'Upcoming') {
      return b.status === 'Confirmed' && eventDate && eventDate >= now;
    }
    if (activeTab === 'Past') {
      return b.status === 'Confirmed' && eventDate && eventDate < now;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            Attendee Hub
          </div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">My Tickets & Bookings</h1>
          <p className="text-sm text-muted mt-1">
            Access your reserved digital tickets, booking references, and event details.
          </p>
        </div>

        <Link to="/explore">
          <Button variant="outline" size="sm">
            Explore More Events
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
        {['All', 'Upcoming', 'Past', 'Cancelled'].map((tab) => {
          const isActive = activeTab === tab;
          let count = bookings.length;
          if (tab === 'Upcoming') {
            count = bookings.filter(
              (b) => b.status === 'Confirmed' && b.event?.date && new Date(b.event.date) >= now
            ).length;
          } else if (tab === 'Past') {
            count = bookings.filter(
              (b) => b.status === 'Confirmed' && b.event?.date && new Date(b.event.date) < now
            ).length;
          } else if (tab === 'Cancelled') {
            count = bookings.filter((b) => b.status === 'Cancelled').length;
          }

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-muted hover:text-text hover:bg-slate-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-text'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-6 space-y-4 animate-pulse"
            >
              <div className="h-6 bg-slate-200 rounded w-1/4" />
              <div className="h-16 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-border p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl">
            🎟️
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text">No tickets found</h3>
            <p className="text-xs sm:text-sm text-muted">
              {activeTab === 'All'
                ? "You haven't reserved tickets for any events yet. Discover experiences across Pakistan and reserve your spot!"
                : `You don't have any ${activeTab.toLowerCase()} ticket bookings.`}
            </p>
          </div>
          <Link to="/explore">
            <Button variant="cta" size="md">
              Discover Live Events
            </Button>
          </Link>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-5">
          {filteredBookings.map((b) => {
            const isConfirmed = b.status === 'Confirmed';
            const eventDate = b.event?.date ? new Date(b.event.date) : null;
            const isUpcoming = isConfirmed && eventDate && eventDate >= now;

            return (
              <Card
                key={b._id}
                className="overflow-hidden border border-border hover:border-slate-300 transition-all p-0"
              >
                {/* Booking Header Banner */}
                <div className="bg-slate-50/80 px-6 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-muted uppercase tracking-wider text-[11px]">
                      Reference:
                    </span>
                    <span className="font-mono font-extrabold text-sm text-primary">
                      {b.bookingReference}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(b.bookingReference)}
                      className="p-1 text-slate-400 hover:text-text transition"
                      title="Copy Reference"
                    >
                      {copiedRef === b.bookingReference ? (
                        <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted text-[11px]">
                      Booked on{' '}
                      {new Date(b.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* Booking Content Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Event Thumbnail & Details */}
                  <div className="md:col-span-7 flex items-start gap-4">
                    {b.event?.coverImage ? (
                      <img
                        src={b.event.coverImage}
                        alt={b.event.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover flex-shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
                        🎟️
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary">
                        {b.event?.category || 'Event'}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-text truncate">
                        {b.event?.title || 'Unknown Event'}
                      </h3>
                      <p className="text-xs text-muted flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {eventDate
                            ? eventDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Date TBA'}{' '}
                          • {b.event?.startTime || ''}
                        </span>
                      </p>
                      <p className="text-xs text-muted flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span className="truncate">
                          {b.event?.venueName}, {b.event?.city}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Ticket Items & Total */}
                  <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 space-y-2">
                    <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                      Tickets Reserved
                    </span>
                    <div className="space-y-1">
                      {b.tickets.map((t, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-text font-medium">
                            {t.name} <strong className="text-muted">× {t.quantity}</strong>
                          </span>
                          <span className="font-semibold text-text">
                            PKR {(t.subtotal || t.price * t.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs font-bold">
                      <span className="text-muted">Total Paid</span>
                      <span className="text-primary font-extrabold text-sm">
                        PKR {b.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="md:col-span-2 flex flex-col gap-2 pt-2 md:pt-0">
                    <Button
                      variant="cta"
                      size="sm"
                      className="w-full"
                      onClick={() => setActiveTicketModal(b)}
                    >
                      View Pass
                    </Button>

                    {b.event?._id && (
                      <Link to={`/events/${b.event._id}`}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Event Page
                        </Button>
                      </Link>
                    )}

                    {isUpcoming && (
                      <button
                        type="button"
                        onClick={() => setCancelModalBooking(b)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold hover:underline text-center pt-1"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Digital Ticket Pass Modal */}
      {activeTicketModal && (
        <TicketPass
          booking={activeTicketModal}
          onClose={() => setActiveTicketModal(null)}
        />
      )}

      {/* Structured Cancellation Modal */}
      {cancelModalBooking && (
        <CancelBookingModal
          booking={cancelModalBooking}
          isOpen={!!cancelModalBooking}
          onClose={() => setCancelModalBooking(null)}
          onConfirm={handleConfirmCancel}
          loading={isCancelling}
        />
      )}
    </div>
  );
}
