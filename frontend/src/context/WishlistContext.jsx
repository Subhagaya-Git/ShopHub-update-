import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'shophub-wishlist';

function readWishlist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const toggle = (product) => {
    const exists = items.some((item) => item._id === product._id);
    persist(exists ? items.filter((item) => item._id !== product._id) : [...items, product]);
    return !exists;
  };

  const remove = (id) => persist(items.filter((item) => item._id !== id));
  const isSaved = (id) => items.some((item) => item._id === id);

  return <WishlistContext.Provider value={{ items, count: items.length, toggle, remove, isSaved }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
