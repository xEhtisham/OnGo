import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TicketPass from '../components/TicketPass';
import CancelBookingModal from '../components/CancelBookingModal';
import { useToast } from '../context/ToastContext';

export default function MyTickets() {
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTicketModal, setActiveTicketModal] = useState(null);
  const [copiedRef, setCopiedRef] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('date-asc');

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
    toast.info('Booking reference copied to clipboard!');
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleConfirmCancel = async (bookingId, reason) => {
    try {
      setIsCancelling(true);
      await api.cancelBooking(bookingId, reason);
      setCancelModalBooking(null);
      toast.success('Reservation cancelled successfully.');
      await fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel reservation');
    } finally {
      setIsCancelling(false);
    }
  };

  // Overview metrics calculations
  const now = new Date();
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const upcomingCount = confirmedBookings.filter(
    (b) => b.event?.date && new Date(b.event.date) >= now
  ).length;
  const pastCount = confirmedBookings.filter(
    (b) => b.event?.date && new Date(b.event.date) < now
  ).length;
  const cancelledCount = bookings.filter((b) => b.status === 'Cancelled').length;

  const totalPasses = confirmedBookings.reduce((sum, b) => sum + (b.totalTickets || 0), 0);
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Filter & sort bookings
  let filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Cancelled') {
      if (b.status !== 'Cancelled') return false;
    } else if (activeTab === 'Upcoming') {
      const eventDate = b.event?.date ? new Date(b.event.date) : null;
      if (b.status !== 'Confirmed' || !eventDate || eventDate < now) return false;
    } else if (activeTab === 'Past') {
      const eventDate = b.event?.date ? new Date(b.event.date) : null;
      if (b.status !== 'Confirmed' || !eventDate || eventDate >= now) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = b.event?.title?.toLowerCase().includes(q);
      const matchRef = b.bookingReference?.toLowerCase().includes(q);
      const matchVenue = b.event?.venueName?.toLowerCase().includes(q);
      const matchCity = b.event?.city?.toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchVenue && !matchCity) return false;
    }

    return true;
  });

  // Sort bookings
  filteredBookings.sort((a, b) => {
    if (sortOrder === 'date-asc') {
      return new Date(a.event?.date || 0) - new Date(b.event?.date || 0);
    }
    if (sortOrder === 'date-desc') {
      return new Date(b.event?.date || 0) - new Date(a.event?.date || 0);
    }
    if (sortOrder === 'amount-desc') {
      return (b.totalAmount || 0) - (a.totalAmount || 0);
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
            <span>Attendee Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">
            My Tickets &amp; Passes
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Access your verified entry passes, digital QR codes, and reservation receipts.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-sm shadow-xs transition-all active:scale-[0.98] self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">explore</span>
          <span>Find More Events</span>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
              Upcoming Events
            </span>
            <span className="text-2xl font-extrabold text-on-surface mt-1 block">
              {upcomingCount}
            </span>
            <span className="text-xs text-on-surface-variant">Active reservations</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
              Passes Reserved
            </span>
            <span className="text-2xl font-extrabold text-on-surface mt-1 block">
              {totalPasses}
            </span>
            <span className="text-xs text-on-surface-variant">Confirmed tickets</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">
              Total Invested
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              PKR {totalSpent.toLocaleString()}
            </span>
            <span className="text-xs text-on-surface-variant">Across verified events</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-surface-container-lowest p-3 sm:p-4 rounded-2xl border border-surface-container shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'Upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'Past', label: 'Past', count: pastCount },
            { id: 'All', label: 'All Passes', count: bookings.length },
            { id: 'Cancelled', label: 'Cancelled', count: cancelledCount },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-primary-container' : 'bg-surface-container text-on-surface'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:max-w-md lg:justify-end">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event or booking ID..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/20 border border-transparent focus:border-primary-container transition"
            />
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-surface-container-low rounded-xl text-xs text-on-surface font-semibold border border-transparent focus:outline-none cursor-pointer"
          >
            <option value="date-asc">Date: Soonest</option>
            <option value="date-desc">Date: Furthest</option>
            <option value="amount-desc">Amount: Highest</option>
          </select>
        </div>
      </div>

      {/* Main Ticket Pass List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-surface-container-low animate-pulse border border-surface-container"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {error}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl border border-surface-container p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-container-low flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[32px]">confirmation_number</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-on-surface">No tickets found</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              {activeTab === 'Upcoming'
                ? "You don't have any upcoming event passes. Explore live experiences now!"
                : 'No reservation history found matching your filters.'}
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold shadow-xs hover:bg-primary transition"
          >
            <span>Explore Events</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => {
            const eventDate = booking.event?.date ? new Date(booking.event.date) : null;
            const formattedDate = eventDate
              ? eventDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'TBA';
            const isCancelled = booking.status === 'Cancelled';

            return (
              <article
                key={booking._id}
                className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Media & Poster Segment */}
                  <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden shrink-0 bg-surface-container">
                    {booking.event?.coverImage ? (
                      <img
                        src={booking.event.coverImage}
                        alt={booking.event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-container" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        {booking.event?.category || 'Event'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      {isCancelled ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-error text-white shadow-xs">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Valid Pass
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content & Metadata Segment */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-primary-container text-xs font-bold">
                          <span className="material-symbols-outlined text-[16px]">event</span>
                          <span>{formattedDate}</span>
                          <span className="text-outline">•</span>
                          <span>{booking.event?.startTime || '7:00 PM'} PKT</span>
                        </div>

                        {/* Booking Ref Pill */}
                        <button
                          type="button"
                          onClick={() => handleCopy(booking.bookingReference)}
                          className="font-mono text-xs font-bold text-on-surface hover:text-primary-container flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-md"
                          title="Click to copy"
                        >
                          <span>{booking.bookingReference}</span>
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedRef === booking.bookingReference ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>

                      <Link to={`/events/${booking.event?._id}`}>
                        <h3 className="text-lg sm:text-xl font-extrabold text-on-surface group-hover:text-primary-container transition-colors line-clamp-1">
                          {booking.event?.title}
                        </h3>
                      </Link>

                      <p className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-primary-container shrink-0">
                          pin_drop
                        </span>
                        <span>
                          {booking.event?.venueName}, {booking.event?.city}
                        </span>
                      </p>

                      {/* Credentials Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-container-low text-xs">
                        <div>
                          <span className="text-[10px] text-outline uppercase font-bold block">
                            Tier &amp; Passes
                          </span>
                          <span className="font-bold text-on-surface truncate block">
                            {booking.tickets?.map((t) => `${t.name} (×${t.quantity})`).join(', ') ||
                              `${booking.totalTickets} ticket(s)`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-outline uppercase font-bold block">
                            Attendee Name
                          </span>
                          <span className="font-bold text-on-surface truncate block">
                            {booking.attendeeDetails?.fullName}
                          </span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-outline uppercase font-bold block">
                            Total PKR
                          </span>
                          <span className="font-extrabold text-on-surface text-emerald-600 block">
                            PKR {booking.totalAmount?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container">
                      <button
                        type="button"
                        onClick={() => setActiveTicketModal(booking)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-xs shadow-xs transition-all active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                        <span>VIEW PASS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTicketModal(booking)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs transition"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Print / PDF</span>
                      </button>

                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(booking)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-error hover:bg-red-50 font-semibold text-xs transition ml-auto"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          <span>Cancel Pass</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Ticket Pass Modal */}
      {activeTicketModal && (
        <TicketPass
          booking={activeTicketModal}
          onClose={() => setActiveTicketModal(null)}
        />
      )}

      {/* Cancel Booking Modal */}
      {cancelModalBooking && (
        <CancelBookingModal
          booking={cancelModalBooking}
          isOpen={!!cancelModalBooking}
          isLoading={isCancelling}
          onClose={() => setCancelModalBooking(null)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
