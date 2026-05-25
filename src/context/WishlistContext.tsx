'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type WishlistItem = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
};

type WishlistContextType = {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  totalItems: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addToWishlist = (product: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        setToast(`${product.title} is already in your wishlist.`);
        return prev;
      }

      setToast(`${product.title} added to your wishlist.`);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      items,
      addToWishlist,
      removeFromWishlist,
      isWishlisted: (id: string) => items.some((item) => item.id === id),
      totalItems: items.length,
    }),
    [items]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      {toast ? (
        <div className="wishlist-toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
