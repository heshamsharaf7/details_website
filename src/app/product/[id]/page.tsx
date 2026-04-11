'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProductById, Product } from '@/lib/firestore';
import { useCart, formatPrice } from '@/contexts/CartContext';
import { ShoppingCart, Heart, Share2, ShieldCheck, Truck, RefreshCcw, Minus, Plus, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem, selectedCurrency } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const p = await getProductById(id as string);
      setProduct(p);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">المنتج غير موجود</h2>
        <button onClick={() => router.back()} className="btn-primary">العودة للخلف</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity, selectedCurrency);
    toast.success('تمت إضافة المنتج للسلة');
  };

  const hasOffer = product.isOnOffer && product.offerPrices;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-700">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-bold"
      >
        <ChevronLeft size={20} /> العودة
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-inner border border-gray-100">
            {product.imageUrls?.[selectedImage] ? (
              <Image 
                src={product.imageUrls[selectedImage]} 
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200">
                <span className="text-6xl">📸</span>
              </div>
            )}
            
            {product.isOnOffer && (
              <div className="absolute top-6 right-6 bg-red-500 text-white font-black px-4 py-2 rounded-full shadow-lg">
                عرض خاص
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {product.imageUrls.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === i ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-70'}`}
                >
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4">
              {hasOffer ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-primary">
                    {formatPrice(product.offerPrices!, selectedCurrency)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.prices, selectedCurrency)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-black text-gray-900">
                  {formatPrice(product.prices, selectedCurrency)}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 bg-accent/50 rounded-3xl border border-gray-100">
            <p className="text-gray-600 leading-relaxed font-medium whitespace-pre-line">
              {product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
            </p>
          </div>

          {/* Quantity and Cart */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex items-center gap-6">
              <span className="font-bold text-gray-700">الكمية:</span>
              <div className="flex items-center bg-white rounded-full border border-gray-200 p-1 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-5 flex items-center justify-center gap-3 text-lg shadow-primary/20"
              >
                <ShoppingCart size={24} /> إضافة للسلة
              </button>
              <button className="w-16 h-16 flex items-center justify-center rounded-3xl border-2 border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
                <Heart size={24} />
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
            <div className="flex flex-col items-center gap-2 text-center">
              <ShieldCheck className="text-primary" size={24} />
              <span className="text-[10px] font-bold text-gray-500">جودة أصلية</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Truck className="text-primary" size={24} />
              <span className="text-[10px] font-bold text-gray-500">توصيل لكافة المحافظات</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <RefreshCcw className="text-primary" size={24} />
              <span className="text-[10px] font-bold text-gray-500">استبدال سهل</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Share2 className="text-primary" size={24} />
              <span className="text-[10px] font-bold text-gray-500">مشاركة المنتج</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
