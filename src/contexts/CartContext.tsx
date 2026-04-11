'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Package } from '@/lib/firestore';

export interface CartItem {
  item: Product | Package;
  quantity: number;
  currency: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Product | Package, quantity: number, currency: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;

  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  selectedCurrency: string;
  setCurrency: (c: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CURRENCIES: Record<string, string> = {
  YER: 'ر.ي',
  SAR: 'ر.س',
  USD: '$',
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('YER');

  // Persist cart in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('details_cart');
    if (saved) setItems(JSON.parse(saved));
    const savedCurrency = localStorage.getItem('details_currency');
    if (savedCurrency) setSelectedCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    localStorage.setItem('details_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Product | Package, quantity: number, currency: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { item, quantity, currency }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.item.id !== itemId));
  };


  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.item.id === itemId ? { ...i, quantity } : i))
    );
  };


  const clearCart = () => setItems([]);

  const setCurrency = (c: string) => {
    setSelectedCurrency(c);
    localStorage.setItem('details_currency', c);
  };

  const getPrice = (item: CartItem) => {
    const prices = item.item.isOnOffer
      ? item.item.offerPrices ?? item.item.prices
      : item.item.prices;
    return (prices[selectedCurrency] ?? prices['YER'] ?? 0) * item.quantity;
  };


  const subtotal = items.reduce((sum, item) => sum + getPrice(item), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        selectedCurrency,
        setCurrency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export function formatPrice(prices: Record<string, number>, currency: string): string {
  const price = prices[currency] ?? prices['YER'] ?? 0;
  const symbol = CURRENCIES[currency] ?? currency;
  return `${price.toLocaleString('ar-SA')} ${symbol}`;
}
