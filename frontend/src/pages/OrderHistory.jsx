import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import { Card, Badge, Icon, Button, EmptyState } from '../components/ui';

const statusConfig = {
  Pending: { variant: 'warning', icon: 'clock' },
  Paid: { variant: 'success', icon: 'check-circle' },
  Shipped: { variant: 'primary', icon: 'truck' },
  Delivered: { variant: 'success', icon: 'package' },
  Cancelled: { variant: 'danger', icon: 'close' },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-32 w-full rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Your activity</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">My orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="package"
            title="No orders yet"
            description="When you place an order, it will appear here with tracking details."
            action={<Button variant="primary" icon="grid" onClick={() => (window.location.href = '/products')}>Start shopping</Button>}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const config = statusConfig[o.status] || statusConfig.Pending;
            const isExpanded = expanded === o._id;
            return (
              <Card key={o._id} hover className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : o._id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                      <Icon name={config.icon} className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Order #{o._id.slice(-8)}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-slate-900 dark:text-white">${o.totalPrice.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Badge variant={config.variant} dot>{o.status}</Badge>
                    <Icon name="chevron-down" className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-slate-100 p-5 dark:border-slate-800 animate-slide-down">
                    <div className="space-y-2">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-slate-700 dark:text-slate-300">{item.name} × {item.quantity}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <Link to={`/orders/${o._id}`}>
                      <Button variant="outline" size="sm" icon="arrow-right" className="mt-4">View details</Button>
                    </Link>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
