import { createContext, useContext, useState } from 'react';
import Icon from '../components/ui/Icon';

const ToastContext = createContext(null);

const tones = {
  success: {
    container: 'border-success-200 bg-success-50/95 text-success-800 dark:border-success-800/50 dark:bg-success-950/80 dark:text-success-300',
    icon: 'check-circle',
    iconBg: 'bg-success-500 text-white',
  },
  error: {
    container: 'border-danger-200 bg-danger-50/95 text-danger-800 dark:border-danger-800/50 dark:bg-danger-950/80 dark:text-danger-300',
    icon: 'alert',
    iconBg: 'bg-danger-500 text-white',
  },
  warning: {
    container: 'border-warning-200 bg-warning-50/95 text-warning-800 dark:border-warning-800/50 dark:bg-warning-950/80 dark:text-warning-300',
    icon: 'alert',
    iconBg: 'bg-warning-500 text-white',
  },
  info: {
    container: 'border-brand-200 bg-brand-50/95 text-brand-800 dark:border-brand-800/50 dark:bg-brand-950/80 dark:text-brand-300',
    icon: 'info',
    iconBg: 'bg-brand-500 text-white',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = (message, tone = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3000);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[90] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2.5" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => {
          const toneConfig = tones[toast.tone] || tones.success;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur-xl animate-slide-up ${toneConfig.container}`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${toneConfig.iconBg}`}>
                <Icon name={toneConfig.icon} className="h-4 w-4" />
              </span>
              <span className="flex-1">{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
