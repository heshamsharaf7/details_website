interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  isDark?: boolean;
}


import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SectionHeader({ title, subtitle, href, isDark }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-8 px-4 md:px-0">
      <div className="space-y-1">
        <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
        {subtitle && <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
      </div>

      
      {href && (
        <Link 
          href={href} 
          className="flex items-center gap-1 text-primary font-bold text-sm hover:translate-x-[-4px] transition-transform"
        >
          عرض الكل <ChevronLeft size={16} />
        </Link>
      )}
    </div>
  );
}
