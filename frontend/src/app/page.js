'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const HomeContent = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = keyword ? `http://localhost:5000/api/products?keyword=${keyword}` : 'http://localhost:5000/api/products';
        const res = await fetch(url);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
        
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [keyword]);

  return (
    <>
      <div className="bg-gradient-to-br from-black via-purple-950 to-purple-900 text-center py-20 shadow-[0_0_80px_rgba(168,85,247,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
             Void store'ye hoşgeldiniz.
          </h1>
          <p className="text-xl md:text-2xl font-light text-indigo-100 max-w-2xl">
            Find the best electronics, gadgets, and gear to supercharge your life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 uppercase tracking-widest text-center">
          Latest Products
        </h2>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const HomeScreen = () => {
  return (
    <Suspense fallback={<Loader />}>
      <HomeContent />
    </Suspense>
  );
};

export default HomeScreen;
