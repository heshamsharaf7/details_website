import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/firestore';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link 
      href={`/category/${category.id}`}
      className="group flex flex-col items-center gap-3 transition-transform active:scale-95"
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-accent border-2 border-transparent group-hover:border-primary transition-colors shadow-sm">
        {(category.iconUrl || category.imageUrl) ? (
          <Image 
            src={category.iconUrl || category.imageUrl || ''} 
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-4xl">{category.icon || '📦'}</span>
          </div>
        )}
      </div>
      <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">
        {category.name}
      </span>
    </Link>
  );
}
