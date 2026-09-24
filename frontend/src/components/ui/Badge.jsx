const variants = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  primary: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300',
  danger: 'bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-300',
  outline: 'border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({ children, variant = 'default', size = 'md', dot = false, className = '' }) {
  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;
  const dotColors = {
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    primary: 'bg-brand-500',
    accent: 'bg-accent-500',
    default: 'bg-slate-400',
    outline: 'bg-slate-400',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${variantClass} ${sizeClass} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />}
      {children}
    </span>
  );
}