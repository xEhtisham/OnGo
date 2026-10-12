import { useState } from 'react';
import Button from './Button';

const CANCELLATION_REASONS = [
  'Schedule Conflict / Change of Plans',
  'Booked by Mistake / Duplicate Order',
  'Emergency / Unable to Attend',
  'Travel / Transportation Issue',
  'Other Reason',
];

export default function CancelBookingModal({ booking, isOpen, onClose, onConfirm, loading }) {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = additionalNotes.trim()
      ? `${selectedReason}: ${additionalNotes.trim()}`
      : selectedReason;
    onConfirm(booking._id, finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg font-bold">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-text">Cancel Reservation</h3>
              <p className="text-xs text-muted font-mono">{booking.bookingReference}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-text hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Warning Note */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1.5">
          <p className="font-bold">
            Are you sure you want to cancel your passes for "{booking.event?.title}"?
          </p>
          <p className="text-[11px] text-rose-700 leading-relaxed">
            Your {booking.totalTickets} reserved ticket(s) will be immediately released back into
            public inventory for other attendees. This action cannot be reversed.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
              Reason for Cancellation
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border text-xs text-text bg-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            >
              {CANCELLATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text mb-1.5">
              Additional Feedback (Optional)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Tell us what changed..."
              className="w-full px-3.5 py-2 rounded-xl border border-border text-xs text-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition"
            >
              {loading ? 'Releasing Tickets...' : 'Yes, Cancel Reservation'}
            </button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:flex-1"
              onClick={onClose}
            >
              Keep My Passes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
