import React, { useEffect, useState } from 'react';
import API from '../../context/apiProduct';
import { AlertTriangle, Package } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const AlertStock = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);

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
    };

    fetchProducts();
  }, [lang]);

  const bestSelling = products.slice(0, 5);
  const lowStock = products?.filter((product) =>
    product?.variants?.some((variant) => variant?.stock <= 5)
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-red-200 dark:border-red-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-red-700 dark:text-red-400">{t('stockAlerts')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {lowStock.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
              {t('allProductsStocked')}
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {t('noAttentionRequired')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-200 dark:border-red-800">
                  <th className="text-left py-3 px-4 font-semibold text-red-700 dark:text-red-400 text-sm">{t('image')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-red-700 dark:text-red-400 text-sm">{t('product')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-red-700 dark:text-red-400 text-sm">{t('variant')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-red-700 dark:text-red-400 text-sm">{t('stock')}</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.slice(0, 6).map((product) =>
                  product.variants
                    .filter((variant) => variant.stock <= 5)
                    .slice(0, 1)
                    .map((variant, idx) => (
                      <tr 
                        key={`${product._id}-${idx}`} 
                        className="border-b border-red-100 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="relative">
                            <img 
                              className="w-14 h-14 object-cover rounded-xl shadow-sm border border-red-200 dark:border-red-700" 
                              src={product.images[0]} 
                              alt={product.name} 
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              !
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {product.name}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            {variant.size || variant.color || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                              variant.stock === 0 
                                ? 'bg-red-500 text-white' 
                                : variant.stock <= 2 
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                            }`}>
                              {variant.stock}
                            </span>
                            {variant.stock === 0 && (
                              <span className="text-xs text-red-600 dark:text-red-400 font-medium">{t('outOfStock')}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertStock;
