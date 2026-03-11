'use client';

import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CartScreen = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const router = useRouter();

  const checkoutHandler = () => {
    router.push('/login?redirect=/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 uppercase tracking-wide">Alışveriş Sepeti</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-blue-700">
            Sepetiniz boş.{' '}
            <Link href="/" className="font-semibold underline hover:text-blue-800">
              Geri Dön
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <ul className="divide-y divide-gray-200 border-t border-gray-200">
              {cartItems.map((item) => (
                <li key={item._id} className="py-6 flex items-center">
                  <div className="flex-shrink-0 w-24 h-24 relative rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link href={`/product/${item._id}`} className="hover:text-indigo-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="ml-4">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between mt-4">
                      <div className="flex items-center">
                        <label htmlFor={`qty-${item._id}`} className="mr-2 text-sm text-gray-600">Adet:</label>
                        <select
                          id={`qty-${item._id}`}
                          className="border border-gray-300 rounded p-1"
                          value={item.qty}
                          onChange={(e) => addToCart(item, Number(e.target.value))}
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id)}
                        className="font-medium text-red-600 hover:text-red-500 flex items-center"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Kaldır
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:w-1/3">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Ara Toplam ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}) ürün
              </h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </p>
              
              <button
                type="button"
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Ödemeye Geç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
