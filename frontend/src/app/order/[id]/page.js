'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Message from '../../../components/ui/Message';
import Loader from '../../../components/ui/Loader';
import { use } from 'react';

const OrderScreen = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const { userInfo } = useAuth();
  
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${resolvedParams.id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Sipariş bulunamadı');
        }
        
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [resolvedParams.id, userInfo, router, loadingPay, loadingDeliver]);

  const successPaymentHandler = async () => {
    try {
      setLoadingPay(true);
      const res = await fetch(`http://localhost:5000/api/orders/${resolvedParams.id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          id: 'test_transaction_id', // Mocked for this demo
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        }),
      });

      if (!res.ok) {
        throw new Error('Payment failed');
      }

      setLoadingPay(false);
    } catch (err) {
      console.error(err);
      setLoadingPay(false);
    }
  };

  const deliverHandler = async () => {
    try {
      setLoadingDeliver(true);
      const res = await fetch(`http://localhost:5000/api/orders/${resolvedParams.id}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Delivery update failed');
      }

      setLoadingDeliver(false);
    } catch (err) {
      console.error(err);
      setLoadingDeliver(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="max-w-7xl mx-auto py-8 px-4"><Message variant="danger">{error}</Message></div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide">Sipariş {order._id}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 uppercase tracking-wider">Teslimat</h2>
            <p className="text-gray-700 mb-2">
              <strong className="font-medium">İsim: </strong> {order.user.name}
            </p>
            <p className="text-gray-700 mb-4">
              <strong className="font-medium">E-posta: </strong>{' '}
              <a href={`mailto:${order.user.email}`} className="text-indigo-600 hover:underline">{order.user.email}</a>
            </p>
            <p className="text-gray-700 mb-4">
              <strong className="font-medium">Adres: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message variant="success">Teslim edildi: {order.deliveredAt.substring(0, 10)}</Message>
            ) : (
              <Message variant="danger">Teslim edilmedi</Message>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 uppercase tracking-wider">Ödeme Yöntemi</h2>
            <p className="text-gray-700 mb-4">
              <strong className="font-medium">Yöntem: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant="success">Ödendi: {order.paidAt.substring(0, 10)}</Message>
            ) : (
              <Message variant="danger">Ödenmedi</Message>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 uppercase tracking-wider">Sipariş Edilen Ürünler</h2>
            {order.orderItems.length === 0 ? (
              <Message>Sipariş boş</Message>
            ) : (
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="py-4 flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link href={`/product/${item.product}`} className="text-indigo-600 hover:underline font-medium">
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
            <h2 className="text-xl font-semibold mb-6 text-gray-800 uppercase tracking-wider">Sipariş Özeti</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Ürünler</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Kargo</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Vergi</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Toplam</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {!order.isPaid && (
              <div className="mt-6 w-full">
                <button
                  onClick={successPaymentHandler}
                  disabled={loadingPay}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded shadow transition"
                >
                  {loadingPay ? 'İşleniyor...' : `${order.totalPrice.toFixed(2)} $ Öde (Test)`}
                </button>
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="mt-4 w-full">
                <button
                  onClick={deliverHandler}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded shadow transition"
                >
                  Teslim Edildi Olarak İşaretle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
