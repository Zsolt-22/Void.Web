'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Message from '../../../components/ui/Message';
import Loader from '../../../components/ui/Loader';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  
  const [loadingCreate, setLoadingCreate] = useState(false);

  const { userInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [userInfo, router, successDelete]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoadingDelete(true);
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        if (!res.ok) throw new Error('Delete failed');
        setSuccessDelete(!successDelete);
        setLoadingDelete(false);
      } catch (err) {
        alert(err.message);
        setLoadingDelete(false);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      setLoadingCreate(true);
      const res = await fetch(`http://localhost:5000/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setLoadingCreate(false);
      router.push(`/admin/product/${data._id}/edit`);
    } catch (err) {
      alert(err.message);
      setLoadingCreate(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Products</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center transition"
          onClick={createProductHandler}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Product
        </button>
      </div>

      {loadingDelete && <Loader />}
      {loadingCreate && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/product/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded mr-2">
                    Edit
                  </Link>
                  <button
                    className="text-red-600 hover:text-red-900 focus:outline-none bg-red-50 p-2 rounded"
                    onClick={() => deleteHandler(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListScreen;
