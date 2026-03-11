'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Rating from '../../../components/ui/Rating';
import Loader from '../../../components/ui/Loader';
import Message from '../../../components/ui/Message';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { use } from 'react';

const ProductScreen = ({ params }) => {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${resolvedParams.id}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Product not found');
        }
        
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id, reviewSuccess]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    router.push('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setReviewLoading(true);
      setReviewError('');
      
      const res = await fetch(`http://localhost:5000/api/products/${resolvedParams.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
      
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      alert('Review Submitted!');
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="max-w-7xl mx-auto py-8 px-4"><Message variant="danger">{error}</Message></div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link href="/" className="inline-block mb-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm transition">
        &larr; Go Back
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/2 relative h-96 md:h-auto rounded-lg overflow-hidden shadow-lg bg-white border border-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="md:w-1/4 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
          
          <div className="border-b border-t border-gray-200 py-3">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </div>
          
          <p className="text-2xl font-bold text-gray-900">${product.price}</p>
          <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
        </div>

        <div className="md:w-1/4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between mb-4 border-b border-gray-200 pb-4">
              <span className="text-gray-600 font-medium">Price:</span>
              <span className="font-bold text-gray-900">${product.price}</span>
            </div>

            <div className="flex justify-between mb-4 border-b border-gray-200 pb-4">
              <span className="text-gray-600 font-medium">Status:</span>
              <span className={`font-bold ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-600 font-medium">Qty:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-20 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white py-1 px-2"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 md:w-1/2">
        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-widest mb-6">Reviews</h2>
        {product.reviews.length === 0 && <Message>No Reviews</Message>}
        
        <div className="space-y-6">
          {product.reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-gray-900">{review.name}</strong>
                <span className="text-sm text-gray-500">{review.createdAt.substring(0, 10)}</span>
              </div>
              <Rating value={review.rating} />
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Customer Review</h3>
          {reviewSuccess && <Message variant="success">Review submitted successfully</Message>}
          {reviewError && <Message variant="danger">{reviewError}</Message>}
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white p-2"
                  required
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Comment</label>
                <textarea
                  row="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  required
                ></textarea>
              </div>
              <button
                disabled={reviewLoading}
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
              >
                Submit
              </button>
            </form>
          ) : (
            <Message>
              Please <Link href="/login" className="underline font-bold">sign in</Link> to write a review
            </Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
