import React from 'react';
import { 
  Calendar, 
  CircleDollarSign, 
  CreditCard, 
  Package, 
  Truck, 
  ShoppingCart, 
  X, 
  MapPin,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useLanguage } from './../../context/LanguageContext'
import { useTranslation } from 'react-i18next';

const OrderModal = ({ order, onClose }) => {

  const { t } = useTranslation();
  const { lang } = useLanguage();
  
  if (!order) return null;

  // Helper function for status styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { 
        bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
        text: 'text-emerald-800 dark:text-emerald-200',
        border: 'border-emerald-200 dark:border-emerald-700',
        icon: <CheckCircle className="w-4 h-4" />
      },
      pending: { 
        bg: 'bg-amber-100 dark:bg-amber-900/30', 
        text: 'text-amber-800 dark:text-amber-200',
        border: 'border-amber-200 dark:border-amber-700',
        icon: <Clock className="w-4 h-4" />
      },
      cancelled: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-200 dark:border-red-700',
        icon: <XCircle className="w-4 h-4" />
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {config.icon}
        {status ? t(String(status).toLocaleLowerCase()) : t('pending')}
        
      </span>
    );
  };

  const getDeliveryBadge = (delivery) => {
    const deliveryConfig = {
      delivered: { bg: 'bg-emerald-500', text: 'text-white' },
      shipped: { bg: 'bg-blue-500', text: 'text-white' },
      'in transit': { bg: 'bg-purple-500', text: 'text-white' },
      processing: { bg: 'bg-amber-500', text: 'text-white' },
      cancelled: { bg: 'bg-red-500', text: 'text-white' }
    };

    const config = deliveryConfig[delivery] || deliveryConfig.processing;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Truck className="w-4 h-4" />
        {delivery ? delivery === 'in transit' ? t('InTransit') : t(String(delivery).toLocaleLowerCase()) : t('processing')}
        
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t('orderId')} #{order._id.slice(-8).toUpperCase()}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {t('orderDetailsDesc')}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Date Card */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-slate-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 dark:bg-gray-500 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-600 dark:text-gray-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">{t('orderDate')}</p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-slate-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 dark:bg-gray-500 rounded-lg">
                  <CreditCard className="w-5 h-5 text-slate-600 dark:text-gray-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">{t('payment')}</p>
                  {getStatusBadge(order.paymentResult?.status)}
                </div>
              </div>
            </div>

            {/* Delivery Card */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-slate-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 dark:bg-gray-500 rounded-lg">
                  <Truck className="w-5 h-5 text-slate-600 dark:text-gray-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-300">{t('delivery')}</p>
                  {getDeliveryBadge(order.delivery)}
                </div>
              </div>
            </div>

            {/* Total Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-200 dark:bg-emerald-700 rounded-lg">
                  <CircleDollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">{t('totalAmount')}</p>
                  <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="bg-white dark:bg-gray-700 rounded-xl border border-slate-200 dark:border-gray-600 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-600 dark:to-gray-500 px-6 py-4 border-b border-slate-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-slate-600 dark:text-gray-200" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('shippingAddress')}
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">{t('country')}</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {order.shippingAddress?.country || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">{t('city')}</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {order.shippingAddress?.city || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">{t('address')}</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {order.shippingAddress?.address || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="bg-white dark:bg-gray-700 rounded-xl border border-slate-200 dark:border-gray-600 overflow-hidden">

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-600 dark:to-gray-500 px-6 py-4 border-b border-slate-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-gray-200" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t('orderItems')}
                  </h3>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {order.orderItems.length} {t("item")}{order.orderItems.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-gray-600">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="p-6 hover:bg-slate-50 dark:hover:bg-gray-600/50 transition-colors duration-200">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-gray-600 shadow-sm"
                        src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                        alt={item.product?.name?.[lang] || 'Product'}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex-col md:flex-row min-w-0">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                        {item.product?.name?.[lang] || 'Product Name Not Available'}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.size && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                            {t('size')}: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                            {t('color')}: {item.color}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                          {t('quantity')}: {item.quantity}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-600 dark:text-gray-300">
                        <span>{t('unitPrice')}: ${item.price?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total Footer */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-600 dark:to-gray-500 px-6 py-4 border-t border-slate-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-slate-700 dark:text-gray-200">
                  {t('orderTotal')}
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;