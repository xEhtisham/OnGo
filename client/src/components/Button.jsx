export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary shadow-sm hover:shadow',
    cta:
      'bg-coral text-white hover:bg-coral-dark focus-visible:ring-coral shadow-sm hover:shadow',
    secondary:
      'bg-white text-text border border-border hover:bg-slate-50 focus-visible:ring-slate-400 shadow-sm',
    outline:
      'border-2 border-primary text-primary hover:bg-primary/5 focus-visible:ring-primary',
    ghost:
      'text-muted hover:text-text hover:bg-slate-100 focus-visible:ring-slate-300',
    danger:
      'bg-error text-white hover:bg-red-600 focus-visible:ring-error shadow-sm',
  };

  const sizes = {
    sm: 'text-sm px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
