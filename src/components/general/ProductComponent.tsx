//import React from 'react'
import { useNavigate } from 'react-router-dom'
//import { Images } from '../../constants/ImgImports'

interface ProductComponentProps {
  product?: {
    id: number;
    name: string;
    description?: string;
    price: number | string;
    image?: string;
    category?: {
      id: number;
      name: string;
    };
    location?: string;
    quantity: number;
    status: string;
  };
}

const ProductComponent = ({ product }: ProductComponentProps) => {
  const navigate = useNavigate();

  // Default fallback product for when no product is provided
  if (!product) {
    return (
      <div className="flex flex-col border border-gray-200 p-4 m-2 rounded-lg w-[90%] sm:w-[250px] hover:shadow-lg transition cursor-pointer">
        <div className="w-full h-48 bg-gray-200 rounded mb-3 flex items-center justify-center">
          <i className='bi bi-image text-gray-400 text-4xl'></i>
        </div>
        <h2 className='font-bold text-xl mb-2'>Product Name</h2>
        <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
          Organically grown produce, perfect for your needs
        </p>
        <span className='text-green-800 text-sm mb-1'>Category</span>
        <span className='font-bold text-[#78C726] text-xl mb-4'>$0.00</span>
        <button className='w-full border-2 border-[#78C726] text-[#78C726] rounded-lg py-2 hover:bg-[#78C726] hover:text-white transition'>
          View More
        </button>
      </div>
    );
  }

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Safely parse price
  const price = product.price ? parseFloat(product.price.toString()) : 0;

  return (
    <div 
      onClick={handleClick}
      className="flex flex-col border border-gray-200 p-4 m-2 rounded-lg w-[90%] sm:w-[250px] hover:shadow-lg transition cursor-pointer bg-white"
    >
      {/* Product Image */}
      <div className="w-full h-48 mb-3 overflow-hidden rounded">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className='w-full h-full object-cover hover:scale-105 transition'
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <i className='bi bi-image text-gray-400 text-4xl'></i>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h2 className='font-bold text-xl mb-2 line-clamp-1'>{product.name}</h2>
        
        {product.description && (
          <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <i className='bi bi-tag'></i>
          <span>{product.category?.name || 'Uncategorized'}</span>
        </div>

        {product.location && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <i className='bi bi-geo-alt'></i>
            <span className='line-clamp-1'>{product.location}</span>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className='font-bold text-[#78C726] text-2xl'>
              ${price.toFixed(2)}
            </span>
            {product.quantity > 0 ? (
              <span className='text-xs text-green-600 bg-green-100 px-2 py-1 rounded'>
                In Stock
              </span>
            ) : (
              <span className='text-xs text-red-600 bg-red-100 px-2 py-1 rounded'>
                Out of Stock
              </span>
            )}
          </div>

          <button className='w-full border-2 border-[#78C726] text-[#78C726] rounded-lg py-2 hover:bg-[#78C726] hover:text-white transition font-semibold'>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductComponent