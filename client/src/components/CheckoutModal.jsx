import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from './Button';

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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your full name and email address.');
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
        if (onBookingSuccess) {
          onBookingSuccess(res.data.booking);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-extrabold text-text">
              {confirmedBooking ? 'Reservation Confirmed! 🎉' : 'Checkout & Reservation'}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {confirmedBooking ? 'Your tickets are ready' : event?.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-text hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* If user is not authenticated, prompt login */}
        {!isAuthenticated && !confirmedBooking ? (
          <div className="space-y-5 text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
              🔒
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-text">Account Required to Book</h3>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Please log in or register for an OnGo account to reserve tickets and access your digital passes.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" state={{ from: `/events/${event._id}` }}>
                <Button variant="cta" size="md" className="w-full">
                  Log In to Continue
                </Button>
              </Link>
              <Link to="/register" state={{ from: `/events/${event._id}` }}>
                <Button variant="outline" size="md" className="w-full">
                  Create an Account
                </Button>
              </Link>
            </div>
          </div>
        ) : confirmedBooking ? (
          /* Confirmation Success View */
          <div className="space-y-6 py-2">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text">You're All Set!</h3>
              <p className="text-xs text-muted">
                Your reservation has been confirmed. Confirmation details have been recorded for{' '}
                <strong className="text-text">{confirmedBooking.attendeeDetails.email}</strong>.
              </p>
            </div>

            {/* Booking Reference Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Booking Reference
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-primary tracking-wider">
                  {confirmedBooking.bookingReference}
                </span>
                <button
                  type="button"
                  onClick={handleCopyReference}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-text hover:bg-white transition"
                  title="Copy Reference Code"
                >
                  {copied ? (
                    <span className="text-xs text-emerald-600 font-bold">Copied!</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>

            {/* Booked Summary */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Event</span>
                <strong className="text-text line-clamp-1">{event?.title}</strong>
              </div>
              <div className="flex justify-between text-muted">
                <span>Total Tickets</span>
                <strong className="text-text">{confirmedBooking.totalTickets} pass(es)</strong>
              </div>
              <div className="flex justify-between text-muted pt-2 border-t border-indigo-100">
                <span className="font-bold text-text">Total Amount</span>
                <strong className="text-sm font-extrabold text-primary">
                  PKR {confirmedBooking.totalAmount.toLocaleString()}
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="cta"
                size="md"
                className="w-full"
                onClick={() => {
                  onClose();
                  navigate('/my-tickets');
                }}
              >
                View in "My Tickets"
              </Button>
              <Button variant="outline" size="md" className="w-full" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Checkout Reservation Form */
          <form onSubmit={handleSubmitBooking} className="space-y-5">
            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-border space-y-2.5">
              <div className="text-xs font-bold text-text uppercase tracking-wider">
                Order Summary
              </div>
              <div className="space-y-1.5 divide-y divide-slate-200">
                {selectedLines.map((line) => (
                  <div key={line.ticketTypeId} className="flex justify-between items-center text-xs pt-1.5 first:pt-0">
                    <div>
                      <span className="font-semibold text-text">{line.name}</span>
                      <span className="text-muted ml-1.5">× {line.quantity}</span>
                    </div>
                    <span className="font-bold text-text">PKR {line.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-text">Total ({totalSelectedTickets} tickets)</span>
                <span className="text-primary text-base font-extrabold">
                  PKR {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Attendee Details Inputs */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-text uppercase tracking-wider">
                Attendee Information
              </div>

              <div>
                <label className="block text-xs font-semibold text-text mb-1">
                  Full Name <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ehtisham Ul Hassan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Email Address <span className="text-coral">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  />
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            {/* Confirm CTA */}
            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                variant="cta"
                size="lg"
                disabled={loading || selectedLines.length === 0}
                className="w-full"
              >
                {loading ? 'Processing Reservation...' : `Confirm & Reserve (PKR ${totalPrice.toLocaleString()})`}
              </Button>
              <p className="text-[11px] text-muted text-center">
                Instant digital ticket generation with verified entry code.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
