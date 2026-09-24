import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../../api/admin';
import { Card, CardBody, Icon, Button, Skeleton } from '../../components/ui';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((res) => setStats(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton mt-2 h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Catalog items', value: stats.totalProducts, icon: 'package', color: 'brand', to: '/admin/products' },
    { label: 'Total orders', value: stats.totalOrders, icon: 'cart', color: 'accent', to: '/admin/orders' },
    { label: 'Total users', value: stats.totalUsers, icon: 'users', color: 'success', to: null },
    { label: 'Total revenue', value: `$${stats.revenue.toFixed(2)}`, icon: 'dollar', color: 'warning', to: null },
  ];

  const colorMap = {
    brand: 'from-brand-500 to-brand-700 shadow-brand-600/25',
    accent: 'from-accent-500 to-accent-700 shadow-accent-600/25',
    success: 'from-success-500 to-success-700 shadow-success-600/25',
    warning: 'from-warning-500 to-warning-700 shadow-warning-600/25',
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Operations overview</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} hover className="p-5">
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colorMap[c.color]} text-white shadow-lg`}>
                <Icon name={c.icon} className="h-5 w-5" />
              </div>
              {c.to && (
                <Link to={c.to} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800" aria-label={`View ${c.label}`}>
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              )}
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{c.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <Icon name="package" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Catalog management</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add, edit, or remove products from your store.</p>
          <Link to="/admin/products"><Button variant="primary" icon="arrow-right" className="mt-4">Manage products</Button></Link>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <Icon name="cart" className="h-5 w-5 text-accent-600 dark:text-accent-400" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Order fulfillment</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">View and update the status of customer orders.</p>
          <Link to="/admin/orders"><Button variant="primary" icon="arrow-right" className="mt-4">Manage orders</Button></Link>
        </Card>
      </div>
    </div>
  );
}
