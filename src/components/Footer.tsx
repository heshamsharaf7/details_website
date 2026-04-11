'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Globe, Share2, MessageCircle, Smartphone } from 'lucide-react';
import { getStoreSettings, StoreSettings } from '@/lib/firestore';

export default function Footer() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const s = await getStoreSettings();
      setSettings(s as StoreSettings);
    }
    loadSettings();
  }, []);

  if (!settings) return null;

  return (
    <footer className="bg-zinc-900 text-white pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black text-primary tracking-tighter">
              {settings.storeName || 'DETAILS'}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              {settings.storeDescription || 'ديتيلز هو وجهتك الأولى للحصول على أفضل التفاصيل والمنتجات المختارة بعناية لتناسب ذوقك الرفيع في صنعاء.'}
            </p>
            <div className="flex gap-4 text-gray-400">
               {settings.instagram && (
                 <a href={settings.instagram} target="_blank" className="hover:text-primary transition-colors"><Globe size={20} /></a>
               )}
               {settings.facebook && (
                 <a href={settings.facebook} target="_blank" className="hover:text-primary transition-colors"><Share2 size={20} /></a>
               )}
               {settings.whatsapp && (
                 <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="hover:text-primary transition-colors"><MessageCircle size={20} /></a>
               )}
               {settings.tiktok && (
                 <a href={settings.tiktok} target="_blank" className="hover:text-primary transition-colors"><Smartphone size={20} /></a>
               )}
               {settings.website && (
                 <a href={settings.website} target="_blank" className="hover:text-primary transition-colors"><Globe size={18} /></a>
               )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-black">روابط سريعة</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li><Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors">تتبع طلباتي</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors">البكجات العائلية</Link></li>
              <li><Link href="/offers" className="hover:text-primary transition-colors">آخر العروض</Link></li>
              <li><Link href="/policies" className="hover:text-primary transition-colors">سياسات المتجر</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-black">اتصل بنا</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary">
                   <Phone size={16} />
                </div>
                <span>{settings.supportPhone || '77xxxxxxx'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary">
                  <Mail size={16} />
                </div>
                <span>{settings.supportEmail || 'info@details.com'}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary">
                  <MapPin size={16} />
                </div>
                <span>{settings.address || 'صنعاء، اليمن'}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter/Trust */}
          <div className="space-y-6">
             <h3 className="text-lg font-black">لماذا ديتيلز؟</h3>
             <div className="space-y-4">
                <div className="flex gap-3 bg-white/5 p-4 rounded-2xl">
                   <ShieldCheck className="text-primary flex-shrink-0" />
                   <div className="space-y-1">
                      <p className="text-xs font-black">جودة مضمونة</p>
                      <p className="text-[10px] text-gray-500">فحص دقيق لكافة المنتجات</p>
                   </div>
                </div>
                <div className="flex gap-3 bg-white/5 p-4 rounded-2xl">
                   <Truck className="text-primary flex-shrink-0" />
                   <div className="space-y-1">
                      <p className="text-xs font-black">توصيل سريع</p>
                      <p className="text-[10px] text-gray-500">لكافة مناطق صنعاء والمحافظات</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-xs font-bold">
           <p>© 2026 {settings.storeName || 'ديتيلز صنعاء'}. جميع الحقوق محفوظة.</p>
           <div className="flex gap-6">
              <Link href="/policies" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
              <Link href="/policies" className="hover:text-white transition-colors">شروط الاستخدام</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
