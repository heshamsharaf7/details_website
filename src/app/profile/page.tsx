'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoreSettings, StoreSettings } from '@/lib/firestore';
import { User, Mail, LogOut, Package, Bell, MapPin, Phone, Info, ShieldCheck, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<StoreSettings>({});
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/profile');
      return;
    }

    async function fetchSettings() {
      const s = await getStoreSettings();
      setSettings(s);
    }
    fetchSettings();
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('تم تسجيل الخروج بنجاح');
      router.push('/');
    } catch (e) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-700 space-y-12 pb-20">
      {/* Profile Header */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-primary/20">
            {user.displayName?.[0] || 'U'}
          </div>
          
          <div className="flex-1 text-center md:text-right space-y-2">
            <h1 className="text-3xl font-black text-gray-900">{user.displayName || 'مستخدم ديتيلز'}</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 text-gray-500 font-medium justify-center md:justify-start">
               <span className="flex items-center gap-2"><Mail size={16} /> {user.email}</span>
               <span className="hidden md:block w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
               <span className="flex items-center gap-2 text-primary font-bold">عضو منذ 2026</span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-black bg-red-50 px-6 py-3 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <LogOut size={20} /> خروج
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Links */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-gray-900 mr-4">خدماتي</h2>
           <div className="grid grid-cols-1 gap-4">
              <Link href="/orders" className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                       <Package size={24} />
                    </div>
                    <div className="text-right">
                       <p className="font-black text-gray-900">طلباتي</p>
                       <p className="text-xs text-gray-400 font-bold">تتبع حالة مشترياتك</p>
                    </div>
                 </div>
                 <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
              </Link>

              <Link href="/notifications" className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                       <Bell size={24} />
                    </div>
                    <div className="text-right">
                       <p className="font-black text-gray-900">التنبيهات</p>
                       <p className="text-xs text-gray-400 font-bold">العروض الخاصة والأخبار</p>
                    </div>
                 </div>
                 <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
              </Link>
           </div>
        </div>

        {/* Store Info */}
        <div className="space-y-6">
           <h2 className="text-xl font-black text-gray-900 mr-4">حول المتجر</h2>
           <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Info className="text-primary" size={20} />
                    <h3 className="font-black text-lg">من نحن</h3>
                 </div>
                 <p className="text-xs opacity-70 leading-relaxed font-medium">
                    {settings.storeDescription || 'ديتيلز هو وجهتك الأولى للحصول على أفضل التفاصيل والمنتجات المختارة بعناية لتناسب ذوقك الرفيع في صنعاء.'}
                 </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                 <div className="flex items-center gap-4 text-xs opacity-70 font-bold">
                    <Phone size={16} className="text-primary" />
                    <span>{settings.supportPhone || 'غير متوفر'}</span>
                 </div>
                 <div className="flex items-center gap-4 text-xs opacity-70 font-bold">
                    <MapPin size={16} className="text-primary" />
                    <span>{settings.address || 'صنعاء، اليمن'}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="flex items-center gap-4 p-8 bg-green-50 rounded-[2.5rem] border border-green-100">
         <ShieldCheck className="text-green-500 flex-shrink-0" size={32} />
         <div className="text-right">
            <h4 className="font-black text-green-700">أمان حسابك</h4>
            <p className="text-xs text-green-600 font-medium">بياناتك الشخصية وطلباتك محمية ببروتوكولات أمان متقدمة ومشفرة تماماً.</p>
         </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
