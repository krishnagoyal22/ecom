'use client';

import React, { createContext, useContext, useState } from 'react';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  stock_quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

type CartProduct = {
  id: string;
  title: string;
  price: number | string;
  image_url?: string | null;
  stock_quantity: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (product: CartProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity + quantity > product.stock_quantity) {
          alert(`You cannot add more than ${product.stock_quantity} item(s) to your cart due to limited stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      if (quantity > product.stock_quantity) {
        alert(`You cannot add more than ${product.stock_quantity} item(s) to your cart due to limited stock.`);
        return prev;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: Number(product.price),
          quantity,
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const targetItem = prev.find((item) => item.id === id);
      if (targetItem && quantity > targetItem.stock_quantity) {
        alert(`Sorry, only ${targetItem.stock_quantity} item(s) are available in stock right now.`);
        return prev;
      }
      return prev.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
