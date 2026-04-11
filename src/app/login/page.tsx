'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('تم تسجيل الدخول بنجاح!');
      router.push('/');
    } catch (error: any) {
      toast.error('لم يتم إكمال تسجيل الدخول عبر قوقل');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('مرحباً بعودتك!');
      router.push('/');
    } catch (error: any) {
      toast.error('خطأ في تسجيل الدخول. يرجى التأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent px-4 py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>

      <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl shadow-primary/10 overflow-hidden border border-gray-100 relative z-10 transition-all">
        <div className="p-10 md:p-14">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-primary tracking-tighter mb-4">DETAILS</h1>
            <p className="text-gray-500 font-bold font-cairo">سجل دخولك بلمسة واحدة لتبدأ تجربة ديتيلز</p>
          </div>

          <div className="space-y-4">
             <button 
               onClick={handleGoogleLogin}
               disabled={loading}
               className="w-full bg-white border-2 border-gray-100 text-gray-700 font-black py-5 rounded-[2rem] flex items-center justify-center gap-4 hover:border-primary/30 transition-all shadow-sm hover:shadow-xl active:scale-95 disabled:opacity-50 font-cairo"
             >
                <svg className="w-6 h-6" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                المتابعة باستخدام قوقل
             </button>

             <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-[1px] bg-gray-100"></div>
                <span className="text-gray-400 text-xs font-bold font-cairo whitespace-nowrap">أو الإيميل مباشرة</span>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pr-12 pl-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm"
                      placeholder="بريدك الإلكتروني"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 pr-12 pl-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm"
                      placeholder="كلمة المرور"
                    />
                  </div>
                  <div className="text-left px-2">
                     <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                        نسيت كلمة المرور؟
                     </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-5 flex items-center justify-center gap-3 text-lg group disabled:opacity-50 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all font-cairo"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      دخول مباشر
                      <ArrowRight size={22} className="group-hover:translate-x-[-4px] transition-transform" />
                    </>
                  )}
                </button>
             </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm font-bold font-cairo">
              ليس لديك حساب؟{' '}
              <Link href="/register" className="text-primary hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
