import Icon from './Icon';

export default function Spinner({ size = 'md', label = 'Loading' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  return (
    <div className="flex items-center justify-center py-12" role="status" aria-label={label}>
      <Icon name="refresh" className={`${sizes[size]} animate-spin text-brand-500`} />
    </div>
  );
}