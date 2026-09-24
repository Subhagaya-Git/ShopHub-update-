import Icon from './Icon';

export function Card({ children, className = '', hover = false, as: Component = 'div', ...props }) {
  return (
    <Component className={`card ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '', divider = true }) {
  return (
    <div className={`px-5 py-4 ${divider ? 'border-b border-slate-100 dark:border-slate-800' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '', divider = true }) {
  return (
    <div className={`px-5 py-4 ${divider ? 'border-t border-slate-100 dark:border-slate-800' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, icon, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon && <Icon name={icon} className="h-5 w-5 text-slate-500 dark:text-slate-400" />}
      <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">{children}</h3>
    </div>
  );
}

export default Card;