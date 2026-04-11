'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToNotifications, Notification } from '@/lib/firestore';
import { Bell, BellOff, Calendar, ChevronLeft, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?redirect=/notifications');
      return;
    }

    const unsub = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
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

  if (notifications.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <BellOff size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900">لا توجد تنبيهات</h1>
        <p className="text-gray-500 max-w-md font-medium">
          عندما نقوم بإرسال عروض خاصة أو تحديثات حول طلباتك، ستجدها هنا.
        </p>
        <Link href="/" className="btn-primary flex items-center gap-2">
           العودة للرئيسية <ChevronLeft size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-4">
          التنبيهات <Bell className="text-primary" size={32} />
        </h1>
        <span className="bg-primary/10 text-primary font-black px-4 py-1 rounded-full text-xs">
          {notifications.length} تنبيه جديد
        </span>
      </div>

      <div className="space-y-6">
        {notifications.map((notif) => (
          <div 
            key={notif.id} 
            className="group bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-primary/5 flex gap-6 items-start transition-all hover:border-primary/20 hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
               {notif.topic === 'all' ? <Sparkles size={24} /> : <MessageSquare size={24} />}
            </div>
            
            <div className="flex-1 space-y-3">
               <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-lg text-gray-900">{notif.title}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold whitespace-nowrap bg-gray-50 px-3 py-1 rounded-full">
                     <Calendar size={12} />
                     {notif.sentAt.toLocaleDateString('ar-SA')}
                  </div>
               </div>
               <p className="text-gray-600 font-medium leading-relaxed">
                  {notif.body}
               </p>
               
               <div className="pt-2 flex items-center gap-2 text-primary font-black text-[10px] uppercase">
                  <span>تم الإرسال بواسطة: {notif.sentBy || 'إدارة ديتيلز'}</span>
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  <span>{notif.topic === 'all' ? 'عام' : 'خاص'}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
