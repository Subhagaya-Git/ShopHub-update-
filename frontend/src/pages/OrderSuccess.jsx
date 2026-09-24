import { useLocation, Link } from 'react-router-dom';
import { Button, Card, Badge, Icon } from '../components/ui';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30 animate-scale-in">
        <Icon name="check-circle" className="h-10 w-10 text-success-600 dark:text-success-400" />
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Order placed successfully!</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Thank you for your purchase. A confirmation has been sent to your email.</p>

      {order && (
        <Card className="mt-8 max-w-md p-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order ID</p>
              <p className="mt-0.5 font-mono text-sm text-slate-700 dark:text-slate-300">{order._id}</p>
            </div>
            <Badge variant="success" dot>{order.status}</Badge>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Total amount</span>
            <span className="font-display text-xl font-bold text-slate-900 dark:text-white">${order.totalPrice.toFixed(2)}</span>
          </div>
        </Card>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/orders"><Button variant="primary" icon="package">View orders</Button></Link>
        <Link to="/products"><Button variant="outline" icon="grid">Continue shopping</Button></Link>
      </div>
    </div>
  );
}
