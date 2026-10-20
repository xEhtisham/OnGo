import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  if (!event) return null;

  // Format date
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Calculate minimum ticket price
  const prices = event.ticketTypes?.map((t) => Number(t.price)) || [];
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const priceDisplay = minPrice === 0 ? 'Free' : `From PKR ${minPrice.toLocaleString()}`;

  // Calculate total remaining capacity
  const totalCapacity = event.ticketTypes?.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0) || 0;
  const totalSold = event.ticketTypes?.reduce((acc, t) => acc + (Number(t.sold) || 0), 0) || 0;
  const remainingTickets = Math.max(0, totalCapacity - totalSold);
  const isSoldOut = event.status === 'Sold Out' || remainingTickets === 0;
  const isSellingFast = !isSoldOut && totalCapacity > 0 && remainingTickets / totalCapacity <= 0.3;

  return (
    <article className="flex flex-col bg-surface-container-lowest rounded-2xl border border-surface-container shadow-xs hover:shadow-xl hover:border-surface-container-highest transition-all duration-300 hover:-translate-y-1 overflow-hidden group h-full">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Category Pill */}
        <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs text-xs font-bold text-primary-container tracking-wider uppercase">
          {event.category}
        </div>

        {/* City Badge / Sold Out Status */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isSoldOut ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-error text-white shadow-xs">
              Sold Out
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow-xs">
              {event.city}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Schedule */}
          <div className="flex items-center gap-1.5 text-primary-container text-xs font-bold tracking-wide uppercase">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span>
              {formattedDate} {event.startTime ? `· ${event.startTime}` : ''}
            </span>
          </div>

          {/* Title */}
          <Link to={`/events/${event._id}`}>
            <h3 className="font-bold text-base text-on-surface group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Venue & City */}
          <p className="text-xs text-on-surface-variant flex items-center gap-1 line-clamp-1">
            <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
              pin_drop
            </span>
            <span>
              {event.venueName}, {event.city}
            </span>
          </p>

          {/* Scarcity indicator */}
          <div className="pt-1">
            {isSoldOut ? (
              <span className="inline-flex items-center gap-1 text-error text-xs font-bold">
                <span>✕</span> Bookings Closed
              </span>
            ) : isSellingFast ? (
              <span className="inline-flex items-center gap-1 text-secondary-container text-xs font-bold">
                <span>🔥</span> Selling Fast ({remainingTickets} left)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-tertiary-container text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available Now
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Price & Book CTA */}
        <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-muted block uppercase font-bold tracking-wider">
              Admission
            </span>
            <span className="font-extrabold text-sm sm:text-base text-on-surface">
              {priceDisplay}
            </span>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
          >
            <span>{isSoldOut ? 'View Event' : 'Book Pass'}</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
