'use client';

import { X, Clock, Package, Truck, CheckCircle2, MapPin, CreditCard, ShoppingBag, Calendar } from 'lucide-react';
import Image from 'next/image';
import { Order } from '@/lib/firestore';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: any; index: number }> = {
  pending: { label: 'قيد الانتظار', color: 'text-amber-600', icon: Clock, index: 1 },
  processing: { label: 'جاري التجهيز', color: 'text-blue-600', icon: Package, index: 2 },
  shipped: { label: 'تم الشحن', color: 'text-purple-600', icon: Truck, index: 3 },
  delivered: { label: 'تم التوصيل', color: 'text-green-600', icon: CheckCircle2, index: 4 },
};

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const currentStatus = STATUS_MAP[order.status] || STATUS_MAP.pending;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="space-y-1">
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">تفاصيل الطلب</h2>
             <p className="text-sm font-bold text-primary">#{order.id?.slice(-8).toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 transition-colors shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* Status Timeline */}
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="font-black text-gray-900 flex items-center gap-2">
                   <Clock className="text-primary" size={20} /> حالة الطلب
                </h3>
                <span className={`text-xs font-black px-4 py-1.5 rounded-full bg-primary/10 ${currentStatus.color}`}>
                   {currentStatus.label}
                </span>
             </div>
             
             <div className="relative flex justify-between items-start mt-8 px-4">
                <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 -z-10">
                   <div 
                     className="h-full bg-primary transition-all duration-1000" 
                     style={{ width: `${(currentStatus.index - 1) * 33.33}%` }}
                   ></div>
                </div>
                
                {Object.entries(STATUS_MAP).map(([key, info]) => {
                  const isActive = info.index <= currentStatus.index;
                  const Icon = info.icon;
                  return (
                    <div key={key} className="flex flex-col items-center gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                          <Icon size={18} />
                       </div>
                       <span className={`text-[10px] font-black ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {info.label}
                       </span>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Products List */}
          <div className="space-y-6">
             <h3 className="font-black text-gray-900 flex items-center gap-2">
                <ShoppingBag className="text-primary" size={20} /> المنتجات
             </h3>
             <div className="space-y-4">
                {order.productsList.map((product, idx) => {
                  const imageUrl = product.imageUrl || (product.imageUrls && product.imageUrls[0]) || '';
                  return (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-100/50">
                       <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                          <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <h4 className="font-bold text-gray-900">{product.name}</h4>
                          <div className="flex justify-between items-center">
                             <p className="text-xs font-bold text-gray-400">الكمية: {product.quantity}</p>
                             <p className="text-sm font-black text-primary">
                                {product.priceAtPurchase?.toLocaleString('ar-SA')} {product.currencyAtPurchase}
                             </p>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Shipping Address */}
             <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 space-y-4">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                   <MapPin className="text-primary" size={18} /> عنوان الشحن
                </h3>
                <div className="text-xs font-bold text-gray-500 leading-loose">
                   <p className="text-gray-900">{order.customerName}</p>
                   {order.shippingAddress ? (
                     <>
                       <p>{order.shippingAddress.city} - {order.shippingAddress.district}</p>
                       <p>{order.shippingAddress.street}</p>
                     </>
                   ) : (
                     <p>لم يتم تحديد العنوان بالتفصيل</p>
                   )}
                </div>
             </div>

             {/* Order History */}
             <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100/50 space-y-4">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                   <Calendar className="text-primary" size={18} /> التواريخ
                </h3>
                <div className="text-xs font-bold text-gray-500 space-y-3">
                   <div className="flex justify-between">
                      <span>تاريخ الطلب:</span>
                      <span className="text-gray-900">{order.orderDate.toLocaleDateString('ar-SA')}</span>
                   </div>
                   {order.statusHistory && order.statusHistory.length > 0 && (
                     <div className="flex justify-between">
                        <span>آخر تحديث:</span>
                        <span className="text-gray-900">منذ قليل</span>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {/* Totals */}
          <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-4">
             <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>المجموع الفرعي:</span>
                <span>{Object.values(order.subtotals)[0]?.toLocaleString('ar-SA')} {Object.keys(order.subtotals)[0]}</span>
             </div>
             {order.deliveryFees && Object.keys(order.deliveryFees).length > 0 && (
               <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>رسوم التوصيل:</span>
                  <span>{Object.values(order.deliveryFees)[0]?.toLocaleString('ar-SA')} {Object.keys(order.deliveryFees)[0]}</span>
               </div>
             )}
             <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                <span className="text-lg font-black text-gray-900">الإجمالي النهائي:</span>
                <div className="text-right">
                   {Object.entries(order.totalPrices).map(([curr, val]) => (
                     <p key={curr} className="text-2xl font-black text-primary">
                        {val.toLocaleString('ar-SA')} {curr}
                     </p>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 bg-gray-50/50 border-t border-gray-100 text-center">
           <button 
             onClick={onClose}
             className="w-full btn-primary py-4 shadow-xl shadow-primary/20"
           >
              حسناً، فهمت
           </button>
        </div>
      </div>
    </div>
  );
}
