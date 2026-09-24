import { useEffect, useState } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Card, Badge, Icon, Select, Skeleton, EmptyState } from '../../components/ui';

const STATUSES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

const statusConfig = {
  Pending: { variant: 'warning', icon: 'clock' },
  Paid: { variant: 'success', icon: 'check-circle' },
  Shipped: { variant: 'primary', icon: 'truck' },
  Delivered: { variant: 'success', icon: 'package' },
  Cancelled: { variant: 'danger', icon: 'close' },
};

export default function AdminOrders() {
  const { push } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const load = () => {
    setLoading(true);
    getAdminOrders({ limit: 50 }).then((res) => setOrders(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const change = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      push(`Order status updated to ${status}`);
      load();
    } catch (err) {
      push(err.message || 'Unable to update status', 'error');
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filteredOrders = orders
    .filter((o) => !statusFilter || o.status === statusFilter)
    .filter((o) => !search || o._id.toLowerCase().includes(search.toLowerCase()) || o.user?.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'createdAt') { av = new Date(av); bv = new Date(bv); }
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ column }) => (
    <Icon name={sortKey === column ? (sortDir === 'asc' ? 'chevron-up' : 'chevron-down') : 'sort'} className={`h-3.5 w-3.5 ${sortKey === column ? 'text-brand-600' : 'text-slate-300'}`} />
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Fulfillment</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Orders</h1>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" placeholder="Search by order ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-[10rem]">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Badge variant="default">{filteredOrders.length} orders</Badge>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card><EmptyState icon="inbox" title="No orders found" description="Try a different search or status filter." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-left text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-3 font-semibold">Order</th>
                  <th className="p-3 font-semibold">Customer</th>
                  <th className="p-3 font-semibold">Items</th>
                  <th className="p-3"><button onClick={() => handleSort('totalPrice')} className="flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-700">Total <SortIcon column="totalPrice" /></button></th>
                  <th className="p-3"><button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 font-semibold uppercase tracking-wide hover:text-slate-700">Date <SortIcon column="createdAt" /></button></th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => {
                  const config = statusConfig[o.status] || statusConfig.Pending;
                  return (
                    <tr key={o._id} className="border-b border-slate-50 transition hover:bg-slate-50/60 dark:border-slate-800/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono text-xs text-slate-600 dark:text-slate-400">#{o._id.slice(-8)}</td>
                      <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{o.user?.name || '—'}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{o.items.length}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">${o.totalPrice.toFixed(2)}</td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={config.variant} size="sm" dot>{o.status}</Badge>
                          <select
                            aria-label={`Update status for order ${o._id.slice(-8)}`}
                            value={o.status}
                            onChange={(e) => change(o._id, e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
