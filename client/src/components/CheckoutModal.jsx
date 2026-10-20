import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  event,
  selectedQuantities,
  totalSelectedTickets,
  totalPrice,
  onBookingSuccess,
}) {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync user info if user logs in or profile changes
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  if (!isOpen) return null;

  // Selected ticket lines
  const selectedLines = event?.ticketTypes
    ?.filter((t) => (selectedQuantities[t._id] || 0) > 0)
    .map((t) => ({
      ticketTypeId: t._id,
      name: t.name,
      price: t.price,
      quantity: selectedQuantities[t._id],
      subtotal: t.price * selectedQuantities[t._id],
    })) || [];

  const handleCopyReference = () => {
    if (confirmedBooking?.bookingReference) {
      navigator.clipboard.writeText(confirmedBooking.bookingReference);
      setCopied(true);
      toast.info('Booking reference copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in to finalize your booking.');
      navigate('/login');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your full legal name and email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        eventId: event._id,
        tickets: selectedLines.map((line) => ({
          ticketTypeId: line.ticketTypeId,
          quantity: line.quantity,
        })),
        attendeeDetails: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
      };

      const res = await api.createBooking(payload);
      if (res?.data?.booking) {
        setConfirmedBooking(res.data.booking);
        toast.success(`Reservation confirmed! Reference: ${res.data.booking.bookingReference}`);
        if (onBookingSuccess) {
          onBookingSuccess(res.data.booking);
        }
      }
    } catch (err) {
      const errMsg = err.message || 'Failed to complete booking. Please try again.';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-surface-container space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div>
            <h2 className="text-xl font-extrabold text-on-surface">
              {confirmedBooking ? 'Reservation Confirmed! 🎉' : 'Checkout & Ticket Review'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {confirmedBooking ? 'Your digital pass is ready' : event?.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-surface-container-low transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* If user is not authenticated, prompt login */}
        {!isAuthenticated && !confirmedBooking ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-fixed text-primary flex items-center justify-center text-2xl shadow-xs">
              🔒
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-on-surface">Sign In Required to Reserve</h3>
              <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                Please log in or register an OnGo account to finalize your booking and access your digital QR gate passes.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" state={{ from: `/events/${event._id}` }}>
                <button
                  type="button"
                  className="w-full py-3 rounded-xl bg-primary-container text-white font-bold text-sm shadow-md hover:bg-primary transition"
                >
                  Log In to Continue
                </button>
              </Link>
              <Link to="/register" state={{ from: `/events/${event._id}` }}>
                <button
                  type="button"
                  className="w-full py-3 rounded-xl border border-surface-container bg-surface-container-lowest text-on-surface font-bold text-sm hover:bg-surface-container-low transition"
                >
                  Create an Account
                </button>
              </Link>
            </div>
          </div>
        ) : confirmedBooking ? (
          /* Confirmation Success View (Matching ongo_booking_confirmation) */
          <div className="space-y-6 py-2">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
              </div>
              <h3 className="text-xl font-extrabold text-on-surface">You&apos;re All Set!</h3>
              <p className="text-xs text-on-surface-variant">
                Your reservation has been confirmed. Confirmation details have been recorded for{' '}
                <strong className="text-on-surface">{confirmedBooking.attendeeDetails?.email}</strong>.
              </p>
            </div>

            {/* Booking Reference Box */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container text-center space-y-2">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                Booking Reference
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-extrabold text-primary-container tracking-wider">
                  {confirmedBooking.bookingReference}
                </span>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-white transition"
                  title="Copy Reference Code"
                >
                  {copied ? (
                    <span className="text-xs text-emerald-600 font-bold">Copied!</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  )}
                </button>
              </div>
            </div>

            {/* Booked Summary Card */}
            <div className="p-4 rounded-2xl bg-surface-container-low/60 border border-surface-container space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Event</span>
                <strong className="text-on-surface line-clamp-1">{event?.title}</strong>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Date &amp; Time</span>
                <strong className="text-on-surface">{formattedDate}</strong>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Venue</span>
                <strong className="text-on-surface">{event?.venueName}, {event?.city}</strong>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Total Tickets</span>
                <strong className="text-on-surface">{confirmedBooking.totalTickets} pass(es)</strong>
              </div>
              <div className="flex justify-between text-on-surface-variant pt-2 border-t border-surface-container">
                <span className="font-bold text-on-surface">Total Amount</span>
                <strong className="text-base font-extrabold text-primary-container">
                  PKR {confirmedBooking.totalAmount?.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                onClick={() => {
                  onClose();
                  navigate('/my-tickets');
                }}
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                <span>VIEW MY DIGITAL PASS</span>
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-surface-container bg-surface-container-lowest text-on-surface font-bold text-sm hover:bg-surface-container-low transition"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Reservation Form (Matching ongo_checkout_booking_review) */
          <form onSubmit={handleSubmitBooking} className="space-y-5">
            {/* 1. Compact Event Banner */}
            <div className="p-3 bg-surface-container-low rounded-2xl border border-surface-container flex items-center gap-3">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-primary-container uppercase tracking-wider block">
                  {event.category}
                </span>
                <h4 className="font-bold text-sm text-on-surface truncate">{event.title}</h4>
                <p className="text-xs text-on-surface-variant truncate">
                  {formattedDate} • {event.venueName}
                </p>
              </div>
            </div>

            {/* 2. Selected Ticket Review */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container space-y-2">
              <div className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Selected Tickets
              </div>
              <div className="space-y-2 divide-y divide-surface-container">
                {selectedLines.map((line) => (
                  <div key={line.ticketTypeId} className="flex justify-between items-center text-xs pt-2 first:pt-0">
                    <div>
                      <span className="font-bold text-on-surface">{line.name}</span>
                      <span className="text-on-surface-variant ml-1.5 font-medium">× {line.quantity}</span>
                      <div className="text-[10px] text-muted">
                        PKR {Number(line.price).toLocaleString()} each
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-on-surface">
                      PKR {line.subtotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Attendee Information Form */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Attendee Contact Information
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Full Legal Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hamza Tariq"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-low/40 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-low/40 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-low/40 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Total & Submit Button */}
            <div className="pt-2 border-t border-surface-container space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="font-bold text-on-surface">Total Amount</span>
                <span className="font-extrabold text-2xl text-primary-container">
                  PKR {totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || totalSelectedTickets === 0}
                className="w-full py-3.5 rounded-xl bg-primary-container hover:bg-primary disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Confirming Reservation...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    <span>Confirm &amp; Reserve Passes</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                <span className="material-symbols-outlined text-[14px] text-emerald-600">lock</span>
                <span>Instant reservation with verified digital entry pass</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
