import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function Pagination({ page, pages, buildLink, className = '' }) {
  if (pages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    let prev;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) rangeWithDots.push(prev + 1);
        else if (i - prev !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const visible = getVisiblePages();
  const linkBase = 'flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-semibold transition no-tap-highlight';

  return (
    <nav className={`flex items-center justify-center gap-1.5 ${className}`} aria-label="Pagination">
      <Link
        to={buildLink(Math.max(1, page - 1))}
        className={`${linkBase} ${page === 1 ? 'pointer-events-none text-slate-300 dark:text-slate-700' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" className="h-4 w-4" />
      </Link>

      {visible.map((item, i) =>
        item === '...' ? (
          <span key={`dots-${i}`} className="px-1 text-slate-400">…</span>
        ) : (
          <Link
            key={item}
            to={buildLink(item)}
            className={`${linkBase} ${
              item === page
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
          >
            {item}
          </Link>
        )
      )}

      <Link
        to={buildLink(Math.min(pages, page + 1))}
        className={`${linkBase} ${page === pages ? 'pointer-events-none text-slate-300 dark:text-slate-700' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}
        aria-label="Next page"
      >
        <Icon name="chevron-right" className="h-4 w-4" />
      </Link>
    </nav>
  );
}