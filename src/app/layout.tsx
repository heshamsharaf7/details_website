import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";


const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Details | Sanaa - متجر ديتيلز صنعاء",
  description: "متجر ديتيلز صنعاء - أفضل المنتجات والعروض الحصرية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-cairo bg-white text-gray-900 antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
            <Toaster

              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: 'var(--font-cairo)',
                  direction: 'rtl',
                  borderRadius: '16px',
                  padding: '12px 20px',
                },
                success: {
                  style: { background: '#2E7D32', color: '#fff' },
                  iconTheme: { primary: '#fff', secondary: '#2E7D32' },
                },
                error: {
                  style: { background: '#E53935', color: '#fff' },
                  iconTheme: { primary: '#fff', secondary: '#E53935' },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
