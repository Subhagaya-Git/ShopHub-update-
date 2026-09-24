import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { checkout } from '../api/orders';
import { Button, Input, Badge, Icon, Card, EmptyState, ProductImage } from '../components/ui';

const steps = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const { cart, loading, clear } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(0);

  const validItems = (cart?.items || []).filter((i) => i && i.product);
  const subtotal = validItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validate = () => {
    const e = {};
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.postalCode.trim()) e.postalCode = 'Postal code is required';
    if (!form.country.trim()) e.country = 'Country is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      push('Please fill in all required fields', 'error');
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        items: validItems.map((i) => ({ product: i.product?._id, quantity: i.quantity })),
        shippingAddress: form,
      };
      const res = await checkout(payload);
      await clear();
      push('Order placed successfully!');
      navigate('/orders/success', { state: { order: res.data.data } });
    } catch (err) {
      push(err.message || 'Unable to place order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return <div className="skeleton h-96 w-full rounded-2xl" />;
  }
  if (validItems.length === 0) {
    return (
      <div className="card">
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Add products to your cart before checking out."
          action={<Button variant="primary" onClick={() => navigate('/products')}>Browse products</Button>}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
        <Icon name="arrow-left" className="h-4 w-4" />
        Back to cart
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Checkout</h1>
      </div>

      <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 sm:gap-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
              i <= step ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {i < step ? <Icon name="check" className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-sm font-semibold sm:inline ${i <= step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{label}</span>
            {i < steps.length - 1 && <div className={`h-0.5 w-8 sm:w-16 ${i < step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-800'}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={submit} className="space-y-6">
          {step === 0 && (
            <Card className="space-y-4 p-6">
              <div className="flex items-center gap-2.5">
                <Icon name="map-pin" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Shipping address</h2>
              </div>
              <Input label="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} required placeholder="123 Main St" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} error={errors.city} required />
                <Input label="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} error={errors.postalCode} required />
              </div>
              <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} error={errors.country} required placeholder="United States" />
              <Button type="button" variant="primary" fullWidth size="lg" icon="arrow-right" onClick={() => { if (validate()) setStep(1); }}>Continue to payment</Button>
            </Card>
          )}

          {step === 1 && (
            <Card className="space-y-4 p-6">
              <div className="flex items-center gap-2.5">
                <Icon name="credit-card" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Payment method</h2>
              </div>
              <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800/50 dark:bg-brand-950/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                    <Icon name="credit-card" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-800 dark:text-brand-300">Mock Payment</p>
                    <p className="text-xs text-brand-600 dark:text-brand-400">No real charge will be made</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(0)} icon="arrow-left">Back</Button>
                <Button type="button" variant="primary" fullWidth size="lg" icon="arrow-right" onClick={() => setStep(2)}>Review order</Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="space-y-4 p-6">
              <div className="flex items-center gap-2.5">
                <Icon name="check-circle" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Review your order</h2>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shipping to</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{form.address}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{form.city}, {form.postalCode} {form.country}</p>
              </div>
              <div className="space-y-2">
                {validItems.map((i) => (
                  <div key={i.product?._id} className="flex items-center gap-3 text-sm">
                    <ProductImage src={i.product?.image_url} alt={i.product?.name} className="h-12 w-12 rounded-lg object-cover" rounded="rounded-lg" />
                    <span className="flex-1 text-slate-700 dark:text-slate-300">{i.product?.name} × {i.quantity}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">${((i.product?.price || 0) * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} icon="arrow-left">Back</Button>
                <Button type="submit" variant="primary" fullWidth size="lg" loading={placing} icon="check">Place order</Button>
              </div>
            </Card>
          )}
        </form>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Order summary</h2>
            <div className="mt-4 space-y-3">
              {validItems.map((i) => (
                <div key={i.product?._id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <ProductImage src={i.product?.image_url} alt={i.product?.name} className="h-12 w-12 rounded-lg object-cover" rounded="rounded-lg" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">{i.quantity}</span>
                  </div>
                  <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">{i.product?.name}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">${((i.product?.price || 0) * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Shipping</span><span className="font-semibold text-success-600 dark:text-success-400">Free</span></div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Estimated tax</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Total</span>
              <span className="font-display text-lg font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Icon name="lock" className="h-3.5 w-3.5" />
              Secure checkout — Your details are protected
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
