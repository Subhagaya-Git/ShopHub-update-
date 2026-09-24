import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/ui/Skeleton';
import Icon from '../components/ui/Icon';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8 })
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="relative mb-12 overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 text-white shadow-soft sm:px-12 lg:py-20">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-brand-700/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300 backdrop-blur-sm">
            <Icon name="sparkles" className="h-3.5 w-3.5" />
            Curated for modern living
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-display-lg">
            Better products.<br />
            <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">Less searching.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Quality products at great prices, selected to make everyday decisions simpler. Browse our catalog and check out in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/products" className="btn btn-lg bg-white text-slate-950 hover:bg-brand-50">
              Explore collection
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
            <Link to="/products" className="btn btn-lg border border-white/20 text-white hover:bg-white/10">
              Browse all
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">The edit</span>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Featured products</h2>
        </div>
        <Link to="/products" className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-400">
          View all
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <SkeletonGrid count={8} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
