'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Globe, Share2, MessageCircle, Smartphone, ExternalLink } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function Footer() {
  const { settings, developer, loading } = useSettings();

  if (loading || !settings) return null;

  return (
    <footer className="bg-zinc-900 text-white pt-20 pb-8 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
               <div className="relative w-20 h-20 md:w-24 md:h-24">
                 <Image 
                   src={settings?.app_logo || settings?.logoUrl || '/app_logo.jpeg'} 
                   alt={settings?.storeName || 'Logo'} 
                   fill 
                   className="object-contain" 
                 />
               </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-sm">
              {settings.storeDescription || 'ديتيلز هو وجهتك الأولى للحصول على أفضل التفاصيل والمنتجات المختارة بعناية لتناسب ذوقك الرفيع في صنعاء.'}
            </p>
            <div className="flex gap-4">
               {settings.instagram && (
                 <a href={settings.instagram} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Globe size={18} /></a>
               )}
               {settings.facebook && (
                 <a href={settings.facebook} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Share2 size={18} /></a>
               )}
               {settings.whatsapp && (
                 <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><MessageCircle size={18} /></a>
               )}
               {settings.tiktok && (
                 <a href={settings.tiktok} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Smartphone size={18} /></a>
               )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-black relative w-fit after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">روابط هامة</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>الرئيسية</Link></li>
              <li><Link href="/orders" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>تتبع طلباتي</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>البكجات المتكاملة</Link></li>
              <li><Link href="/offers" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>العروض الحصرية</Link></li>
              <li><Link href="/policies" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>سياسات المتجر</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-black relative w-fit after:content-[''] after:absolute after:-bottom-2 after:right-0 after:w-1/2 after:h-1 after:bg-primary after:rounded-full">اتصل بنا</h3>
            <ul className="space-y-5 text-gray-400 text-sm font-bold">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
                    <Phone size={18} />
                </div>
                <div>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">دعم العملاء</p>
                   <p className="text-white">{settings.supportPhone || '77xxxxxxx'}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">البريد الإلكتروني</p>
                   <p className="text-white">{settings.supportEmail || 'info@details.com'}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">الموقع</p>
                   <p className="text-white">{settings.address || 'صنعاء، اليمن'}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Trust Sections */}
          <div className="space-y-6">
             <h3 className="text-lg font-black">جودة ديتيلز</h3>
             <div className="space-y-4">
                <div className="flex gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all duration-500">
                   <ShieldCheck className="text-primary flex-shrink-0" size={24} />
                   <div className="space-y-1">
                      <p className="text-xs font-black">أمان وضمان</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-medium">فحص دقيق لكافة المنتجات قبل الشحن لضمان رضاك</p>
                   </div>
                </div>
                <div className="flex gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all duration-500">
                   <Truck className="text-primary flex-shrink-0" size={24} />
                   <div className="space-y-1">
                      <p className="text-xs font-black">توصيل سريع</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-medium">نخدم كافة مناطق صنعاء مع توفير شحن لكافة المحافظات</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Bottom with Developer Info */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-center md:text-right space-y-2">
              <p className="text-gray-500 text-xs font-bold">© 2026 {settings.storeName || 'ديتيلز صنعاء'}. جميع الحقوق محفوظة.</p>
           </div>

           {developer && (
             <div className="flex items-center gap-4 bg-white/5 p-1 pl-6 rounded-full border border-white/5 hover:border-primary/20 transition-all group">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black text-lg">
                   {developer.name.charAt(0)}
                </div>
                <div className="text-right">
                   <p className="text-[9px] text-gray-500 font-black uppercase tracking-wider">تم التطوير بواسطة</p>
                   <div className="flex items-center gap-2">
                      <p className="text-gray-200 text-xs font-black tracking-tighter">{developer.name}</p>
                      {developer.website && (
                        <a href={developer.website} target="_blank" className="text-primary opacity-50 group-hover:opacity-100 transition-opacity">
                           <ExternalLink size={12} />
                        </a>
                      )}
                   </div>
                </div>
             </div>
           )}

           <div className="flex gap-8 text-gray-500 text-xs font-bold">
              <Link href="/policies" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
              <Link href="/policies" className="hover:text-primary transition-colors">شروط الخدمة</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
