import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import Icon from './ui/Icon';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import ProductImage from './ui/ProductImage';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart, count } = useCart();
  const { dark, toggleTheme } = useTheme();
  const { items: wishlistItems, count: wishlistCount, remove: removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const userRef = useRef(null);
  const cartItems = cart.items || [];
  const cartSubtotal = cartItems.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  useEffect(() => {
    if (!userOpen) return;
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    const handleKey = (e) => { if (e.key === 'Escape') setUserOpen(false); };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [userOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const submit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setQ('');
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition no-tap-highlight ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
      <NavLink to="/products" className={linkClass} onClick={() => setMenuOpen(false)}>Products</NavLink>
      {user && <NavLink to="/orders" className={linkClass} onClick={() => setMenuOpen(false)}>Orders</NavLink>}
      {isAdmin && <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/85">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 lg:gap-6">
            <Link to="/" className="flex shrink-0 items-center gap-2.5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white no-tap-highlight">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-600/30">
                <Icon name="shopping-bag" className="h-5 w-5" />
              </span>
              <span>Shop<span className="text-brand-600 dark:text-brand-400">Hub</span></span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              <NavLink to="/" className={linkClass} end>Home</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              {user && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
              {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            </nav>

            <form onSubmit={submit} className="hidden flex-1 sm:flex sm:max-w-md lg:max-w-lg">
              <div className="relative w-full">
                <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  className="input pl-10 pr-4"
                  placeholder="Search products..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Search products"
                />
              </div>
            </form>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="hidden sm:inline-flex">
                <Icon name={dark ? 'sun' : 'moon'} className="h-5 w-5" />
              </Button>

              <button type="button" onClick={() => setWishlistOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white no-tap-highlight" aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}>
                <Icon name="heart" className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">{wishlistCount}</span>
                )}
              </button>

              <button type="button" onClick={() => navigate('/cart')} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white no-tap-highlight" aria-label={`Cart${count > 0 ? `, ${count} items` : ''}`}>
                <Icon name="cart" className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[1.125rem] min-w-[1.125rem] animate-bounce-short items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">{count}</span>
                )}
              </button>

              {user ? (
                <div className="relative hidden sm:block" ref={userRef}>
                  <button
                    type="button"
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-slate-100 dark:hover:bg-slate-800 no-tap-highlight"
                    aria-expanded={userOpen}
                    aria-haspopup="menu"
                    aria-label="User menu"
                  >
                    <Avatar name={user.name} size="sm" />
                    <Icon name="chevron-down" className="h-4 w-4 text-slate-400" />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 top-12 w-60 animate-slide-down rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900" role="menu">
                      <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{isAdmin ? 'Administrator' : 'Shopper'}</p>
                      </div>
                      <div className="mt-1.5 space-y-0.5">
                        <Link to="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" role="menuitem">
                          <Icon name="package" className="h-4 w-4" />
                          Order history
                        </Link>
                        <button
                          onClick={() => { logout(); navigate('/'); setUserOpen(false); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-danger-600 transition hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30"
                          role="menuitem"
                        >
                          <Icon name="logout" className="h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn-primary hidden sm:inline-flex">Login</Link>
              )}

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white no-tap-highlight lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Icon name="menu" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-slide-in-left dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-900 dark:text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                  <Icon name="shopping-bag" className="h-5 w-5" />
                </span>
                ShopHub
              </Link>
              <button type="button" onClick={() => setMenuOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800" aria-label="Close menu">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              <form onSubmit={submit} className="mb-4">
                <div className="relative">
                  <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" className="input pl-10" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
              </form>

              <nav className="grid gap-1">
                {navLinks}
              </nav>

              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button type="button" onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Icon name={dark ? 'sun' : 'moon'} className="h-5 w-5" />
                  {dark ? 'Light mode' : 'Dark mode'}
                </button>
                {user ? (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                      <Avatar name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-500">{isAdmin ? 'Administrator' : 'Shopper'}</p>
                      </div>
                    </div>
                    <button onClick={() => { logout(); navigate('/'); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-danger-600 transition hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30">
                      <Icon name="logout" className="h-5 w-5" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary w-full">Login</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-outline w-full">Create account</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {wishlistOpen && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="wishlist-title">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setWishlistOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Icon name="heart" className="h-5 w-5 text-danger-500" />
                <h2 id="wishlist-title" className="font-display text-lg font-bold text-slate-900 dark:text-white">Wishlist</h2>
                {wishlistCount > 0 && <Badge variant="danger" size="sm">{wishlistCount}</Badge>}
              </div>
              <button type="button" onClick={() => setWishlistOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800" aria-label="Close wishlist">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            {wishlistItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-50 text-danger-400 dark:bg-danger-900/30">
                  <Icon name="heart" className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">Your wishlist is empty</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Save items you want to come back to.</p>
                <Button variant="outline" icon="grid" onClick={() => { setWishlistOpen(false); navigate('/products'); }} className="mt-6">Browse products</Button>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-5">
                {wishlistItems.map((item) => (
                  <div key={item._id} className="flex gap-3 rounded-2xl border border-slate-200 p-3 transition hover:shadow-sm dark:border-slate-800">
                    <Link to={`/products/${item._id}`} onClick={() => setWishlistOpen(false)} className="shrink-0">
                      <ProductImage src={item.image_url} alt={item.name} className="h-16 w-16 rounded-xl object-cover" rounded="rounded-xl" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${item._id}`} onClick={() => setWishlistOpen(false)} className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-600 dark:text-slate-100">{item.name}</Link>
                      <p className="mt-1 font-bold text-brand-600 dark:text-brand-400">${item.price.toFixed(2)}</p>
                    </div>
                    <button type="button" onClick={() => removeFromWishlist(item._id)} className="self-start rounded-lg p-1.5 text-slate-400 transition hover:bg-danger-50 hover:text-danger-500 dark:hover:bg-danger-900/30" aria-label={`Remove ${item.name}`}>
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-in-right dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Icon name="cart" className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 id="cart-drawer-title" className="font-display text-lg font-bold text-slate-900 dark:text-white">Your cart</h2>
                {count > 0 && <Badge variant="primary" size="sm">{count}</Badge>}
              </div>
              <button type="button" onClick={() => setCartOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800" aria-label="Close cart">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-400 dark:bg-brand-900/30">
                  <Icon name="cart" className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-slate-100">Your cart is empty</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Add items to get started.</p>
                <Button variant="primary" icon="grid" onClick={() => { setCartOpen(false); navigate('/products'); }} className="mt-6">Browse products</Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-5">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex gap-3 rounded-2xl border border-slate-200 p-3 dark:border-slate-800">
                      <ProductImage src={item.product.image_url} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" rounded="rounded-xl" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.product.name}</p>
                        <p className="mt-1 text-xs text-slate-500">Qty {item.quantity}</p>
                        <p className="mt-0.5 font-bold text-brand-600 dark:text-brand-400">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 p-5 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Subtotal</span>
                    <span className="font-display text-lg font-bold text-slate-900 dark:text-white">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="space-y-2">
                    <Button variant="primary" fullWidth icon="arrow-right" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>Checkout</Button>
                    <Button variant="ghost" fullWidth onClick={() => { setCartOpen(false); navigate('/cart'); }}>View full cart</Button>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
