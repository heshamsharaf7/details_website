'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToUserOrders, Order } from '@/lib/firestore';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronLeft, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-amber-100 text-amber-600', icon: Clock },
  processing: { label: 'جاري التجهيز', color: 'bg-blue-100 text-blue-600', icon: Package },
  shipped: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-600', icon: Truck },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-600', icon: XCircle },
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/orders');
      return;
    }

    const unsub = subscribeToUserOrders(user.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsub();
  }, [user, authLoading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">لا توجد طلبات سابقة</h1>
        <p className="text-gray-500 max-w-md font-medium">
          ابدأ رحلة تسوقك الآن وستظهر جميع طلباتك هنا لتتبع حالتها بسهولة.
        </p>
        <Link href="/" className="btn-primary flex items-center gap-2">
           اكتشف المنتجات <ChevronLeft size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black text-gray-900 mb-10">قائمة طلباتي</h1>

      <div className="space-y-8">
        {orders.map((order) => {
          const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
          const StatusIcon = statusInfo.icon;

          return (
            <div 
              key={order.id} 
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary/5 overflow-hidden transition-all hover:border-primary/20"
            >
              <div className="p-6 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-6">
                   <div className="space-y-1">
                      <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
                        #{order.id?.slice(-8).toUpperCase()}
                      </span>
                      <p className="text-sm font-bold text-gray-400 mt-2">
                        بتاريخ: {order.orderDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                   </div>
                   <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm ${statusInfo.color}`}>
                      <StatusIcon size={18} />
                      {statusInfo.label}
                   </div>
                </div>

                {/* Products List */}
                <div className="space-y-4">
                  {order.productsList.map((product, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                       <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <Image src={product.imageUrl || ''} alt={product.name} fill className="object-cover" />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                          <div className="flex items-center gap-3 text-xs font-bold mt-1">
                             <span className="text-gray-400">الكمية: {product.quantity}</span>
                             <span className="text-primary">{product.priceAtPurchase?.toLocaleString('ar-SA')} {product.currencyAtPurchase}</span>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                    <div className="space-y-1">
                       <span className="text-xs font-bold text-gray-400 block">إجمالي المبلغ</span>
                       <span className="text-2xl font-black text-primary">
                          {Object.values(order.totalPrices)[0].toLocaleString('ar-SA')} {Object.keys(order.totalPrices)[0]}
                       </span>
                    </div>
                    <button className="bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-2xl hover:bg-gray-100 transition-colors">
                       التفاصيل
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
