export default function Toast({ toast, onClose }) {
  const { id, message, type = 'info' } = toast;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-900/90 border-emerald-500/30 text-white',
      badge: 'bg-emerald-500 text-white',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-rose-900/90 border-rose-500/30 text-white',
      badge: 'bg-rose-500 text-white',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-slate-900/90 border-slate-700 text-white',
      badge: 'bg-primary text-white',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 max-w-md w-full ${config.bg}`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${config.badge}`}>
          {config.icon}
        </span>
        <p className="text-xs sm:text-sm font-semibold tracking-wide leading-snug">
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        aria-label="Close notification"
        className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
      >
        ✕
      </button>
    </div>
  );
}
