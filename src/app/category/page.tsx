'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductsByCategoryId, getCategories, Product, Category } from '@/lib/firestore';
import SectionHeader from '@/components/SectionHeader';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, LayoutGrid, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProductsByCategoryId(id as string)
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        console.error('Error fetching category data:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const currentCategory = categories.find(c => c.id === id);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col gap-12">
        <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-700 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-4 font-bold text-sm"
          >
            <ChevronLeft size={18} /> العودة
          </button>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            {currentCategory?.name || 'القسم'}
          </h1>
          <p className="text-gray-500 font-medium">تم العثور على {products.length} منتج في هذا القسم</p>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl w-full md:w-auto">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white shadow-sm rounded-xl font-bold text-sm">
             <LayoutGrid size={18} className="text-primary" /> عرض الشبكة
           </button>
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-gray-400 font-bold text-sm hover:bg-white transition-all rounded-xl">
             <SlidersHorizontal size={18} /> تصفية
           </button>
        </div>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map(product => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center text-center gap-6">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
             <ShoppingBag size={48} />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">لا توجد منتجات حالياً</h2>
              <p className="text-gray-500 font-medium">ترقبوا قريباً، سنقوم بإضافة منتجات مذهلة في هذا القسم.</p>
           </div>
           <Link href="/" className="btn-primary px-8">استكشف الأقسام الأخرى</Link>
        </div>
      )}
    </div>
  );
}
