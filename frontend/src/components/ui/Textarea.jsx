import { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    rows = 4,
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
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`input resize-y ${error ? 'input-error' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-danger-600 dark:text-danger-400">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      )}
    </div>
  );
});

export default Textarea;