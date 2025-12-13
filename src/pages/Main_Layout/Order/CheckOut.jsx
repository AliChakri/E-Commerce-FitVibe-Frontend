
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import UserApi from "../../../context/userApi";
import OrderApi from "../../../context/orderApi";
import useCart from "../../../hooks/useCart";
import { useAuth } from "../../../context/AuthProvider";
import { MapPin, CreditCard, Package, Shield, Edit3, Save, Moon, Sun, } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";

const Checkout = () => {

    const { user, setUser } = useAuth();
    const { t } = useTranslation();
    const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 🔹 If coming from Buy Now → product is passed in location.state
  const buyNowItem = location.state?.item || null;

  // 🔹 Load cart only if not Buy Now
  const { cartItems, totalPrice } = useCart();

  // 🔹 Decide which items to checkout
  const finalItems = buyNowItem ? [buyNowItem] : cartItems || [];
  const finalTotal = buyNowItem
    ? buyNowItem.product.price * buyNowItem.quantity
    : totalPrice;

  // 🔹 Address state (prefill from user if available)
  const [address, setAddress] = useState({
    country: user?.address?.country || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.postalCode || "",
    street: user?.address?.street || "",
  });

  

  // --- Handlers ---
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // EDIT'S USER ADDRESS IF NEEDED    
    const handleSaveAddress = async () => {
    
          if (!address.street || !address.country || !address.postalCode || !address.city) {
                toast.warn('Address must be fully filled');
                return;
            }
        
    try {
      setLoading(true);
      const res = await UserApi.put('/me/address', {
            address: {
            street: address.street,
            country: address.country,
            city: address.city,
            postalCode: address.postalCode,
        }}, { withCredentials: true });
      
      if (res.data.success) {
        if (setUser) {
            setUser(res.data.user);
            setIsEditingAddress(false);
        }
          showMessage('success', 'Address updated successfully!');
          setIsEditingAddress(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
      console.error('Error updating address:', error);
    } finally {
      setLoading(false);
    }
  };

  // HANDLE CHECKOUT
  const handleCheckout = async () => {

    if (!finalItems.length) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!address.street || !address.country || !address.postalCode || !address.city) {
      toast.warn('Address must be fully filled');
      return;
    }

    try {
      
      const res = await OrderApi.post(
        "/",
        {
          orderItems: finalItems.map((item) => ({
            product: item.product._id,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: address,
          totalPrice: Number(finalTotal.toFixed(2)),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("✅ Order created! Redirecting to PayPal...");
        navigate(`/order/${res.data.order?._id}/pay`);
      }
      console.log("Order created:", res.data);
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error(err?.response?.data?.message || "❌ Checkout failed");
    }
  };

  // --- UI ---
  return (
 <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 mt-[10vh] transition-colors duration-200">
                
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <CreditCard className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("checkout")}</h1>
                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                            <Shield className="h-4 w-4" />
                            {t("secureCheckout")}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Address & Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('shippingAddress')}</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                                        className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        {isEditingAddress ? t('cancel') : t('edit')}
                                    </button>
                                </div>

                                {!isEditingAddress ? (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                                            <p className="text-gray-600 dark:text-gray-300">{address.address}</p>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {address.city}, {address.postalCode}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-300">{address.country}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('country')}</label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={address.country}
                                                    onChange={handleChange}
                                                    placeholder="Enter country"
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('city')}</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={address.city}
                                                    onChange={handleChange}
                                                    placeholder="Enter city"
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('postalCode')}</label>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={address.postalCode}
                                                    onChange={handleChange}
                                                    placeholder="Enter ZIP code"
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('street')}</label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={address.street}
                                                    onChange={handleChange}
                                                    placeholder="Enter street address"
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSaveAddress}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            {loading ? t("saving") : t("saveAddress")}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("paymentMethod")}</h2>
                                </div>

                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">PP</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{t("paypal")}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{t("paypalSecurePayment")}</p>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
                                    <Shield className="h-4 w-4" />
                                    <span>{t("paymentEncryptedSecure")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("orderSummary")}</h2>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4 mb-6">
                                    {finalItems.map((item, idx) => (
                                        <div
                                            key={`${item.product._id}_${item.size}_${item.color}_${idx}`}
                                            className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                                        >
                                            <img
                                                src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                                                alt={item.product?.name}
                                                className="w-15 h-15 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                                    {item.product?.name}
                                                </h4>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                                        {item.size}
                                                    </span>
                                                    <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                                                        {item.color}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{t("quantity")}: {item.quantity}</span>
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                        ${(item.product.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>{t("subtotal")} ({finalItems.length} {t("items")})</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>{t("shipping")}</span>
                                        <span>$10.00</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>{t("tax")}</span>
                                        <span>{t("calculatedAtCheckout")}</span>
                                    </div>
                                    <hr className="border-gray-200 dark:border-gray-600" />
                                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100">
                                        <span>{t("total")}</span>
                                        <span>${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {loading ? t("processing") : t("placeOrderPayWithPaypal")}
                                </button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                    {t("agreeTermsConditions")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
  );
};

export default Checkout;
