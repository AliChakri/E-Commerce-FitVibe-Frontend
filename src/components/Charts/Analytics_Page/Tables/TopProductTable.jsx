import { useEffect, useState } from "react";
import { useLanguage } from "../../../../context/LanguageContext";
import API from "../../../../context/apiProduct";
import AnalyticsApi from "../../../../context/analytics";
import { DollarSign, Star, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";


const TopProductTable = () => {
  const { t } = useTranslation();
  const [total, setTotal] = useState(0);
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await AnalyticsApi.get(`/top-products?lang=${lang}`, { withCredentials: true });
        if (res.data.success) {
          setProducts(res.data.topProducts);
        }
      } catch (error) {
        console.log(error?.response?.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let count = 0;
    products.forEach((p) => {
      // Your existing logic here
    });
    setTotal(count);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-xl">
            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('topSellingProducts')}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t('product')}</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t('category')}</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t('price')}</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t('sold')}</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t('stock')}</th>
              </tr>
            </thead>
            <tbody>
              {products && products?.length > 0 && products.map((p, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-700/20'
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-600" 
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100 block">
                          {p.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {t(String(p.category).toLocaleLowerCase())}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {p.price}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {p.totalSold}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                      p.totalStock > 10 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                    }`}>
                      {p.totalStock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default TopProductTable;
