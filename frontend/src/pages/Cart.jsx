import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SkeletonCard, Button, Badge, Icon, Card, EmptyState, ProductImage } from '../components/ui';

export default function Cart() {
  const { cart, loading, update, remove } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();

  const items = cart.items || [];
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const removeItem = async (id, name) => {
    await remove(id);
    push(`${name} removed from cart`);
  };

  const updateQty = async (id, qty, stock) => {
    if (qty < 1 || qty > stock) return;
    await update(id, qty);
  };

  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Your next favorite thing is waiting. Explore the collection and add something you love."
          action={<Button variant="primary" icon="arrow-right" onClick={() => navigate('/products')}>Browse products</Button>}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Your selection</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Shopping cart</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((i) => {
            const p = i.product;
            if (!p) return null;
            return (
              <Card key={p._id} className="flex gap-4 p-4" hover>
                <Link to={`/products/${p._id}`} className="shrink-0">
                  <ProductImage src={p.image_url} alt={p.name} className="h-24 w-24 rounded-xl object-cover" rounded="rounded-xl" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/products/${p._id}`} className="font-semibold text-slate-900 transition hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400">{p.name}</Link>
                    <button onClick={() => removeItem(p._id, p.name)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-900/30" aria-label={`Remove ${p.name}`}>
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">${p.price.toFixed(2)} each</p>
                  {p.stock <= 0 && <Badge variant="danger" size="sm" className="mt-1">Out of stock</Badge>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                      <button className="flex h-9 w-9 items-center justify-center rounded-l-xl text-slate-500 transition hover:text-slate-900 dark:hover:text-white" onClick={() => updateQty(p._id, i.quantity - 1, p.stock)} aria-label="Decrease quantity">
                        <Icon name="minus" className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-slate-100">{i.quantity}</span>
                      <button className="flex h-9 w-9 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-slate-900 dark:hover:text-white" onClick={() => updateQty(p._id, i.quantity + 1, p.stock)} aria-label="Increase quantity">
                        <Icon name="plus" className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-display text-lg font-bold text-slate-900 dark:text-white">${(p.price * i.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
          <Link to="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400">
            <Icon name="arrow-left" className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Subtotal ({items.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-success-600 dark:text-success-400">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Estimated tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Total</span>
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
            <Button variant="primary" fullWidth size="lg" icon="arrow-right" onClick={() => navigate('/checkout')} className="mt-6">Proceed to checkout</Button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Icon name="lock" className="h-3.5 w-3.5" />
              Secure checkout
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
