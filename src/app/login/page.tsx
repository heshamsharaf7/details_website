'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/contexts/SettingsContext';
import Image from 'next/image';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();
  
  const { loginWithGoogle, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      toast.success('تم تسجيل الدخول بنجاح!');
      router.push('/');
    } catch (err: any) {
      console.error('Google Login Error:', err);
      const msg = err.code === 'auth/popup-closed-by-user' 
        ? 'تم إغلاق نافذة الدخول قبل الإكمال' 
        : 'فشل تسجيل الدخول. تأكد من تفعيل نطاق الموقع في إعدادات Firebase.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-primary/5 overflow-hidden border border-gray-100 relative z-10 p-10 md:p-14 text-center">
        
        {/* Logo Area */}
        <div className="text-center mb-10 space-y-4">
          {(settings?.app_logo || settings?.logoUrl) ? (
            <div className="relative w-20 h-20 mx-auto">
               <Image src={settings.app_logo || settings.logoUrl || ''} alt={settings.storeName || 'Logo'} fill className="object-contain" />
            </div>
          ) : (
            <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">Details</h1>
          )}
          <p className="text-gray-500 font-black font-cairo text-sm leading-relaxed">
            سجل دخولك بلمسة واحدة <br/> لتبدأ تجربة ديتيلز
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
             <AlertCircle size={20} className="flex-shrink-0" />
             <p className="text-xs font-black text-right">{error}</p>
          </div>
        )}

        <div className="space-y-6">
           <button 
             onClick={handleGoogleLogin}
             disabled={loading}
             className="w-full bg-white border-2 border-gray-100 text-gray-700 font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 hover:border-primary/30 transition-all shadow-sm hover:shadow-xl active:scale-95 disabled:opacity-50 font-cairo"
           >
              {loading ? (
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  تسجيل الدخول عبر البريد الإلكتروني
                </>
              )}
           </button>
           
           <p className="text-[10px] text-gray-400 font-bold px-4">
             من خلال المتابعة، فإنك توافق على سياسات الخصوصية وشروط الاستخدام الخاصة بمتجر ديتيلز
           </p>
        </div>

      </div>
    </div>
  );
}
