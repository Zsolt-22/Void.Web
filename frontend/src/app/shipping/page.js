'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ShippingScreen = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const { userInfo } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
  }, [userInfo, router]);

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    router.push('/payment');
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* Checkout Steps visualization could go here */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center text-sm font-medium">
          <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">Teslimat</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-400">Ödeme</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-400">Sipariş Ver</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-wide">Teslimat Adresi</h1>
      
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Adres
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            id="address"
            type="text"
            placeholder="Adresi girin"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
            Şehir
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            id="city"
            type="text"
            placeholder="Şehri girin"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
            Posta Kodu
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            id="postalCode"
            type="text"
            placeholder="Posta kodunu girin"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Ülke
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            id="country"
            type="text"
            placeholder="Ülkeyi girin"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
          type="submit"
        >
          Ödemeye Devam Et
        </button>
      </form>
    </div>
  );
};

export default ShippingScreen;
