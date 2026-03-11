'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Message from '../../components/ui/Message';
import Loader from '../../components/ui/Loader';

const PlaceOrderScreen = () => {
  const { cartItems, shippingAddress, paymentMethod, calculatePrices, clearCart } = useCart();
  const { userInfo } = useAuth();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/placeorder');
    } else if (!shippingAddress.address) {
      router.push('/shipping');
    } else if (!paymentMethod) {
      router.push('/payment');
    }
  }, [userInfo, shippingAddress, paymentMethod, router]);

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices();

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(x => ({
            name: x.name,
            qty: x.qty,
            image: x.image,
            price: x.price,
            product: x._id,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error placing order');
      }

      clearCart();
      router.push(`/order/${data._id}`);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <div className="flex items-center text-sm font-medium">
          <span className="text-gray-400">Shipping</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-gray-400">Payment</span>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">Place Order</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 uppercase tracking-wider">Shipping</h2>
            <p className="text-gray-700">
              <strong className="font-medium">Address: </strong>
              {shippingAddress.address}, {shippingAddress.city}{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 uppercase tracking-wider">Payment Method</h2>
            <p className="text-gray-700">
              <strong className="font-medium">Method: </strong>
              {paymentMethod}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 uppercase tracking-wider">Order Items</h2>
            {cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <li key={index} className="py-4 flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link href={`/product/${item._id}`} className="text-indigo-600 hover:underline font-medium">
                        {item.name}
                      </Link>
                    </div>
                    <div className="ml-4 text-gray-700 text-right">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 uppercase tracking-wider">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && <div className="mt-4"><Message variant="danger">{error}</Message></div>}

            <button
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
