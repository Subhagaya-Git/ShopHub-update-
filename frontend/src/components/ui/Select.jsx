import { forwardRef, useId } from 'react';
import Icon from './Icon';

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    children,
    className = '',
    id: propId,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = propId || autoId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={`input appearance-none cursor-pointer pr-10 ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          {children}
        </select>
        <Icon
          name="chevron-down"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger-600 dark:text-danger-400">
          <Icon name="alert" className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
});

export default Select;