import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  CheckCircle, Package, MapPin, Calendar, 
  CreditCard, ArrowRight, Download, Truck,
  Home, Loader2
} from "lucide-react";
import OrderApi from "../../../context/orderApi";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import SpinnerLoad from "../../../components/SpinnerLoad";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await OrderApi.get(`/${id}`, { withCredentials: true });
        if (res.data.success) {
          setOrder(res.data.order);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, lang]);


  if (loading) {
    return (
      <SpinnerLoad label="." />
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Package className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{t("orderNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 mt-[10vh]">
      <div className="max-w-4xl mx-auto">
        
        {/* Success Animation Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4">
              <CheckCircle className="text-white w-16 h-16" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-3">
            {t("orderConfirmed")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md">
            {t("orderConfirmedMessage")}
          </p>
          
          {/* Order ID Badge */}
          <div className="mt-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("orderId")}: <span className="font-mono font-semibold text-gray-900 dark:text-white">#{order?._id?.slice(-8).toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Items Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('orderItems')} ({order.orderItems?.length || 0})
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order?.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-600"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600">
                          {item?.product?.images ? (
                            <img
                              src={item?.product?.images?.[0] || "https://via.placeholder.com/80"}
                              alt={item?.product?.name?.[lang] || item?.product?.name?.en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                          {item?.product?.name?.[lang] || item?.product?.name?.en}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
                          {item?.size && (
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">
                              {t("size")}: {item?.size}
                            </span>
                          )}
                          {item?.color && (
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">
                              {t("color")}: {item?.color}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {t("quantity")}: {item?.quantity} × ${item?.price?.toFixed(2)}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${(item?.quantity * item?.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("shippingAddress")}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {order?.shippingAddress?.street || order?.shippingAddress?.address}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {order?.shippingAddress?.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">{t("orderSummary")}</h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Payment Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{t("paymentStatus")}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.isPaid 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {order?.isPaid ? `✓ ${t("paid")}` : `✗ ${t("pending")}`}
                  </span>
                </div>

                {/* Order Date */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{t("orderDate")}</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-600 my-4"></div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{t("subtotal")}</span>
                    <span>${(order?.totalPrice - (order?.shippingPrice || 0) - (5.99 || 0)).toFixed(2)}</span>
                  </div>
                  {order?.shippingPrice > 0 && (
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t("shipping")}</span>
                      <span>${order?.shippingPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {order?.taxPrice > 0 && (
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>{t("tax")}</span>
                      <span>${order?.taxPrice.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{t("total")}</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${order.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Download Invoice Button */}
                <button className="w-full mt-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Download className="w-5 h-5" />
                  {t("downloadInvoice")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/users/me/my-orders"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <Package className="w-5 h-5" />
            {t("viewAllOrders")}
          </Link>
          
          <Link
            to="/home"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            {t("continueShopping")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Estimated Delivery */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{t("estimatedDelivery")}</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {t("estimatedDeliveryMessage")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;