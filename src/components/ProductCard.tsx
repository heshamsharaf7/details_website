import Link from 'next/link';
import Image from 'next/image';
import { Product, Package } from '@/lib/firestore';
import { useCart, formatPrice } from '@/contexts/CartContext';
import { Plus, Heart } from 'lucide-react';

interface ProductCardProps {
  item: Product | Package;
  type?: 'product' | 'package';
}

export default function ProductCard({ item, type = 'product' }: ProductCardProps) {
  const { addItem, selectedCurrency } = useCart();
  
  const isPackage = type === 'package' || 'items' in item;
  const href = isPackage ? `/package/${item.id}` : `/product/${item.id}`;
  
  const mainImage = item.imageUrls?.[0] || '';
  const hasOffer = item.isOnOffer && item.offerPrices;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPackage) {
      addItem(item as Product, 1, selectedCurrency);
    } else {
      // For packages, we usually go to details for selection or add directly
      // Here we link to detail page as packages might have more options
      window.location.href = href;
    }
  };

  return (
    <Link href={href} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm card-hover border border-gray-100 p-2 h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50">
        {mainImage ? (
          <Image 
            src={mainImage} 
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <span className="text-4xl">📸</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {item.isOnOffer && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
              عرض خاص
            </span>
          )}
          {(!isPackage && (item as Product).isInstantDelivery) && (
            <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
              توصيل فوري
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <button className="absolute top-3 left-3 w-8 h-8 rounded-full glass flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={16} />
        </button>

        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-all translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-sm md:text-base leading-tight">
          {item.name}
        </h3>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            {hasOffer ? (
              <>
                <span className="text-primary font-black text-lg leading-none">
                  {formatPrice(item.offerPrices!, selectedCurrency)}
                </span>
                <span className="text-gray-400 text-xs line-through mt-1">
                  {formatPrice(item.prices, selectedCurrency)}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-black text-lg leading-none">
                {formatPrice(item.prices, selectedCurrency)}
              </span>
            )}
          </div>
          
          {isPackage && (
            <span className="text-[10px] font-bold text-primary bg-primary-light/20 px-2 py-1 rounded-lg">
              {(item as Package).numPieces} قطع
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
