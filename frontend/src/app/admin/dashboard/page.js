'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Message from '../../../components/ui/Message';
import Loader from '../../../components/ui/Loader';

const DashboardScreen = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetch users
        const usersRes = await fetch('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const usersData = await usersRes.json();
        
        // Fetch products
        const productsRes = await fetch('http://localhost:5000/api/products');
        const productsData = await productsRes.json();
        
        // Fetch orders
        const ordersRes = await fetch('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${userInfo.token}` } });
        const ordersData = await ordersRes.json();
        
        const totalRevenue = Array.isArray(ordersData) ? ordersData.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0) : 0;
        
        setStats({
          users: Array.isArray(usersData) ? usersData.length : 0,
          products: Array.isArray(productsData) ? productsData.length : 0,
          orders: Array.isArray(ordersData) ? ordersData.length : 0,
          revenue: totalRevenue
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load statistics');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [userInfo, router]);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 uppercase tracking-wide">Admin Dashboard</h1>
      {error && <Message variant="danger">{error}</Message>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
