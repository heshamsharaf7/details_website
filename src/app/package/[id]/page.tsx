'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getPackageById, Package } from '@/lib/firestore';
import { useCart, formatPrice } from '@/contexts/CartContext';
import { ShoppingCart, Package as PackageIcon, ShieldCheck, Truck, ChevronLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PackageDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem, selectedCurrency } = useCart();
  
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchPackage() {
      if (!id) return;
      const p = await getPackageById(id as string);
      setPkg(p);
      setLoading(false);
    }
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">البكج غير موجود</h2>
        <button onClick={() => router.back()} className="btn-primary">العودة للخلف</button>
      </div>
    );
  }

  // Note:addItem in CartContext currently expects a Product type. 
  // We need to either update CartContext to handle Package or cast it.
  // Since they share most fields, I'll update CartContext later if needed.
  // For now I'll just show a message.
  const handleAddToCart = () => {
    if (pkg) {
      addItem(pkg, 1, selectedCurrency);
      toast.success('تمت إضافة البكج للسلة');
    }
  };


  const hasOffer = pkg.isOnOffer && pkg.offerPrices;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-700">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-bold"
      >
        <ChevronLeft size={20} /> العودة
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-zinc-900 shadow-2xl">
            {pkg.imageUrls?.[selectedImage] ? (
              <Image 
                src={pkg.imageUrls[selectedImage]} 
                alt={pkg.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-800">
                <PackageIcon size={80} />
              </div>
            )}
            
            <div className="absolute top-6 left-6 bg-primary text-white font-black px-6 py-2 rounded-2xl shadow-lg">
               بكج توفيري
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {pkg.imageUrls?.map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === i ? 'border-primary scale-105' : 'border-transparent opacity-50'}`}
              >
                <Image src={img} alt={`${pkg.name} ${i}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <span className="inline-block bg-primary/10 text-primary font-black px-4 py-1 rounded-full text-xs">
              {pkg.numPieces} قطع متكاملة
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tighter">
              {pkg.name}
            </h1>
            
            <div className="flex items-center gap-4">
              {hasOffer ? (
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-primary">
                    {formatPrice(pkg.offerPrices!, selectedCurrency)}
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    {formatPrice(pkg.prices, selectedCurrency)}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-black text-gray-900">
                  {formatPrice(pkg.prices, selectedCurrency)}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 bg-zinc-50 rounded-3xl border border-gray-100">
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <PackageIcon size={20} className="text-primary" /> محتويات البكج:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                   <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={18} />
                   <div className="flex flex-col">
                     <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                     <span className="text-gray-500 text-[10px] mt-1">{item.details}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed font-medium">
              {pkg.description}
            </p>
            
            <button 
              onClick={handleAddToCart}
              className="w-full btn-primary py-6 flex items-center justify-center gap-3 text-xl shadow-primary/30"
            >
              <ShoppingCart size={28} /> طلب البكج الآن
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
               <ShieldCheck className="text-primary" />
               <span className="text-xs font-bold text-gray-700">ضمان استرجاع</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
               <Truck className="text-primary" />
               <span className="text-xs font-bold text-gray-700">توصيل مجاني لبابك</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
