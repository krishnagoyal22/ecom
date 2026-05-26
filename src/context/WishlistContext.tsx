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
  isHydrated: boolean;
  isGuest: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getStoredWishlist(storageKey: string) {
  try {
    const storedItems = window.localStorage.getItem(storageKey);
    if (!storedItems) return [];

    const parsedItems = JSON.parse(storedItems);
    return Array.isArray(parsedItems) ? (parsedItems as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({
  children,
  isGuest = false,
  storageKey,
}: {
  children: React.ReactNode;
  isGuest?: boolean;
  storageKey: string;
}) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === 'undefined') return [];
    return getStoredWishlist(storageKey);
  });
  const [toast, setToast] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsHydrated(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

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
      isHydrated,
      isGuest,
    }),
    [isGuest, isHydrated, items]
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
