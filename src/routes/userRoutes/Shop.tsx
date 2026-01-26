import React from 'react'
import HomeLayout from '../../components/general/HomeLayout'
import ProductComponent from '../../components/general/ProductComponent'
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: 100000 });

  React.useEffect(() => {
    // Fetch products
    axios.get('http://localhost:5000/api/v1/product')
      .then(res => {
        const data = Array.isArray(res.data.content) ? res.data.content : [];
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
    
    // Fetch categories
    axios.get('http://localhost:5000/api/v1/categories')
      .then(res => setCategories(res.data.content || []))
      .catch(() => console.error('Failed to load categories'));
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === parseInt(selectedCategory);
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    
    return matchesCategory && matchesSearch && matchesPrice && product.status === 'ACTIF';
  });

  return (
    <HomeLayout>
      <div className="w-full pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className='font-bold text-4xl mb-4'>Browse Farm Products</h1>
          <p className='text-gray-600 mb-8'>Fresh produce directly from local farmers</p>

          {/* Search Bar */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex flex-1 min-w-[300px]">
              <input 
                type="text" 
                placeholder='Search products...' 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='border border-gray-300 rounded-l p-3 flex-1'
              />
              <button className='bg-[#78C726] text-white rounded-r px-6'>
                <i className='bi bi-search'></i>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
                <h3 className='font-bold text-lg mb-4 flex items-center gap-2'>
                  <i className='bi bi-filter'></i> Filters
                </h3>

                {/* Categories Filter */}
                <div className="mb-6">
                  <h4 className='font-semibold mb-3'>Categories</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input 
                        type="radio" 
                        name="category" 
                        value=""
                        checked={selectedCategory === ''}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className='text-[#78C726]'
                      />
                      <span>All Products</span>
                    </label>
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input 
                          type="radio" 
                          name="category" 
                          value={cat.id}
                          checked={selectedCategory === cat.id.toString()}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className='text-[#78C726]'
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className='font-semibold mb-3'>Price Range</h4>
                  <div className="space-y-3">
                    <div>
                      <label className='text-sm text-gray-600'>Min Price</label>
                      <input 
                        type="number" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                        className='w-full border border-gray-300 rounded p-2 mt-1'
                        placeholder='0'
                      />
                    </div>
                    <div>
                      <label className='text-sm text-gray-600'>Max Price</label>
                      <input 
                        type="number" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 100000})}
                        className='w-full border border-gray-300 rounded p-2 mt-1'
                        placeholder='100000'
                      />
                    </div>
                  </div>
                </div>

                {/* Reset Filters */}
                <button 
                  onClick={() => {
                    setSelectedCategory('');
                    setSearchQuery('');
                    setPriceRange({ min: 0, max: 100000 });
                  }}
                  className='w-full border border-[#78C726] text-[#78C726] rounded p-2 hover:bg-[#78C726] hover:text-white transition'
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <p className='text-gray-600'>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C726]"></div>
                  <p className='mt-4 text-gray-600'>Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <i className='bi bi-inbox text-6xl text-gray-300'></i>
                  <p className='mt-4 text-gray-600'>No products found matching your criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductComponent key={product.id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default Shop
