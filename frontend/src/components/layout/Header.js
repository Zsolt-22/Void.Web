'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

const Header = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const cartCount = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/?keyword=${keyword}`);
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-purple-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              Void<span className="text-purple-300"> Store</span>
            </Link>
          </div>

          <form onSubmit={submitHandler} className="hidden lg:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              name="q"
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full px-4 py-1 text-gray-900 rounded-l-md focus:outline-none"
            />
            <button type="submit" className="bg-purple-700 px-4 py-1 flex items-center justify-center rounded-r-md hover:bg-purple-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/cart" className="flex items-center hover:text-purple-300 transition">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Sepet
              {cartCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center hover:text-purple-300 transition focus:outline-none"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userInfo.name}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                      Profil
                    </Link>
                    {userInfo.isAdmin && (
                      <>
                        <div className="border-t border-gray-100"></div>
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Yönetici</div>
                        <Link href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Panel</Link>
                        <Link href="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Kullanıcılar</Link>
                        <Link href="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Ürünler</Link>
                        <Link href="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Siparişler</Link>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="flex items-center hover:text-purple-300 transition">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Giriş Yap
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-purple-300 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-950">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/cart" className="block px-3 py-2 rounded-md hover:bg-purple-800">
              Sepet {cartCount > 0 && `(${cartCount})`}
            </Link>
            {userInfo ? (
              <>
                <Link href="/profile" className="block px-3 py-2 rounded-md hover:bg-purple-800">Profil</Link>
                {userInfo.isAdmin && (
                  <>
                    <Link href="/admin/userlist" className="block px-3 py-2 rounded-md hover:bg-purple-800 text-purple-300">Admin: Kullanıcılar</Link>
                    <Link href="/admin/productlist" className="block px-3 py-2 rounded-md hover:bg-purple-800 text-purple-300">Admin: Ürünler</Link>
                    <Link href="/admin/orderlist" className="block px-3 py-2 rounded-md hover:bg-purple-800 text-purple-300">Admin: Siparişler</Link>
                  </>
                )}
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md hover:bg-purple-800">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 rounded-md hover:bg-purple-800">Giriş Yap</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
