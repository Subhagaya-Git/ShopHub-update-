import { Link } from 'react-router-dom';
import Icon from './ui/Icon';

export default function Footer() {
  const year = new Date().getFullYear();
  const sections = [
    { title: 'Shop', links: [{ label: 'All Products', to: '/products' }, { label: 'New Arrivals', to: '/products' }, { label: 'Best Sellers', to: '/products' }] },
    { title: 'Account', links: [{ label: 'My Orders', to: '/orders' }, { label: 'Cart', to: '/cart' }, { label: 'Login', to: '/login' }] },
  ];

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-slate-900 dark:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Icon name="shopping-bag" className="h-5 w-5" />
              </span>
              Shop<span className="text-brand-600 dark:text-brand-400">Hub</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Better products, less searching. A curated marketplace built for discovery and fast checkout.
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">{section.title}</h4>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <p>&copy; {year} ShopHub. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Built with React, Express &amp; MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
