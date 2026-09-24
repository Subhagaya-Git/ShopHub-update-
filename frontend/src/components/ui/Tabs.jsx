import { useState } from 'react';

export default function Tabs({ tabs, defaultIndex = 0, onChange, className = '' }) {
  const [active, setActive] = useState(defaultIndex);

  const handleTabClick = (index) => {
    setActive(index);
    onChange?.(index);
  };

  return (
    <div className={className}>
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => handleTabClick(index)}
            className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
              active === index
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {tab.count}
              </span>
            )}
            {active === index && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-600 dark:bg-brand-400" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs[active]?.content}</div>
    </div>
  );
}