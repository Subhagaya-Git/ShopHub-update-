import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { EmptyState, Button, Badge, Icon, Select } from '../components/ui';

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const page = parseInt(params.get('page')) || 1;
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [sort, setSort] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ page, category, search, limit: 12 })
      .then((res) => {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, category, search]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  useEffect(() => setSearchInput(search), [search]);

  useEffect(() => {
    if (searchInput === search) return undefined;
    const timer = window.setTimeout(() => update('search', searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const buildLink = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    return `/products?${next.toString()}`;
  };

  const visibleProducts = products
    .filter((product) => !inStockOnly || product.stock > 0)
    .filter((product) => !minPrice || product.price >= parseFloat(minPrice))
    .filter((product) => !maxPrice || product.price <= parseFloat(maxPrice))
    .filter((product) => (product.rating || 0) >= minRating)
    .sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const activeFilterCount = (category ? 1 : 0) + (inStockOnly ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const clearFilters = () => {
    update('category', '');
    setInStockOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Categories</h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => { update('category', ''); setFilterOpen(false); }}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition no-tap-highlight ${!category ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
          >
            All products
            {!category && <Icon name="check" className="h-4 w-4" />}
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => { update('category', c); setFilterOpen(false); }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium capitalize transition no-tap-highlight ${category === c ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {c}
              {category === c && <Icon name="check" className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Price range</h3>
        <div className="flex items-center gap-2">
          <input type="number" placeholder="Min" className="input" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <span className="text-slate-400">–</span>
          <input type="number" placeholder="Max" className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Minimum rating</h3>
        <div className="space-y-1">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition no-tap-highlight ${minRating === r ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {r === 0 ? 'Any rating' : (
                <span className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Icon key={n} name="star" className={`h-3.5 w-3.5 ${n <= Math.round(r) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
                  ))}
                  <span className="ml-1">&amp; up</span>
                </span>
              )}
              {minRating === r && <Icon name="check" className="ml-auto h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Availability</h3>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          In stock only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="ghost" onClick={clearFilters} fullWidth icon="close" className="text-slate-500">
          Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">Shop the catalog</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Products</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Find something useful, beautiful, and built to last.</p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="filter" className="h-5 w-5 text-slate-400" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Filters</h2>
              {activeFilterCount > 0 && <Badge variant="primary" size="sm">{activeFilterCount}</Badge>}
            </div>
            <FilterContent />
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="input pl-10" placeholder="Search products..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} aria-label="Search products" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon="filter" onClick={() => setFilterOpen(true)} className="lg:hidden">
                Filters
                {activeFilterCount > 0 && <Badge variant="primary" size="sm" className="ml-1">{activeFilterCount}</Badge>}
              </Button>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} className="max-w-[12rem]">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top rated</option>
              </Select>
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={12} className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
          ) : visibleProducts.length === 0 ? (
            <div className="card">
              <EmptyState
                icon="search"
                title="No products found"
                description="Try a different search term or browse every category to discover something new."
                action={<Button variant="primary" onClick={() => { clearFilters(); setSearchInput(''); }}>Clear filters</Button>}
              />
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{visibleProducts.length}</span> of {pagination.pages * 12} products
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination page={pagination.page} pages={pagination.pages} buildLink={buildLink} className="mt-8" />
            </>
          )}
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setFilterOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-slide-in-left dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Icon name="filter" className="h-5 w-5 text-slate-400" />
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
              </div>
              <button type="button" onClick={() => setFilterOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800" aria-label="Close filters">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
              <FilterContent />
            </div>
            <div className="border-t border-slate-100 p-4 dark:border-slate-800">
              <Button variant="primary" fullWidth onClick={() => setFilterOpen(false)}>Show results</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
