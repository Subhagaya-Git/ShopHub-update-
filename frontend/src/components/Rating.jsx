import { useState } from 'react';
import Icon from './ui/Icon';

export default function Rating({ value = 0, text, size = 'sm', interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  const sizeClass = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-6 w-6' }[size] || 'h-3.5 w-3.5';
  const display = hover || value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={interactive ? () => onChange?.(n) : undefined}
          onMouseEnter={interactive ? () => setHover(n) : undefined}
          onMouseLeave={interactive ? () => setHover(0) : undefined}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform ${interactive ? 'hover:scale-110' : ''}`}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Icon
            name="star"
            className={`${sizeClass} ${n <= Math.round(display) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
          />
        </button>
      ))}
      {text && <span className="ml-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">{text}</span>}
    </div>
  );
}
