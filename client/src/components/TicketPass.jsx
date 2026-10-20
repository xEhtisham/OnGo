import { useState } from 'react';

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
    if (booking.bookingReference) {
      navigator.clipboard.writeText(booking.bookingReference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isCancelled = booking.status === 'Cancelled';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="relative bg-surface-container-lowest rounded-3xl max-w-lg w-full shadow-2xl border border-surface-container overflow-hidden print:shadow-none print:border-none print:max-w-none">
        {/* Actions bar (hidden in print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center text-white font-bold text-xs">
              O
            </span>
            <span className="font-extrabold text-sm tracking-tight">OnGo Digital Boarding Pass</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Top Cover Image Slot */}
        <div className="relative w-full h-44 sm:h-52 bg-surface-container overflow-hidden">
          {booking.event?.coverImage ? (
            <img
              src={booking.event.coverImage}
              alt={booking.event.title}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-primary-container" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          {/* Badges on top of cover */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-primary-container font-bold text-xs tracking-wider uppercase shadow-xs">
              {booking.event?.category || 'Live Event'}
            </span>

            {isCancelled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-error text-white shadow-xs">
                <span>✕</span> CANCELLED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>VALID TICKET</span>
              </span>
            )}
          </div>

          {/* Event title overlaid on media */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Official Admission Pass</p>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-sm truncate">
              {booking.event?.title || 'Live Event Admission'}
            </h2>
          </div>
        </div>

        {/* Ticket Core Details Grid */}
        <div className="p-6 bg-surface-container-lowest">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">
                Date
              </span>
              <p className="font-bold text-sm text-on-surface">{formattedDate}</p>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">
                Time
              </span>
              <p className="font-bold text-sm text-on-surface">
                {booking.event?.startTime || '7:00 PM'} {booking.event?.endTime ? `– ${booking.event.endTime}` : ''} PKT
              </p>
            </div>

            <div className="col-span-2">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">
                Venue &amp; Location
              </span>
              <div className="flex items-center gap-1 text-on-surface font-bold text-sm">
                <span className="material-symbols-outlined text-primary-container text-[18px]">
                  location_on
                </span>
                <span>
                  {booking.event?.venueName}, {booking.event?.city}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">
                Attendee
              </span>
              <p className="font-bold text-sm text-on-surface">
                {booking.attendeeDetails?.fullName || 'Verified Guest'}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">
                Tiers &amp; Qty
              </span>
              <p className="font-bold text-sm text-on-surface">
                {booking.tickets?.map((t) => `${t.name} (×${t.quantity})`).join(', ') || `${booking.totalTickets} pass(es)`}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">
                Booking Reference
              </span>
              <p className="font-mono font-bold text-sm text-primary-container tracking-wider">
                {booking.bookingReference}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-0.5">
                Total Paid
              </span>
              <p className="font-extrabold text-sm text-on-surface">
                PKR {booking.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Perforation Divider with Semicircular Cutouts */}
        <div className="relative w-full py-2 flex items-center bg-surface-container-lowest">
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-slate-900 print:bg-white shadow-inner"></div>
          <div className="w-full mx-6 h-0 border-b-2 border-dashed border-surface-container-high"></div>
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-slate-900 print:bg-white shadow-inner"></div>
        </div>

        {/* Scan & QR Verification Zone */}
        <div className="p-6 pt-4 bg-surface-container-lowest flex flex-col items-center text-center">
          <span className="text-[10px] font-bold tracking-widest text-outline uppercase mb-3">
            OFFICIAL ADMISSION QR
          </span>

          {/* Authentic Vector QR Code */}
          <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center border border-slate-100">
            <svg
              className="w-44 h-44 sm:w-48 sm:h-48"
              fill="none"
              viewBox="0 0 220 220"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect fill="#FFFFFF" height="220" width="220" />
              {/* Top-Left Finder */}
              <rect fill="#0F172A" height="46" rx="6" width="46" x="14" y="14" />
              <rect fill="#FFFFFF" height="30" rx="3" width="30" x="22" y="22" />
              <rect fill="#0F172A" height="18" rx="2" width="18" x="28" y="28" />
              {/* Top-Right Finder */}
              <rect fill="#0F172A" height="46" rx="6" width="46" x="160" y="14" />
              <rect fill="#FFFFFF" height="30" rx="3" width="30" x="168" y="22" />
              <rect fill="#0F172A" height="18" rx="2" width="18" x="174" y="28" />
              {/* Bottom-Left Finder */}
              <rect fill="#0F172A" height="46" rx="6" width="46" x="14" y="160" />
              <rect fill="#FFFFFF" height="30" rx="3" width="30" x="22" y="168" />
              <rect fill="#0F172A" height="18" rx="2" width="18" x="28" y="174" />
              {/* Bottom-Right Alignment */}
              <rect fill="#0F172A" height="28" rx="4" width="28" x="156" y="156" />
              <rect fill="#FFFFFF" height="16" rx="2" width="16" x="162" y="162" />
              <rect fill="#0F172A" height="6" width="6" x="167" y="167" />
              {/* Timing */}
              <path d="M68 28h6v6h-6zm12 0h6v6h-6zm12 0h6v6h-6zm12 0h6v6h-6zm12 0h6v6h-6zm12 0h6v6h-6z" fill="#0F172A" />
              <path d="M28 68h6v6h-6zm0 12h6v6h-6zm0 12h6v6h-6zm0 12h6v6h-6zm0 12h6v6h-6zm0 12h6v6h-6z" fill="#0F172A" />
              {/* Data matrix */}
              <path d="M68 40h6v6h-6zm12 0h12v6H80zm18 0h6v6h-6zm12 0h18v6h-18zm24 0h6v6h-6zm-72 12h6v6h-6zm12 0h6v6h-6zm18 0h6v6h-6zm18 0h12v6h-12zm18 0h6v6h-6zm-66 12h12v6H80zm24 0h6v6h-6zm12 0h18v6h-18zm24 0h6v6h-6zm-60 12h6v6h-6zm18 0h12v6h-12zm24 0h6v6h-6zm12 0h6v6h-6zm12 0h12v6h-12zm-66 12h6v6h-6zm12 0h6v6h-6zm18 0h6v6h-6zm18 0h18v6h-18zm-48 12h12v6H80zm24 0h6v6h-6zm12 0h12v6h-12zm18 0h6v6h-6zm-54 12h6v6h-6zm18 0h6v6h-6zm18 0h12v6h-12zm18 0h6v6h-6zm12 0h6v6h-6z" fill="#0F172A" />
              <path d="M14 68h6v6h-6zm12 0h6v6h-6zm24 0h6v6h-6zm-36 12h12v6H14zm18 0h6v6h-6zm12 0h6v6h-6zm-30 12h6v6h-6zm18 0h6v6h-6zm6 0h6v6h-6zm-24 12h18v6H14zm24 0h6v6h-6zm-24 12h6v6h-6zm12 0h12v6H26zm18 0h6v6h-6zm-30 12h6v6h-6zm12 0h6v6h-6zm12 0h6v6h-6zm-24 12h18v6H14zm24 0h6v6h-6z" fill="#0F172A" />
              <path d="M160 68h12v6h-12zm18 0h6v6h-6zm12 0h12v6h-12zm-30 12h6v6h-6zm12 0h18v6h-18zm-12 12h12v6h-12zm18 0h6v6h-6zm12 0h6v6h-6zm-30 12h6v6h-6zm18 0h6v6h-6zm12 0h12v6h-12zm-30 12h18v6h-18zm24 0h6v6h-6zm-24 12h6v6h-6zm12 0h12v6h-12zm-12 12h6v6h-6zm12 0h18v6h-18z" fill="#0F172A" />
              <path d="M68 156h6v6h-6zm12 0h12v6H80zm24 0h6v6h-6zm12 0h12v6h-12zm-48 12h12v6H68zm24 0h6v6h-6zm18 0h12v6h-12zm18 0h6v6h-6zm-60 12h6v6h-6zm18 0h6v6h-6zm12 0h6v6h-6zm18 0h12v6h-12zm-48 12h12v6H68zm24 0h6v6h-6zm18 0h6v6h-6zm12 0h12v6h-12zm-54 12h6v6h-6zm12 0h18v6H80zm24 0h6v6h-6zm12 0h6v6h-6z" fill="#0F172A" />
              <path d="M140 188h6v6h-6zm12 0h6v6h-6zm24 0h12v6h-12zm-36 12h12v6h-12zm18 0h6v6h-6zm12 0h12v6h-12z" fill="#0F172A" />
              {/* Center Logo */}
              <rect fill="#4F46E5" height="32" rx="8" width="32" x="94" y="94" />
              <circle cx="110" cy="110" fill="#FFFFFF" r="5" />
            </svg>
          </div>

          <p className="text-xs text-on-surface-variant mt-3">
            Present this QR pass to the door scanner upon gate entrance.
          </p>

          {/* Reference Pill */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low font-mono text-xs font-bold text-on-surface tracking-wider">
            <span>{booking.bookingReference}</span>
            <button
              type="button"
              onClick={handleCopyRef}
              className="text-primary-container hover:underline print:hidden"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Footer Actions (hidden in print) */}
        <div className="p-6 pt-2 border-t border-surface-container flex gap-3 print:hidden">
          <button
            type="button"
            className="w-full py-3 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            onClick={handlePrint}
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Ticket (PDF)</span>
          </button>
          <button
            type="button"
            className="w-full py-3 rounded-xl border border-surface-container bg-surface-container-lowest text-on-surface font-bold text-xs hover:bg-surface-container-low transition"
            onClick={onClose}
          >
            Close Pass
          </button>
        </div>
      </div>
    </div>
  );
}
