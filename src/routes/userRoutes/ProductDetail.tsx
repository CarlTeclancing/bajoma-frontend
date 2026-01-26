import React from 'react'
import HomeLayout from '../../components/general/HomeLayout'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const [addedToCart, setAddedToCart] = React.useState(false);

  React.useEffect(() => {
    axios.get(`http://localhost:5000/api/v1/product/${id}`)
      .then(res => {
        setProduct(res.data.content);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedToCart(true);
    
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <HomeLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
          <p className='mt-4 text-gray-600'>Loading product details...</p>
        </div>
      </HomeLayout>
    );
  }

  if (!product) {
    return (
      <HomeLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <i className='bi bi-exclamation-triangle text-6xl text-gray-300'></i>
          <h2 className='text-2xl font-bold mt-4'>Product Not Found</h2>
          <button 
            onClick={() => navigate('/shop')}
            className='mt-6 bg-[#78C726] text-white rounded px-6 py-3'
          >
            Back to Shop
          </button>
        </div>
      </HomeLayout>
    );
  }

  const price = product.price ? parseFloat(product.price.toString()) : 0;

  return (
    <HomeLayout>
      <div className="container mx-auto px-4 py-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => navigate('/shop')} className='text-[#78C726] hover:underline'>Shop</button>
          <i className='bi bi-chevron-right text-gray-400'></i>
          <span className='text-gray-600'>{product.category?.name || 'Products'}</span>
          <i className='bi bi-chevron-right text-gray-400'></i>
          <span className='text-gray-800 font-semibold'>{product.name}</span>
        </div>

        {/* Success Message */}
        {addedToCart && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
            <i className='bi bi-check-circle-fill'></i>
            <span>Product added to cart successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className='w-full max-w-lg rounded-lg shadow-lg object-cover'
              />
            ) : (
              <div className='w-full max-w-lg h-96 bg-gray-200 rounded-lg flex items-center justify-center'>
                <i className='bi bi-image text-8xl text-gray-400'></i>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className='text-4xl font-bold mb-4'>{product.name}</h1>
            
            {/* Category Badge */}
            <div className="mb-4">
              <span className='inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm'>
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className='text-4xl font-bold text-[#78C726]'>
                ${price.toFixed(2)}
              </span>
              <span className='text-gray-600 ml-2'>/ unit</span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className='font-semibold text-lg mb-2'>Description</h3>
              <p className='text-gray-700 leading-relaxed'>
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span className='text-gray-600'>Availability:</span>
                <span className={`font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className='text-gray-600'>Location:</span>
                <span className='font-semibold flex items-center gap-1'>
                  <i className='bi bi-geo-alt text-[#78C726]'></i>
                  {product.location || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className='text-gray-600'>Seller:</span>
                <span className='font-semibold'>{product.user?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className='text-gray-600'>Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  product.status === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className='font-semibold mb-2 block'>Quantity</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                  disabled={quantity <= 1}
                >
                  <i className='bi bi-dash'></i>
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className='w-20 text-center border border-gray-300 rounded p-2'
                  min="1"
                  max={product.quantity}
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className='w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                  disabled={quantity >= product.quantity}
                >
                  <i className='bi bi-plus'></i>
                </button>
                <span className='text-gray-600 text-sm'>
                  (Max: {product.quantity})
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={handleAddToCart}
                disabled={product.quantity === 0 || product.status !== 'ACTIF'}
                className='flex-1 min-w-[200px] bg-[#78C726] text-white rounded-lg px-6 py-4 font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#6AB31E] transition disabled:bg-gray-300 disabled:cursor-not-allowed'
              >
                <i className='bi bi-cart-plus'></i>
                Add to Cart
              </button>
              <button 
                onClick={() => navigate('/cart')}
                className='border-2 border-[#78C726] text-[#78C726] rounded-lg px-6 py-4 font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition'
              >
                <i className='bi bi-cart'></i>
                View Cart
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <i className='bi bi-truck text-[#78C726] text-xl'></i>
                <span>Fast delivery within 2-3 business days</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <i className='bi bi-shield-check text-[#78C726] text-xl'></i>
                <span>100% fresh and organic produce</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <i className='bi bi-arrow-return-left text-[#78C726] text-xl'></i>
                <span>Easy returns within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default ProductDetail
