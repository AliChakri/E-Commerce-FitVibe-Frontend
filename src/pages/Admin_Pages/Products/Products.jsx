import React, { useEffect, useState } from 'react'
import API from '../../../context/apiProduct';
import { toast } from 'react-toastify';
import { Edit, X, Package, DollarSign, Tag, Image as ImageIcon, Search, Filter, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../context/LanguageContext';

const Products = () => {

  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      
      try {
        const res = await API.get(`/?lang=${lang}`, { withCredentials: true });
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.log(error?.response?.message);   
      }
    }

    fetchProducts();
  }, [lang]); 

  const handleDelete = async (productId) => {
    
    try {
      const res = await API.delete(`/delete/${productId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success('Deleted Successfully');
        // Refresh the products list after deletion
        const updatedProducts = products.filter(product => product._id !== productId);
        setProducts(updatedProducts);
      }
      
    } catch (error) {
      console.log(error?.response?.data || 'Error');
      toast.error(error?.response?.data?.message || 'Failed to delete product');
    }
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(product => product.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('productsManagement')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t('productsSubtitle')}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('totalProducts')}</span>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{products.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('searchProducts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer min-w-[150px]"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{t(String(category).toLocaleLowerCase())}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* Table Header */}
          <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 gap-4 p-6 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              <div className="col-span-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                {t('product')}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-500" />
                {t('category')}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-500" />
                {t('price')}
              </div>
              <div className="col-span-2">{t('stock')}</div>
              <div className="col-span-1">{t('status')}</div>
              <div className="col-span-2 text-center">{t('actions')}</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {t('noProductsFound')}
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  {searchTerm || categoryFilter ? 'Try adjusting your filters' : 'Start by adding your first product'}
                </p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div key={product?._id} className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group">
                  
                  {/* Product Info */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={product?.images[0]}
                          alt={product?.name}
                          className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors duration-200"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </div>
                        {product?.discount > 0 && (
                          <div className="absolute -bottom-2 -left-2 bg-red-100 dark:bg-red-900/20 text-pink-500 dark:text-gray-800 text-xs font-bold rounded-lg w-12 h-6 flex items-center justify-center">
                            {product?.discount}%
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {product?.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {product?.brand || t('noBrand')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2 flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      {/* {product?.category} */}
                      {t(String(product?.category).toLowerCase())}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${product?.price}
                    </span>
                  </div>

                  {/* Stock */}
                  <div className="col-span-2 flex items-center">
                    {product?.variants ? (
                      <div className="flex flex-col gap-1">
                        {product?.variants.slice(0, 2).map((variant, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              {variant.size}/{variant.color}: 
                            </span>
                            <span className={`ml-1 font-medium ${
                              variant.stock > 10 
                                ? 'text-green-600 dark:text-green-400' 
                                : variant.stock > 0 
                                ? 'text-yellow-600 dark:text-yellow-400' 
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {variant?.stock}
                            </span>
                          </div>
                        ))}
                        {product?.variants.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{product?.variants?.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {t('active')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-all duration-200 hover:scale-110"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-all duration-200 hover:scale-110"
                      title="Delete Product"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* Footer Stats */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {t('showingOf')} {filteredProducts.length} {t('products')}
              </span>
              <div className="flex items-center gap-4">
                <span>{t('totalValue')} ${filteredProducts.reduce((sum, product) => sum + product.price, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Products