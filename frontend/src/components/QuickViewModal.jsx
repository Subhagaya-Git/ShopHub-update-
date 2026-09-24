import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Rating from './Rating';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Icon from './ui/Icon';
import ProductImage from './ui/ProductImage';

export default function QuickViewModal({ product, onClose }) {
  const { add } = useCart();
  const { push } = useToast();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const out = product.stock <= 0;

  const addToCart = async () => {
    setAdding(true);
    try {
      await add(product._id, qty);
      push(`${product.name} added to cart`);
      onClose();
    } catch (error) {
      push(error.message || 'Unable to add item', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal open onClose={onClose} size="lg" title="Quick view">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
            rounded="rounded-2xl"
          />
        </div>
        <div className="flex flex-col">
          <Badge variant="default" size="sm" className="w-fit">{product.category}</Badge>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{product.name}</h2>
          <div className="mt-2">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          <p className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{product.description}</p>
          <div className="mt-4">
            {out ? (
              <Badge variant="danger" size="md">Out of stock</Badge>
            ) : (
              <Badge variant="success" size="md" dot>{product.stock} in stock</Badge>
            )}
          </div>
          {!out && (
            <div className="mt-5 flex gap-3">
              <div className="flex items-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-500 transition hover:text-slate-900 dark:hover:text-white" aria-label="Decrease quantity">
                  <Icon name="minus" className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-slate-900 dark:hover:text-white" aria-label="Increase quantity">
                  <Icon name="plus" className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={addToCart} loading={adding} icon="cart" className="flex-1">Add to cart</Button>
            </div>
          )}
          <Link to={`/products/${product._id}`} onClick={onClose} className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400">
            View full details
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
