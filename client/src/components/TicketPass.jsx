import { useState } from 'react';
import Button from './Button';

export default function TicketPass({ booking, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const eventDate = booking.event?.date ? new Date(booking.event.date) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-border overflow-hidden print:shadow-none print:border-none print:max-w-none">
        {/* Actions bar (hidden in print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
              O
            </span>
            <span className="font-extrabold text-sm tracking-tight">OnGo Digital Pass</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Ticket Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-1">
                Verified Admission Pass
              </span>
              <h2 className="text-xl font-extrabold text-text leading-tight">
                {booking.event?.title || 'Live Event Pass'}
              </h2>
              <p className="text-xs text-muted mt-1">
                {booking.event?.category} • {booking.event?.venueName}, {booking.event?.city}
              </p>
            </div>

            {booking.event?.coverImage && (
              <img
                src={booking.event.coverImage}
                alt="Event Poster"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
              />
            )}
          </div>

          {/* Key Schedule Information */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-muted uppercase block">Date</span>
              <strong className="text-text font-bold">{formattedDate}</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted uppercase block">Time</span>
              <strong className="text-text font-bold">
                {booking.event?.startTime || 'TBA'} - {booking.event?.endTime || 'End'}
              </strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-muted uppercase block">Passes</span>
              <strong className="text-text font-bold">{booking.totalTickets} ticket(s)</strong>
            </div>
          </div>

          {/* Attendee Info & Tiers */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
              <span className="text-muted">Attendee Name:</span>
              <strong className="text-text">{booking.attendeeDetails?.fullName}</strong>
            </div>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
              <span className="text-muted">Email Contact:</span>
              <strong className="text-text">{booking.attendeeDetails?.email}</strong>
            </div>

            {/* Ticket Breakdown */}
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 space-y-2">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
                Reserved Tiers
              </span>
              <div className="space-y-1.5 divide-y divide-indigo-100/60">
                {booking.tickets?.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pt-1.5 first:pt-0">
                    <span className="font-semibold text-text">
                      {t.name} <strong className="text-muted">× {t.quantity}</strong>
                    </span>
                    <span className="font-bold text-text">
                      PKR {(t.subtotal || t.price * t.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-indigo-200 flex justify-between items-center text-xs font-bold">
                <span className="text-text">Total Paid</span>
                <span className="text-sm font-extrabold text-primary">
                  PKR {booking.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode & Booking Reference */}
          <div className="text-center pt-2 space-y-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
              Admission Entry Reference
            </span>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 font-mono text-lg font-extrabold text-primary tracking-widest">
              <span>{booking.bookingReference}</span>
              <button
                type="button"
                onClick={handleCopyRef}
                className="text-xs font-sans text-muted hover:text-text print:hidden"
                title="Copy Reference"
              >
                {copied ? '✓ Copied' : '📋'}
              </button>
            </div>

            {/* Barcode representation simulation */}
            <div className="flex justify-center items-center gap-[2px] h-10 py-1 overflow-hidden opacity-70">
              {[...Array(42)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full ${
                    i % 3 === 0
                      ? 'w-[3px] bg-slate-900'
                      : i % 2 === 0
                      ? 'w-[1.5px] bg-slate-700'
                      : 'w-[1px] bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-muted">
              Present this digital pass or physical printout at the entrance for verification.
            </p>
          </div>

          {/* Footer (hidden in print) */}
          <div className="pt-2 border-t border-border flex gap-3 print:hidden">
            <Button variant="cta" size="md" className="w-full" onClick={handlePrint}>
              Print Pass / Save PDF
            </Button>
            <Button variant="outline" size="md" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
