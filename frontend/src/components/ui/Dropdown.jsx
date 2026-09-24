import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

export default function Dropdown({ trigger, children, align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="no-tap-highlight"
        aria-expanded={open}
      >
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 min-w-[12rem] animate-slide-down rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${className}`}
          onClick={() => setOpen(false)}
        >
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, icon, onClick, danger = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        danger
          ? 'text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
      } ${className}`}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </button>
  );
}