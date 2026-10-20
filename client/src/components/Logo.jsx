export default function Logo({ className = "h-8 w-auto", showText = true }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className="h-8 w-8 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="14" fill="#4F46E5" />
        <circle cx="23" cy="9" r="4.5" fill="#FF5A36" />
        <path
          d="M11 11L20 16L11 21"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="font-extrabold text-2xl tracking-tight text-on-surface flex items-baseline">
          <span>OnGo</span>
          <span className="text-secondary-container">.</span>
        </span>
      )}
    </div>
  );
}
