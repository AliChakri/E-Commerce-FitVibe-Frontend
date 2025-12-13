
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../../context/LanguageContext';
import OrderApi from '../../../../context/orderApi';
import { Clock, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LatestOrders = () => {

  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderApi.get(`/dash/all?lang=${lang}`, { withCredentials: true });
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error?.response?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle Status 
  const BadgeStatus = ({ status }) => {
      switch (status) {
        case 'paid':
          return <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
              bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300`}
          >
              <div 
                className={`w-1.5 h-1.5 rounded-full mr-2 bg-emerald-500`}
              />
              {t(String(status).toLocaleLowerCase()) || 'Pending'}
            </span>
          break;
        case 'pending':
          return <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
              bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300`}
          >
              <div 
                className={`w-1.5 h-1.5 rounded-full mr-2 bg-amber-500`}
              />
              {t(String(status).toLocaleLowerCase()) || 'Pending'}
            </span>
          break;
        case 'cancelled':
          return <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
              bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300`}
          >
              <div 
                className={`w-1.5 h-1.5 rounded-full mr-2 bg-red-500`}
              />
              {t(String(status).toLocaleLowerCase()) || 'Pending'}
            </span>
          break;   
        default:
          return <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold 
              bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300`}
          >
              <div 
                className={`w-1.5 h-1.5 rounded-full mr-2 bg-amber-500`}
              />
              Pending
            </span> 
      }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('latestOrders')}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-600 dark:text-slate-400">{t('loadingOrders')}...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">{t('noOrdersFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t("orderId")}</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t("customer")}</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t("total")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t("status")}</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 text-sm">{t("date")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 15).map((order, index) => (
                  <tr 
                    key={order._id} 
                    className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-700/20'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {(order?.paymentResult?.email || 'N')[0].toUpperCase()}
                        </div>
                        <span className="text-slate-900 dark:text-slate-100 font-medium">
                          {order?.paymentResult?.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <BadgeStatus status={order.paymentResult?.status?.toString().toLowerCase()} />
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestOrders