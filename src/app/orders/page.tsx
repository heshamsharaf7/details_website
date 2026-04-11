'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToUserOrders, Order } from '@/lib/firestore';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronLeft, ShoppingBag, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OrderDetailsModal from '@/components/OrderDetailsModal';

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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
        <p className="font-black text-gray-400 animate-pulse">جاري جلب طلباتك...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-300 border border-gray-100 shadow-inner">
          <ShoppingBag size={56} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">لا توجد طلبات سابقة</h1>
          <p className="text-gray-500 max-w-md font-medium font-cairo text-sm">
            ابدأ رحلة تسوقك الآن وستظهر جميع طلباتك هنا لتتبع حالتها بسهولة.
          </p>
        </div>
        <Link href="/" className="btn-primary flex items-center gap-3 px-10 py-5 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
           اكتشف المنتجات <ChevronLeft size={22} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">قائمة طلباتي</h1>
        <div className="px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
           <span className="text-primary font-black text-sm">{orders.length} طلبات</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {orders.map((order) => {
          const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;
          const StatusIcon = statusInfo.icon;

          return (
            <div 
              key={order.id} 
              className="group bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-primary/5 overflow-hidden transition-all hover:border-primary/20 hover:shadow-primary/10"
            >
              <div className="p-8 md:p-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50 pb-8">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                          #{order.id?.slice(-8).toUpperCase()}
                        </span>
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-[10px] md:text-xs ${statusInfo.color}`}>
                          <StatusIcon size={14} />
                          {statusInfo.label}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-400">
                        بتاريخ: {order.orderDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                   </div>
                   <button 
                     onClick={() => setSelectedOrder(order)}
                     className="flex items-center gap-2 bg-gray-50 text-gray-900 font-black px-6 py-3.5 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-sm text-sm group-hover:scale-105"
                   >
                       <Eye size={18} />
                       عرض كافة التفاصيل
                   </button>
                </div>

                {/* Products Preview */}
                <div className="flex flex-wrap gap-4">
                  {order.productsList.slice(0, 4).map((product, idx) => {
                    const imageUrl = product.imageUrl || (product.imageUrls && product.imageUrls[0]) || '';
                    return (
                      <div key={idx} className="relative group/img">
                        <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md transition-all">
                           <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                        </div>
                        {product.quantity > 1 && (
                          <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                            {product.quantity}x
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {order.productsList.length > 4 && (
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gray-100 border border-dashed border-gray-200 flex items-center justify-center text-gray-400 font-black text-sm">
                      +{order.productsList.length - 4}
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-50">
                    <div className="flex gap-10">
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">عدد العناصر</span>
                          <span className="text-lg font-black text-gray-900">{order.productsList.length} عناصر</span>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">إجمالي المبلغ</span>
                          <div className="flex flex-col items-start leading-none">
                             {Object.entries(order.totalPrices).map(([curr, val]) => (
                               <span key={curr} className="text-2xl font-black text-primary">
                                  {val.toLocaleString('ar-SA')} {curr}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>
                    <div className="w-full md:w-auto">
                       <button 
                         onClick={() => setSelectedOrder(order)}
                         className="w-full btn-primary bg-zinc-900 hover:bg-zinc-800 px-10 py-4 shadow-xl shadow-zinc-900/10 text-xs"
                       >
                          تتبع حالة الشحن
                       </button>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
