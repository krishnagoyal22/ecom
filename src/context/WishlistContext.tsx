'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type WishlistItem = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  image_url?: string | null;
};

type WishlistContextType = {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
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
  userId,
}: {
  children: React.ReactNode;
  isGuest?: boolean;
  storageKey: string;
  userId?: string;
}) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window === 'undefined' || !isGuest) return [];
    return getStoredWishlist(storageKey);
  });
  const [toast, setToast] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsHydrated(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isGuest) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [isGuest, items, storageKey]);

  useEffect(() => {
    if (isGuest || !userId) return;

    let isCurrent = true;
    const supabase = createClient();

    async function loadWishlist() {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product:products(id, title, description, category, image_url)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!isCurrent) return;

      if (error) {
        setToast(`Could not load wishlist: ${error.message}`);
        setItems([]);
        return;
      }

      const wishlistItems = (data || []).flatMap((row) => {
        const products = Array.isArray(row.product) ? row.product : [row.product];

        return products
          .filter((product) => Boolean(product?.id))
          .map((product) => ({
            id: product.id,
            title: product.title,
            description: product.description,
            category: product.category,
            image_url: product.image_url,
          }));
      });

      setItems(wishlistItems);
    }

    loadWishlist();

    return () => {
      isCurrent = false;
    };
  }, [isGuest, userId]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addToWishlist = useCallback(async (product: WishlistItem) => {
    if (items.some((item) => item.id === product.id)) {
      setToast(`${product.title} is already in your wishlist.`);
      return;
    }

    if (!isGuest && userId) {
      const supabase = createClient();
      const { error } = await supabase.from('wishlist').upsert(
        {
          user_id: userId,
          product_id: product.id,
        },
        {
          onConflict: 'user_id,product_id',
          ignoreDuplicates: true,
        },
      );

      if (error) {
        setToast(`Could not save wishlist item: ${error.message}`);
        return;
      }
    }

    setToast(`${product.title} added to your wishlist.`);
    setItems((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]));
  }, [isGuest, items, userId]);

  const removeFromWishlist = useCallback(async (id: string) => {
    if (!isGuest && userId) {
      const supabase = createClient();
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', id);

      if (error) {
        setToast(`Could not remove wishlist item: ${error.message}`);
        return;
      }
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }, [isGuest, userId]);

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
    [addToWishlist, isGuest, isHydrated, items, removeFromWishlist]
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
