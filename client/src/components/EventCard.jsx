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

  // Category badge styles
  const categoryColors = {
    Music: 'bg-rose-50 text-rose-700 border-rose-200',
    Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Food & Drink': 'bg-amber-50 text-amber-700 border-amber-200',
    'Arts & Culture': 'bg-purple-50 text-purple-700 border-purple-200',
    Business: 'bg-blue-50 text-blue-700 border-blue-200',
    Education: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Technology: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Other: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const badgeClass =
    categoryColors[event.category] || 'bg-primary/10 text-primary border-primary/20';

  return (
    <Link
      to={`/events/${event._id}`}
      className="group flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.coverImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Floating Category Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${badgeClass}`}
          >
            {event.category}
          </span>
        </div>

        {/* Sold Out / City Indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isSoldOut ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm">
              Sold Out
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
              {event.city}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-wide uppercase">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {formattedDate} • {event.startTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors line-clamp-1 leading-snug">
            {event.title}
          </h3>

          {/* Venue Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">
              {event.venueName}, {event.city}
            </span>
          </div>
        </div>

        {/* Footer: Price & Availability */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-muted uppercase font-medium">Price</span>
            <span className="text-sm font-extrabold text-text">{priceDisplay}</span>
          </div>

          <div className="text-right">
            {isSoldOut ? (
              <span className="text-xs font-semibold text-rose-600">No seats left</span>
            ) : remainingTickets < 20 ? (
              <span className="text-xs font-semibold text-amber-600">
                Only {remainingTickets} left!
              </span>
            ) : (
              <span className="text-xs font-medium text-emerald-600">Available</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
