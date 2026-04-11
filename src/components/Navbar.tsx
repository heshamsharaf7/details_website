'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, Bell, Package, Home, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, selectedCurrency, setCurrency } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-4 md:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-[#C08B7A] tracking-tighter">
            DETAILS
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#C08B7A] transition-colors flex items-center gap-2">
              <Home size={18} /> الرئيسية
            </Link>
            <Link href="/orders" className="hover:text-[#C08B7A] transition-colors flex items-center gap-2">
              <Package size={18} /> طلباتي
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <select 
            value={selectedCurrency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-50 border-none text-xs font-bold rounded-lg px-2 py-1 outline-none text-gray-700"
          >
            <option value="YER">ر.ي</option>
            <option value="SAR">ر.س</option>
            <option value="USD">USD</option>
          </select>

          <Link href="/notifications" className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
            <Bell size={22} />
          </Link>

          <Link href="/cart" className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#C08B7A] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 group relative">
              <Link href="/profile" className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <span className="text-xs font-bold text-gray-700 hidden sm:block">{user.displayName || 'الحساب'}</span>
                <div className="w-8 h-8 bg-[#C08B7A] rounded-full flex items-center justify-center text-white">
                  <User size={18} />
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/login" className="text-sm font-bold text-[#C08B7A] hover:underline">
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
