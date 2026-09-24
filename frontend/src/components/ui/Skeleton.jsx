export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card overflow-hidden ${className}`}>
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, className = '' }) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Skeleton;