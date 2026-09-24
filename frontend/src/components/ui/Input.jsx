import { forwardRef, useId } from 'react';
import Icon from './Icon';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    type = 'text',
    className = '',
    id: propId,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = propId || autoId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <Icon
            name={icon}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={`input ${icon ? 'pl-10' : ''} ${error ? 'input-error' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger-600 dark:text-danger-400">
          <Icon name="alert" className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;