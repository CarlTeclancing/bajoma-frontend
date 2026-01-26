import React from 'react'
import HomeLayout from '../../components/general/HomeLayout'
import { Link, useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    const updatedCart = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (productId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price ? parseFloat(item.price.toString()) : 0;
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <HomeLayout>
      <div className="container mx-auto px-4 py-24">
        <h1 className='text-4xl font-bold mb-8'>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <i className='bi bi-cart-x text-8xl text-gray-300'></i>
            <h2 className='text-2xl font-bold mt-6 mb-4'>Your cart is empty</h2>
            <p className='text-gray-600 mb-8'>Add some products to get started!</p>
            <Link 
              to="/shop" 
              className='inline-block bg-[#78C726] text-white rounded-lg px-8 py-3 font-semibold hover:bg-[#6AB31E] transition'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <h2 className='font-semibold text-lg'>Items ({cartItems.length})</h2>
                  <button 
                    onClick={clearCart}
                    className='text-red-600 hover:text-red-800 text-sm flex items-center gap-1'
                  >
                    <i className='bi bi-trash'></i>
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y">
                  {cartItems.map(item => {
                    const price = item.price ? parseFloat(item.price.toString()) : 0;
                    return (
                      <div key={item.id} className="p-6 flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className='w-24 h-24 object-cover rounded'
                            />
                          ) : (
                            <div className='w-24 h-24 bg-gray-200 rounded flex items-center justify-center'>
                              <i className='bi bi-image text-gray-400'></i>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <Link 
                            to={`/product/${item.id}`}
                            className='font-semibold text-lg hover:text-[#78C726] transition'
                          >
                            {item.name}
                          </Link>
                          <p className='text-sm text-gray-600 mt-1'>
                            {item.category?.name || 'Uncategorized'}
                          </p>
                          <p className='text-sm text-gray-600 flex items-center gap-1 mt-1'>
                            <i className='bi bi-geo-alt'></i>
                            {item.location || 'N/A'}
                          </p>
                          <p className='text-[#78C726] font-bold text-xl mt-2'>
                            ${price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col items-end justify-between">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className='text-red-600 hover:text-red-800'
                          >
                            <i className='bi bi-x-lg'></i>
                          </button>

                          <div className="flex items-center gap-2 mt-4">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className='w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                              disabled={item.quantity <= 1}
                            >
                              <i className='bi bi-dash'></i>
                            </button>
                            <input 
                              type="number" 
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className='w-16 text-center border border-gray-300 rounded p-1'
                              min="1"
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className='w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                            >
                              <i className='bi bi-plus'></i>
                            </button>
                          </div>

                          <div className="mt-4 text-right">
                            <p className='text-sm text-gray-600'>Subtotal</p>
                            <p className='font-bold text-lg'>
                              ${(price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link 
                to="/shop" 
                className='inline-flex items-center gap-2 text-[#78C726] hover:underline mt-4'
              >
                <i className='bi bi-arrow-left'></i>
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                <h2 className='font-semibold text-lg mb-4'>Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-semibold'>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className='text-gray-600'>Shipping</span>
                    <span className='font-semibold'>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className='text-gray-600'>Tax (10%)</span>
                    <span className='font-semibold'>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className='font-bold text-lg'>Total</span>
                    <span className='font-bold text-lg text-[#78C726]'>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className='w-full bg-[#78C726] text-white rounded-lg py-3 font-semibold hover:bg-[#6AB31E] transition flex items-center justify-center gap-2'
                >
                  <i className='bi bi-check-circle'></i>
                  Proceed to Checkout
                </button>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-gray-700">
                    <i className='bi bi-shield-check text-[#78C726] mt-1'></i>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <i className='bi bi-truck text-[#78C726] mt-1'></i>
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <i className='bi bi-arrow-return-left text-[#78C726] mt-1'></i>
                    <span>Easy returns within 24 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  )
}

export default Cart
