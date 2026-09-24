const sizes = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
};

export default function Avatar({ name, src, size = 'md', className = '' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  const sizeClass = sizes[size] || sizes.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white dark:ring-slate-900 ${className}`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-semibold text-white ring-2 ring-white dark:ring-slate-900 ${className}`}
    >
      {initials}
    </span>
  );
}