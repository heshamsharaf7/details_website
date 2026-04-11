'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, formatPrice } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createOrder, Order } from '@/lib/firestore';
import { ChevronLeft, User, Phone, MapPin, CreditCard, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';


export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, selectedCurrency, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.push('/cart');
    }
  }, [items.length, orderId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      router.push('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    try {
      const order: Omit<Order, 'id'> = {
        userId: user.uid,
        customerName: name,
        customerEmail: user.email || '',
        orderDate: new Date(),
        status: 'pending',
        productsList: items.map(i => ({
          name: i.item.name,
          quantity: i.quantity,
          priceAtPurchase: (i.item.isOnOffer ? i.item.offerPrices?.[selectedCurrency] : i.item.prices[selectedCurrency]) || 0,
          currencyAtPurchase: selectedCurrency,
          imageUrl: i.item.imageUrls?.[0] || '',
        })),
        shippingAddress: {
          address,
          phone,
        },
        subtotals: { [selectedCurrency]: subtotal },
        totalPrices: { [selectedCurrency]: subtotal },
      };

      const id = await createOrder(order);
      setOrderId(id);
      clearCart();
      toast.success('تم إرسال طلبك بنجاح!');
    } catch (error: any) {
      console.error('Order error:', error);
      toast.error('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-8 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-xl shadow-green-100">
          <CheckCircle2 size={64} />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900">طلبك في الطريق!</h1>
          <p className="text-gray-500 max-w-md font-medium mx-auto">
            شكراً لثقتك بنا. تم استلام طلبك رقم <span className="text-primary font-black">#{orderId.slice(-6)}</span> بنجاح. سنقوم بالتواصل معك قريباً لتأكيد التوصيل.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/orders" className="flex-1 btn-primary py-4 flex items-center justify-center gap-2">
            متابعة الطلبات
          </Link>
          <Link href="/" className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-200 transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-700">
       <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-bold"
      >
        <ChevronLeft size={20} /> العودة للسلة
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Shipping Form */}
        <div className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900">بيانات التوصيل</h1>
            <p className="text-gray-500 font-medium font-cairo">يرجى إدخال بياناتك بدقة لضمان وصول الطلب في أسرع وقت</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">الاسم بالكامل</label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="محمد الصنعاني"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">رقم التواصل</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="77xxxxxxx"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">عنوان التوصيل</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-4 text-gray-400" size={20} />
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none text-right"
                    placeholder="المحافظة - المديرية - الشارع - علامة مميزة"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900 rounded-[2rem] text-white space-y-4">
               <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <CreditCard className="text-primary" />
                  <span className="font-bold">طريقة الدفع</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm opacity-60">الدفع عند الاستلام</span>
                  <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">افتراضي</span>
               </div>
               <p className="text-[10px] opacity-40 leading-relaxed font-bold">
                 حالياً، الخدمة تدعم طريقة الدفع "كاش" عند الاستلام فقط لتسهيل العملية وضمان معاينة المنتج قبل الدفع.
               </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-6 flex items-center justify-center gap-3 text-xl shadow-primary/30 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  تأكيد وإرسال الطلب
                  <ArrowRight size={24} className="group-hover:translate-x-[-4px] transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl shadow-primary/5 sticky top-24 space-y-8">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-50 pb-6">موجز الطلب</h2>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 no-scrollbar">
               {items.map((i) => (
                 <div key={i.item.id} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                       <Image src={i.item.imageUrls?.[0] || ''} alt={i.item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{i.item.name}</h4>
                       <span className="text-gray-400 text-xs font-bold">الكمية: {i.quantity}</span>
                    </div>
                    <span className="font-black text-primary text-sm whitespace-nowrap">
                       {formatPrice(Object.fromEntries(Object.entries(i.item.isOnOffer ? i.item.offerPrices! : i.item.prices).map(([k, v]) => [k, v * i.quantity])), selectedCurrency)}
                    </span>
                 </div>
               ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
               <div className="flex justify-between items-center text-gray-500 font-bold">
                  <span>المجموع الفرعي</span>
                  <span>{subtotal.toLocaleString('ar-SA')} {selectedCurrency}</span>
               </div>
               <div className="flex justify-between items-center text-gray-500 font-bold">
                  <span>رسوم التوصيل</span>
                  <span className="text-green-500">مجانــاً</span>
               </div>
               <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <span className="text-2xl font-black text-gray-900">الإجمالي</span>
                  <span className="text-3xl font-black text-primary">
                    {subtotal.toLocaleString('ar-SA')} {selectedCurrency}
                  </span>
               </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
               <ShieldCheck className="text-primary flex-shrink-0" />
               <p className="text-[10px] font-bold text-gray-600 leading-normal">
                 تسوقك آمن تماماً! بياناتك محمية ومشفرة ولا نشاركها مع أي طرف ثالث.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


