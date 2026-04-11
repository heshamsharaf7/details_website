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
        <div className="h-[300px] md:h-[500px] bg-gray-100 animate-pulse rounded-[3rem]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="h-64 bg-gray-100 animate-pulse rounded-[3rem]" />
           <div className="h-64 bg-gray-100 animate-pulse rounded-[3rem]" />
           <div className="h-64 bg-gray-100 animate-pulse rounded-[3rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* 1. Hero Slider */}
      <section className="relative h-[300px] md:h-[500px] w-full overflow-hidden md:rounded-[3rem] max-w-7xl mx-auto md:mt-4 shadow-xl">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16">
                  {banner.title && (
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 max-w-2xl drop-shadow-lg">
                      {banner.title}
                    </h2>
                  )}
                  {banner.link && (
                    <Link 
                      href={banner.link}
                      className="btn-primary w-fit text-lg px-8 py-4"
                    >
                      تسوق الآن
                    </Link>
                  )}
                </div>
              </div>
            ))}
            
            {/* Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentBanner(i)}
                    className={`h-1.5 rounded-full transition-all ${i === currentBanner ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center text-white text-center p-8">
            <Sparkles size={64} className="mb-4 opacity-50" />
            <h2 className="text-4xl font-black mb-2 tracking-tighter">مرحباً بك في ديتيلز</h2>
            <p className="text-xl text-white/80 font-medium">اكتشف أحدث التفاصيل والمنتجات المختارة</p>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 space-y-20">
        
        {/* 2. Packages Section (Requested at top) */}
        {packages.length > 0 && (
          <section className="bg-zinc-900 -mx-4 px-4 py-16 md:mx-0 md:px-10 md:rounded-[3.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <SectionHeader 
              title="البكجات المتكاملة" 
              subtitle="توفير أكثر مع مجموعاتنا المختارة بعناية" 
              href="/packages"
              isDark
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.slice(0, 3).map(pkg => (
                <div key={pkg.id} className="relative group">
                   <ProductCard item={pkg} type="package" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Exclusive Offers */}
        {offers.length > 0 && (
          <section className="bg-primary/5 -mx-4 px-4 py-16 md:mx-0 md:px-10 md:rounded-[3.5rem] border border-primary/10 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
            <SectionHeader 
              title="عروض حصرية" 
              subtitle="أقوى التخفيضات لفترة محدودة" 
              href="/offers" 
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {offers.slice(0, 4).map(product => (
                <ProductCard key={product.id} item={product} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Categories Section */}
        <section>
          <SectionHeader title="تسوق بالأقسام" subtitle="تصفح تشكيلة واسعة من الفئات" />
          <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-6 lg:grid-cols-8">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {latest.map(product => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-t border-gray-100">
           <div className="flex flex-col items-center text-center gap-4 group">
             <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
               <ShoppingBag size={32} />
             </div>
             <div className="space-y-2">
                <h3 className="font-black text-xl">توصيل سريع</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">نضمن لك وصول طلبك في أسرع وقت ممكن لباب بيتك بكافة المحافظات</p>
             </div>
           </div>
           <div className="flex flex-col items-center text-center gap-4 group">
             <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
               <Tag size={32} />
             </div>
             <div className="space-y-2">
                <h3 className="font-black text-xl">أفضل الأسعار</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">عروض حصرية وأسعار تنافسية مدروسة بعناية لتناسب ميزانيتك</p>
             </div>
           </div>
           <div className="flex flex-col items-center text-center gap-4 group">
             <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
               <Sparkles size={32} />
             </div>
             <div className="space-y-2">
                <h3 className="font-black text-xl">جودة مضمونة</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">كافة منتجاتنا أصلية وتخضع لمراقبة جودة صارمة قبل الشحن</p>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
}


