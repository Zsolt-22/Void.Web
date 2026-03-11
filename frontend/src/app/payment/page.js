'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const PaymentScreen = () => {
  const { shippingAddress, savePaymentMethod } = useCart();
  const { userInfo } = useAuth();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/payment');
    } else if (!shippingAddress.address) {
      router.push('/shipping');
    }
  }, [userInfo, shippingAddress, router]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    router.push('/placeorder');
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-8">
        <div className="flex items-center text-sm font-medium">
          <span className="text-gray-400">Teslimat</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">Ödeme</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-400">Sipariş Ver</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-wide">Ödeme Yöntemi</h1>
      
      <form onSubmit={submitHandler}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Yöntem Seçin</h2>
          
          <div className="flex items-center mb-4">
            <input
              id="paypal"
              name="paymentMethod"
              type="radio"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="paypal" className="ml-3 block text-gray-700 font-medium">
              PayPal veya Kredi Kartı
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="stripe"
              name="paymentMethod"
              type="radio"
              value="Stripe"
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="stripe" className="ml-3 block text-gray-700 font-medium">
              Stripe
            </label>
          </div>
        </div>

        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition"
          type="submit"
        >
          Siparişe Devam Et
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;
