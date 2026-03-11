import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './globals.css';

export const metadata = {
  title: 'Void Store | Best Products Online',
  description: 'Find the best electronics, gadgets, and gear to supercharge your life.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 w-full bg-gray-50 pb-12">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
