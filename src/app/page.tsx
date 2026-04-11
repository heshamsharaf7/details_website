'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getBanners, 
  getCategories, 
  getOfferProducts, 
  getLatestProducts, 
  getPackages,
  Category,
  Product,
  Package,
  Banner
} from '@/lib/firestore';
import SectionHeader from '@/components/SectionHeader';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, ChevronLeft, Sparkles, Tag, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bn, cat, off, lat, pkg] = await Promise.all([
          getBanners(),
          getCategories(),
          getOfferProducts(),
          getLatestProducts(8),
          getPackages()
        ]);
        setBanners(bn);
        setCategories(cat);
        setOffers(off);
        setLatest(lat);
        setPackages(pkg);
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Simple auto-slide for banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="flex flex-col gap-12 pb-20 max-w-7xl mx-auto w-full px-4 md:px-8 mt-4">
        <div className="h-[250px] md:h-[500px] bg-gray-100 animate-pulse rounded-[2.5rem] md:rounded-[3rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-48 bg-gray-100 animate-pulse rounded-[2rem] md:rounded-[3rem]" />
           <div className="h-48 bg-gray-100 animate-pulse rounded-[2rem] md:rounded-[3rem]" />
           <div className="h-48 bg-gray-100 animate-pulse rounded-[2rem] md:rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-16 pb-20">
      {/* 1. Hero Slider */}
      <section className="relative h-[300px] md:h-[500px] w-full overflow-hidden md:rounded-[3.5rem] max-w-7xl mx-auto md:mt-4 shadow-2xl">
        {banners.length > 0 ? (
          <>
            {banners.map((banner, index) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
              >
                <Image 
                  src={banner.imageUrl} 
                  alt={banner.title || 'Slide'}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-16">
                  {banner.title && (
                    <h2 className="text-2xl md:text-5xl font-black text-white mb-4 max-w-2xl drop-shadow-xl leading-tight">
                      {banner.title}
                    </h2>
                  )}
                  {banner.link && (
                    <Link 
                      href={banner.link}
                      className="btn-primary w-fit text-sm md:text-lg px-6 py-3 md:px-10 md:py-4 shadow-lg shadow-primary/20"
                    >
                      تسوق الآن 
                    </Link>
                  )}
                </div>
              </div>
            ))}
            
            {/* Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {banners.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentBanner(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentBanner ? 'w-10 bg-white shadow-lg' : 'w-2 bg-white/40'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#C08B7A] to-[#A67566] flex flex-col items-center justify-center text-white text-center p-8">
            <Sparkles size={48} className="mb-4 opacity-50 md:w-16 md:h-16" />
            <h2 className="text-2xl md:text-5xl font-black mb-2 tracking-tighter">مرحباً بك في ديتيلز</h2>
            <p className="text-sm md:text-xl text-white/90 font-medium">اكتشف أحدث التفاصيل والمنتجات المختارة</p>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 space-y-16 md:space-y-32">
        
        {/* 2. Packages Section */}
        {packages.length > 0 && (
          <section className="bg-zinc-900 px-6 py-12 md:py-20 md:px-14 rounded-[3rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="relative z-10">
              <SectionHeader 
                title="البكجات المتكاملة" 
                subtitle="توفير أكثر مع مجموعاتنا المختارة بعناية" 
                href="/packages"
                isDark
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {packages.slice(0, 3).map(pkg => (
                  <ProductCard key={pkg.id} item={pkg} type="package" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. Exclusive Offers */}
        {offers.length > 0 && (
          <section className="bg-primary/5 px-6 py-12 md:py-20 md:px-14 rounded-[3rem] md:rounded-[4rem] border border-primary/10 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="relative z-10">
              <SectionHeader 
                title="عروض حصرية" 
                subtitle="أقوى التخفيضات لفترة محدودة" 
                href="/offers" 
              />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
                {offers.slice(0, 4).map(product => (
                  <ProductCard key={product.id} item={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. Categories Section */}
        <section>
          <SectionHeader title="تسوق بالأقسام" subtitle="تصفح تشكيلة واسعة من الفئات" />
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-6 lg:grid-cols-8 md:gap-8">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* 5. Latest Products */}
        <section>
          <SectionHeader 
            title="وصلنا حديثاً" 
            subtitle="آخر الموضات والمنتجات المميزة" 
            href="/products" 
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {latest.map(product => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 md:py-24 border-t border-gray-100">
           <div className="flex flex-col items-center text-center gap-5 group">
             <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-gray-100/50">
               <ShoppingBag size={32} />
             </div>
             <div className="space-y-2">
                <h3 className="font-black text-xl">توصيل سريع</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">نضمن لك وصول طلبك في أسرع وقت لباب بيتك بكافة المحافظات</p>
             </div>
           </div>
           <div className="flex flex-col items-center text-center gap-5 group">
             <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-gray-100/50">
               <Tag size={32} />
             </div>
             <div className="space-y-2">
                <h3 className="font-black text-xl">أفضل الأسعار</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">عروض حصرية وأسعار تنافسية مدروسة بعناية لتناسب ميزانيتك</p>
             </div>
           </div>
           <div className="flex flex-col items-center text-center gap-5 group">
             <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-gray-100/50">
               <Sparkles size={32} />
             </div>
             <div className="space-y-2">
                <h3 className="font-black text-xl">جودة مضمونة</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">كافة منتجاتنا أصلية وتخضع لمراقبة جودة صارمة قبل الشحن</p>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
}
