import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import Rating from './Rating';
import QuickViewModal from './QuickViewModal';
import Icon from './ui/Icon';
import Badge from './ui/Badge';
import ProductImage from './ui/ProductImage';

export default function ProductCard({ product }) {
  const out = product.stock <= 0;
  const { add } = useCart();
  const { push } = useToast();
  const { toggle, isSaved } = useWishlist();
  const [quickOpen, setQuickOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const saved = isSaved(product._id);

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    try {
      await add(product._id);
      push(`${product.name} added to cart`);
    } catch (error) {
      push(error.message || 'Unable to add item', 'error');
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(product);
    push(added ? `${product.name} saved to wishlist` : `${product.name} removed from wishlist`);
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickOpen(true);
  };

  return (
    <>
      <article className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
        <Link to={`/products/${product._id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              rounded="rounded-none"
              loading="lazy"
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
              <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur-sm shadow-sm">{product.category}</Badge>
              {out && <Badge variant="danger" size="sm" className="shadow-sm">Sold out</Badge>}
            </div>
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100 focus-within:opacity-100">
              <button
                type="button"
                onClick={toggleWishlist}
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 shadow-md backdrop-blur-sm transition active:scale-90 ${saved ? 'text-danger-500' : 'text-slate-500 hover:text-danger-500'}`}
                aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              >
                <Icon name="heart" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openQuickView}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-slate-500 shadow-md backdrop-blur-sm transition hover:text-brand-600 active:scale-90"
                aria-label={`Quick view ${product.name}`}
              >
                <Icon name="eye" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Link>

        <div className="p-4">
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="line-clamp-1 font-semibold text-slate-900 transition hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-400">{product.name}</h3>
          </Link>
          <div className="mt-1.5">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
            {!out && (
              <Badge variant="success" size="sm" dot>In stock</Badge>
            )}
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={out || adding}
            className="btn-primary mt-4 w-full"
          >
            {adding ? (
              <Icon name="refresh" className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Icon name="cart" className="h-4 w-4" />
                {out ? 'Out of stock' : 'Add to cart'}
              </>
            )}
          </button>
        </div>
      </article>
      {quickOpen && <QuickViewModal product={product} onClose={() => setQuickOpen(false)} />}
    </>
  );
}
