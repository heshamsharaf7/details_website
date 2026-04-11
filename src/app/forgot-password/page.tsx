'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('تم إرسال رابط استعادة كلمة المرور');
    } catch (error: any) {
      toast.error('حدث خطأ. تأكد من صحة البريد الإلكتروني.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent px-4 py-20">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-primary/10 overflow-hidden border border-gray-100 p-8 md:p-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 font-bold text-sm"
        >
          <ChevronLeft size={18} /> العودة
        </button>

        {!sent ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">نسيت كلمة المرور؟</h1>
              <p className="text-gray-500 font-medium">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة حسابك</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-5 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    إرسال الرابط
                    <ArrowRight size={20} className="mr-2 group-hover:translate-x-[-4px] transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8 space-y-6 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">تحقق من بريدك!</h2>
              <p className="text-gray-500 font-medium font-cairo">
                لقد أرسلنا تعليمات استعادة كلمة المرور إلى <span className="text-primary font-bold">{email}</span>
              </p>
            </div>
            <Link href="/login" className="block text-primary font-black hover:underline">
               العودة لتسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
