import React, { useEffect, useState } from 'react'
import API from '../../../context/apiProduct'
import { toast } from 'react-toastify'
import {
  Edit,
  X,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Search,
  Filter
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../../context/LanguageContext'

const Products = () => {
  const { t } = useTranslation()
  const { lang } = useLanguage()

  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get(`/?lang=${lang}`, { withCredentials: true })
        if (res.data.success) setProducts(res.data.products)
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [lang])

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/delete/${id}`, { withCredentials: true })
      if (res.data.success) {
        toast.success('Deleted Successfully')
        setProducts(prev => prev.filter(p => p._id !== id))
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
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
                <p className="hidden md:inline text-gray-600 dark:text-gray-400 mt-1">
                  {t('productsSubtitle')}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('totalProducts')}
              </span>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {products.length}
              </p>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchProducts')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 min-w-[150px]"
              >
                <option value="">{t('allCategories')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {t(cat.toLowerCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">

          <table className="w-full min-w-[900px]">
            {/* HEADER */}
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                <th className="p-6 text-left w-[25%]">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    {t('product')}
                  </div>
                </th>
                <th className="p-6 text-left w-[15%]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-500" />
                    {t('category')}
                  </div>
                </th>
                <th className="p-6 text-left w-[15%]">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                    {t('price')}
                  </div>
                </th>
                <th className="p-6 text-left w-[15%]">{t('stock')}</th>
                <th className="p-6 text-left w-[10%]">{t('status')}</th>
                <th className="p-6 text-center w-[20%]">{t('actions')}</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  {/* PRODUCT */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {product.name.length > 30
                            ? product.name.slice(0, 30) + '...'
                            : product.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.brand || t('noBrand')}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="p-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      {t(product.category.toLowerCase())}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td className="p-6">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                  </td>

                  {/* STOCK */}
                  <td className="p-6">
                    {product.variants?.slice(0, 2).map((v, i) => (
                      <div key={i} className="text-xs">
                        {v.size}/{v.color}:{' '}
                        <span className="font-medium">{v.stock}</span>
                      </div>
                    ))}
                    {product.variants?.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{product.variants.length - 2} more
                      </span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {t('active')}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:scale-110"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  )
}

export default Products
