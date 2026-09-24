import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api/orders';
import { Card, Badge, Icon, Button } from '../components/ui';

const statusConfig = {
  Pending: { variant: 'warning', icon: 'clock', label: 'Order placed' },
  Paid: { variant: 'success', icon: 'check-circle', label: 'Payment confirmed' },
  Shipped: { variant: 'primary', icon: 'truck', label: 'Shipped' },
  Delivered: { variant: 'success', icon: 'package', label: 'Delivered' },
  Cancelled: { variant: 'danger', icon: 'close', label: 'Cancelled' },
};

const timelineSteps = ['Pending', 'Paid', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="skeleton h-96 w-full rounded-2xl" />;
  }
  if (!order) return <p className="py-12 text-center text-slate-500">Order not found.</p>;

  const config = statusConfig[order.status] || statusConfig.Pending;
  const currentStepIndex = timelineSteps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="animate-fade-in">
      <Link to="/orders" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
        <Icon name="arrow-left" className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Order #{order._id.slice(-8)}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Placed on {new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
        <Badge variant={config.variant} size="lg" dot>{order.status}</Badge>
      </div>

      {!isCancelled && (
        <Card className="mb-6 p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Order tracker</h2>
          <div className="flex items-center">
            {timelineSteps.map((step, i) => {
              const stepConfig = statusConfig[step];
              const isComplete = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                      isComplete ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-400 dark:bg-slate-800'
                    } ${isCurrent ? 'ring-4 ring-brand-100 dark:ring-brand-900/40' : ''}`}>
                      <Icon name={stepConfig.icon} className="h-5 w-5" />
                    </div>
                    <span className={`mt-2 text-xs font-semibold ${isComplete ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{stepConfig.label}</span>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className={`mx-2 h-0.5 flex-1 rounded-full ${i < currentStepIndex ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-2">
          <h2 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-white">Items</h2>
          <div className="space-y-3">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <Icon name="package" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{i.name}</p>
                    <p className="text-xs text-slate-500">${i.price.toFixed(2)} × {i.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Total</span>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">${order.totalPrice.toFixed(2)}</span>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-white">Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Status</span>
              <Badge variant={config.variant} size="sm">{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Payment</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Date</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Icon name="map-pin" className="h-4 w-4 text-slate-400" />
              Shipping address
            </h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
