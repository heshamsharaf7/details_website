'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, CreditCard, ChevronLeft, HelpCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { getPolicies, getStoreSettings, Policy, StoreSettings } from '@/lib/firestore';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const pData = await getPolicies();
      const sData = await getStoreSettings();
      setPolicies(pData);
      setSettings(sData as StoreSettings);
      setLoading(false);
    }
    loadData();
  }, []);

  // Icon mapping helper
  const getIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'truck': return Truck;
      case 'rotateccw': return RotateCcw;
      case 'creditcard': return CreditCard;
      case 'lock': return Lock;
      case 'shield': return ShieldCheck;
      default: return HelpCircle;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-8 w-32 bg-gray-100 rounded-lg mx-auto md:mx-0" />
        <div className="h-20 w-full bg-gray-100 rounded-[2.5rem]" />
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 w-full bg-gray-100 rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 animate-in fade-in duration-700">
      <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-10 font-bold text-sm">
        <ChevronLeft size={18} /> العودة للرئيسية
      </Link>

      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">سياسات ديتيلز</h1>
        <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed font-cairo">
          نحن هنا لنضمن لك تجربة تسوق آمنة وشفافة. يرجى الاطلاع على قوانين وسياسات المتجر الموضحة أدناه.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Main Store Policies from Settings Model */}
        {settings?.storePolicies && (
           <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary/5 flex flex-col md:row gap-8 items-start hover:border-primary/20 transition-all group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                 <Info size={32} />
              </div>
              <div className="space-y-4 w-full">
                 <h3 className="text-2xl font-black text-gray-900">شروط واساسيات المتجر</h3>
                 <div 
                   className="text-gray-600 leading-loose font-medium font-cairo whitespace-pre-wrap text-sm md:text-base bg-gray-50/50 p-6 rounded-3xl"
                   dangerouslySetInnerHTML={{ __html: settings.storePolicies.replace(/\n/g, '<br/>') }}
                 />
              </div>
           </div>
        )}

        {/* Structured Policies Collection */}
        {policies.length > 0 && policies.map((p) => {
          const IconComponent = getIcon(p.icon);
          return (
            <div key={p.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-primary/5 flex flex-col md:flex-row gap-8 items-start hover:border-primary/20 transition-all group">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                 <IconComponent size={32} />
              </div>
              <div className="space-y-4">
                 <h3 className="text-2xl font-black text-gray-900">{p.title}</h3>
                 <div 
                   className="text-gray-600 leading-loose font-medium font-cairo whitespace-pre-wrap"
                   dangerouslySetInnerHTML={{ __html: p.content }}
                 />
              </div>
            </div>
          );
        })}

        {!settings?.storePolicies && policies.length === 0 && (
          <div className="bg-gray-50 p-12 rounded-[3rem] text-center space-y-4 border-2 border-dashed border-gray-200">
             <HelpCircle className="mx-auto text-gray-400" size={48} />
             <h3 className="text-xl font-black text-gray-500">لا توجد سياسات مضافة حالياً</h3>
             <p className="text-gray-400 font-medium">سيتم إضافة تفاصيل السياسات والشروط قريباً.</p>
          </div>
        )}
      </div>

      <div className="mt-20 p-10 bg-zinc-900 rounded-[3rem] text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <ShieldCheck className="text-primary mx-auto" size={48} />
        <h2 className="text-2xl font-black text-white">هل لديك استفسار آخر؟</h2>
        <p className="text-gray-500 font-medium max-w-md mx-auto font-cairo text-sm">
          فريق خدمة العملاء جاهز للرد على كافة استفساراتكم وتلقي ملاحظاتكم لتحسين خدماتنا.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
           {settings?.supportPhone && (
              <a href={`tel:${settings.supportPhone}`} className="btn-primary px-10 py-4 shadow-xl shadow-primary/20 hover:scale-105 transition-all">اتصل بنا</a>
           )}
           {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp}`} className="bg-green-600 text-white font-black px-10 py-4 rounded-full shadow-xl shadow-green-600/20 hover:scale-105 transition-all">واتساب</a>
           )}
        </div>
      </div>
    </div>
  );
}
