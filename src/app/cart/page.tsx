'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart, formatPrice } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, selectedCurrency, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">سلتك فارغة</h1>
        <p className="text-gray-500 max-w-md font-medium">
          يبدو أنك لم تضف أي منتجات للسلة بعد. ابدأ بالتسوق واكتشف أحدث العروض!
        </p>
        <Link href="/" className="btn-primary flex items-center gap-2">
          ابدأ التسوق <ChevronRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-700">
      <h1 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-3">
        سلة التسوق <span className="text-primary text-xl">({totalItems})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div 
              key={item.item.id} 
              className="group flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image 
                  src={item.item.imageUrls?.[0] || ''} 
                  alt={item.item.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 flex flex-col gap-2 w-full">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <p className="text-primary font-black text-lg">
                  {formatPrice(
                    item.item.isOnOffer ? item.item.offerPrices! : item.item.prices, 
                    selectedCurrency
                  )}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                    <button 
                      onClick={() => updateQuantity(item.item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <span className="text-sm font-bold text-gray-400 tracking-tighter">
                    المجموع: {formatPrice(
                      Object.fromEntries(
                        Object.entries(item.item.isOnOffer ? item.item.offerPrices! : item.item.prices).map(([k, v]) => [k, v * item.quantity])
                      ),
                      selectedCurrency
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-primary/5 space-y-6 sticky top-24">
            <h2 className="text-xl font-black text-gray-900 border-b border-gray-50 pb-4">ملخص الطلب</h2>
            
            <div className="space-y-4 font-medium">
              <div className="flex justify-between text-gray-500">
                <span>المجموع الفرعي</span>
                <span>{subtotal.toLocaleString('ar-SA')} {selectedCurrency === 'YER' ? 'ر.ي' : selectedCurrency}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>التوصيل</span>
                <span className="text-green-500 font-bold">مجاني</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xl font-black">الإجمالي</span>
                <span className="text-2xl font-black text-primary">
                  {subtotal.toLocaleString('ar-SA')} {selectedCurrency === 'YER' ? 'ر.ي' : selectedCurrency}
                </span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="w-full btn-primary py-5 flex items-center justify-center gap-2 text-lg shadow-primary/20 group"
            >
              إتمام الطلب
              <ArrowRight size={20} className="mr-1 group-hover:translate-x-[-4px] transition-transform" />
            </Link>

            <div className="pt-4 flex flex-col gap-3">
              <p className="text-[10px] text-gray-400 text-center font-bold">
                بالنقر على إتمام الطلب، أنت توافق على شروط الخدمة وسياسة الخصوصية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
