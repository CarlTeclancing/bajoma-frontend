import React from 'react'
import HomeLayout from '../../components/general/HomeLayout'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URL } from '../../global'
import { authStorage } from '../../config/storage.config'

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card'
  });

  // Auto-fill user data from database
  React.useEffect(() => {
    const userStr = authStorage.getItem('user');
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      const nameParts = currentUser.name ? currentUser.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        firstName: firstName,
        lastName: lastName,
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: '',
        postalCode: ''
      }));
    }
  }, []);

  React.useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart');
    }
    setCartItems(cart);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create an order for each item in the cart
      const orderPromises = cartItems.map(item => {
        return axios.post(`${BACKEND_URL}/orders`, {
          product_id: item.id,
          quantity: item.quantity,
          status: 'pending'
        });
      });

      await Promise.all(orderPromises);

      // Clear cart after successful order creation
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      alert('Order placed successfully!');
      navigate('/account');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
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
        <h1 className='text-4xl font-bold mb-8'>Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
                  <i className='bi bi-person'></i>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className='block font-semibold mb-2'>First Name *</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className='w-full border border-gray-300 rounded-lg p-3'
                      placeholder='John'
                    />
                  </div>
                  <div>
                    <label className='block font-semibold mb-2'>Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className='w-full border border-gray-300 rounded-lg p-3'
                      placeholder='Doe'
                    />
                  </div>
                  <div>
                    <label className='block font-semibold mb-2'>Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className='w-full border border-gray-300 rounded-lg p-3'
                      placeholder='john@example.com'
                    />
                  </div>
                  <div>
                    <label className='block font-semibold mb-2'>Phone *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className='w-full border border-gray-300 rounded-lg p-3'
                      placeholder='+1234567890'
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
                  <i className='bi bi-geo-alt'></i>
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className='block font-semibold mb-2'>Street Address *</label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows={2}
                      className='w-full border border-gray-300 rounded-lg p-3'
                      placeholder='123 Main Street, Apt 4B'
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className='block font-semibold mb-2'>City *</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className='w-full border border-gray-300 rounded-lg p-3'
                        placeholder='New York'
                      />
                    </div>
                    <div>
                      <label className='block font-semibold mb-2'>Postal Code *</label>
                      <input 
                        type="text" 
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className='w-full border border-gray-300 rounded-lg p-3'
                        placeholder='10001'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className='text-xl font-bold mb-4 flex items-center gap-2'>
                  <i className='bi bi-credit-card'></i>
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className='w-5 h-5 text-[#78C726]'
                    />
                    <i className='bi bi-credit-card text-2xl text-gray-600'></i>
                    <div className="flex-1">
                      <div className='font-semibold'>Credit/Debit Card</div>
                      <div className='text-sm text-gray-600'>Pay securely with your card</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="mobile"
                      checked={formData.paymentMethod === 'mobile'}
                      onChange={handleChange}
                      className='w-5 h-5 text-[#78C726]'
                    />
                    <i className='bi bi-phone text-2xl text-gray-600'></i>
                    <div className="flex-1">
                      <div className='font-semibold'>Mobile Money</div>
                      <div className='text-sm text-gray-600'>Pay with mobile money</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className='w-5 h-5 text-[#78C726]'
                    />
                    <i className='bi bi-cash text-2xl text-gray-600'></i>
                    <div className="flex-1">
                      <div className='font-semibold'>Cash on Delivery</div>
                      <div className='text-sm text-gray-600'>Pay when you receive</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                <h2 className='text-xl font-bold mb-4'>Order Summary</h2>

                {/* Items */}
                <div className="border-b pb-4 mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map(item => {
                    const price = item.price ? parseFloat(item.price.toString()) : 0;
                    return (
                      <div key={item.id} className="flex gap-3 mb-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded' />
                          ) : (
                            <div className='w-full h-full bg-gray-200 rounded flex items-center justify-center'>
                              <i className='bi bi-image text-gray-400'></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className='font-semibold text-sm line-clamp-1'>{item.name}</div>
                          <div className='text-sm text-gray-600'>Qty: {item.quantity}</div>
                          <div className='text-sm font-bold text-[#78C726]'>
                            ${(price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
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

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className='w-full bg-[#78C726] text-white rounded-lg py-4 font-semibold text-lg hover:bg-[#6AB31E] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className='bi bi-lock'></i>
                      Place Order
                    </>
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <i className='bi bi-shield-check text-[#78C726]'></i> Secure checkout
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </HomeLayout>
  )
}

export default Checkout
