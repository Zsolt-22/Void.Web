import Link from 'next/link';
import Rating from './Rating';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-64 w-full bg-gray-200">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 truncate">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center h-8">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <Link
            href={`/product/${product._id}`}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 transition"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
