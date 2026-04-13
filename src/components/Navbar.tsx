'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, Bell, Package, Home } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import Image from 'next/image';

export default function Navbar() {
  const { user } = useAuth();
  const { totalItems, selectedCurrency, setCurrency } = useCart();
  const { settings } = useSettings();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg z-50 border-b border-gray-100 px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            {(settings?.app_logo || settings?.logoUrl) ? (
              <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden">
                <Image 
                  src={settings.app_logo || settings.logoUrl || ''} 
                  alt={settings.storeName || 'Logo'} 
                  fill 
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-xl md:text-2xl font-black text-primary tracking-tighter group-active:scale-95 transition-transform">
                {settings?.storeName?.toUpperCase() || 'DETAILS'}
              </span>
            )}
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
              <Home size={18} /> الرئيسية
            </Link>
            <Link href="/orders" className="hover:text-primary transition-colors flex items-center gap-2">
              <Package size={18} /> طلباتي
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-4">
          <select 
            value={selectedCurrency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-50 border-none text-[10px] md:text-xs font-black rounded-xl px-2 py-1.5 outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="YER">ر.ي</option>
            <option value="SAR">ر.س</option>
            <option value="USD">USD</option>
          </select>

          <Link href="/notifications" className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all relative group">
            <Bell size={22} className="group-hover:scale-110 transition-transform" />
          </Link>

          <Link href="/cart" className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all relative group">
            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg shadow-primary/20">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <Link href="/profile" className="flex items-center gap-2 p-1 bg-gray-50 rounded-full hover:bg-gray-100 transition-all border border-gray-100 md:pr-4">
              <span className="text-xs font-black text-gray-700 hidden lg:block max-w-[100px] truncate">{user.displayName || 'الحساب'}</span>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-full flex items-center justify-center text-white shadow-md shadow-primary/20">
                <User size={18} />
              </div>
            </Link>
          ) : (
            <Link href="/login" className="text-xs md:text-sm font-black text-primary px-4 py-2 hover:bg-primary/5 rounded-2xl transition-all">
              دخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
