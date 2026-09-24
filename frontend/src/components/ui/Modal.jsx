import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import Button from './Button';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, onClose, title, children, footer, size = 'md', closeOnBackdrop = true }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full ${sizes[size]} animate-scale-in rounded-t-3xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl max-h-[92vh] flex flex-col`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close dialog">
              <Icon name="close" className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="overflow-y-auto scrollbar-thin px-5 py-4 flex-1">{children}</div>
        {footer && (
          <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}