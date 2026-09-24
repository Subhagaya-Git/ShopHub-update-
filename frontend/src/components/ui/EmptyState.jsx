import Icon from './Icon';
import Button from './Button';

export default function EmptyState({ icon = 'inbox', title, description, action, actionLabel, actionIcon, onAction, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <Icon name={icon} className="h-8 w-8" />
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
      {actionLabel && !action && (
        <Button variant="primary" icon={actionIcon} onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}