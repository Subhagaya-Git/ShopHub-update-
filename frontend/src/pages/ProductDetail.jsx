import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct, addReview } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Rating from '../components/Rating';
import { SkeletonCard, Button, Badge, Icon, Textarea, Card, ProductImage } from '../components/ui';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();
  const { push } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');

  const load = () => {
    setLoading(true);
    getProduct(id).then((res) => setProduct(res.data.data)).finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const addToCart = async () => {
    setAdding(true);
    try {
      await add(product._id, qty);
      push(`${product.name} added to cart`);
      navigate('/cart');
    } catch (e) {
      push(e.message || 'Unable to add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!review.comment.trim()) {
      push('Please write a comment', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addReview(product._id, review);
      push('Review added!');
      setReview({ rating: 5, comment: '' });
      load();
      setActiveTab('reviews');
    } catch (e) {
      push(e.message || 'Unable to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <SkeletonCard />
        <div className="space-y-4">
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-10 w-3/4" />
          <div className="skeleton h-8 w-1/3" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    );
  }
  if (!product) return <p className="py-12 text-center text-slate-500">Product not found.</p>;

  const out = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock < 5;
  const images = product.image_url ? [product.image_url] : [];
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = product.reviews?.filter((r) => Math.round(r.rating) === star).length || 0;
    const pct = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
    return { star, count, pct };
  });

  return (
    <div className="animate-fade-in">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400">
        <Icon name="arrow-left" className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="card overflow-hidden bg-slate-100 p-2 dark:bg-slate-800">
          <div className="group overflow-hidden rounded-xl">
            <ProductImage src={images[0]} alt={product.name} className="aspect-square h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" rounded="rounded-xl" />
          </div>
          {images.length > 0 && (
            <div className="flex gap-2 p-2">
              {images.map((img, i) => (
                <button key={i} type="button" className="h-16 w-16 overflow-hidden rounded-xl border-2 border-brand-600 bg-white p-0.5" aria-label={`Product image ${i + 1}`}>
                  <ProductImage src={img} alt="" className="h-full w-full rounded-lg object-cover" rounded="rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Badge variant="primary" size="md">{product.category}</Badge>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} size="md" />
            <span className="text-sm text-slate-500 dark:text-slate-400">{product.rating?.toFixed(1) || '0.0'} ({product.numReviews} reviews)</span>
          </div>
          <p className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">${product.price.toFixed(2)}</p>
          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="mt-4">
            {out ? (
              <Badge variant="danger" size="lg" dot>Out of stock</Badge>
            ) : lowStock ? (
              <Badge variant="warning" size="lg" dot>Only {product.stock} left</Badge>
            ) : (
              <Badge variant="success" size="lg" dot>{product.stock} in stock</Badge>
            )}
          </div>

          {!out && (
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center rounded-l-xl text-slate-500 transition hover:text-slate-900 dark:hover:text-white" aria-label="Decrease quantity">
                  <Icon name="minus" className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-slate-100">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="flex h-10 w-10 items-center justify-center rounded-r-xl text-slate-500 transition hover:text-slate-900 dark:hover:text-white" aria-label="Increase quantity">
                  <Icon name="plus" className="h-4 w-4" />
                </button>
              </div>
              <Button onClick={addToCart} loading={adding} icon="cart" className="flex-1" size="lg">Add to cart</Button>
            </div>
          )}
        </div>
      </div>

      {!out && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl shadow-lg dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
          <div>
            <p className="text-xs text-slate-500">{product.name}</p>
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">${(product.price * qty).toFixed(2)}</p>
          </div>
          <Button onClick={addToCart} loading={adding} icon="cart" size="lg" className="flex-1 max-w-[12rem]">Add to cart</Button>
        </div>
      )}

      <div className="mt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            <button type="button" onClick={() => setActiveTab('reviews')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>Reviews</button>
            {user && <button type="button" onClick={() => setActiveTab('write')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === 'write' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>Write a review</button>}
          </div>
          <Badge variant="default">{product.numReviews} total</Badge>
        </div>

        {activeTab === 'reviews' && (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <Card className="h-fit p-5">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Rating summary</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="font-display text-4xl font-bold text-slate-900 dark:text-white">{product.rating?.toFixed(1) || '0.0'}</p>
                  <Rating value={product.rating} size="sm" />
                  <p className="mt-1 text-xs text-slate-500">{product.numReviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {ratingBreakdown.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="flex w-8 items-center gap-0.5 text-xs font-medium text-slate-500">
                        {star}<Icon name="star" className="h-3 w-3 text-amber-400" />
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-xs text-slate-400">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div>
              {product.reviews?.length === 0 ? (
                <div className="card">
                  <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <Icon name="star" className="h-7 w-7" />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">No reviews yet</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Be the first to share your thoughts.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {product.reviews?.map((r) => (
                    <Card key={r._id} className="p-5" hover>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white">
                            {r.name?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.name}</p>
                            <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <Rating value={r.rating} size="sm" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{r.comment}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {user && activeTab === 'write' && (
          <Card className="max-w-2xl p-6">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Write a review</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Share your experience with this product.</p>
            <form onSubmit={submitReview} className="mt-5 space-y-4">
              <div>
                <label className="label mb-2">Your rating</label>
                <Rating value={review.rating} size="lg" interactive onChange={(n) => setReview({ ...review, rating: n })} />
              </div>
              <Textarea
                label="Your review"
                rows={4}
                placeholder="What did you like or dislike about this product?"
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                required
              />
              <div className="flex gap-3">
                <Button type="submit" loading={submitting} icon="check">Submit review</Button>
                <Button variant="ghost" onClick={() => setActiveTab('reviews')}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {!user && (
          <div className="card max-w-2xl p-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400">Sign in</Link> to write a review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
