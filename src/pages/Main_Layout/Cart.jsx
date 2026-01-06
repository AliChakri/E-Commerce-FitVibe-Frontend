import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import SpinnerLoad from '../../components/SpinnerLoad';
import CartApi from '../../context/cartApi';
import { toast } from 'react-toastify';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LatestSuggestion from '../../components/Product/LatestSuggestion';
import { useAuth } from '../../context/AuthProvider';
import Footer from '../../components/Footer';

const getCartItemKey = (item) => {
    if (!item?.product?._id) return null;
    return `${item?.product?._id}_${item?.size}_${item?.color}`;
};

const Cart = () => {
  const { user } = useAuth();
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const navigate = useNavigate();
    
    const [carts, setCarts] = useState({ items: [] });
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalProduct, setTotalProduct] = useState(0);
    const [quantities, setQuantities] = useState({});
    const [modal, setModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState({});
    const shippingFee = 10.0;

    // FETCHING CART
    useEffect(() => {
        const fetchCartData = async () => {
            setLoading(true);
            try {
                const res = await CartApi.get(`/?lang=${lang}`, { withCredentials: true });
                if (res.data.success) {
                    setCarts(res.data.cart);
                    const initialQuantities = {};
                    res.data.cart.items?.forEach(item => {
                        const key = getCartItemKey(item);
                        initialQuantities[key] = item?.quantity;
                    });
                    setQuantities(initialQuantities);
                }
            } catch (error) {
                console.log(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCartData();
    }, [lang]);

    // Initialize quantities
    useEffect(() => {
        const initialQuantities = {};
        carts?.items?.forEach(item => {
            const key = getCartItemKey(item);
            if (key) {
                initialQuantities[key] = item.quantity;
            }
        });
        setQuantities(initialQuantities);
    }, [carts]);

    // Calculate totals
    useEffect(() => {
        if (carts?.items?.length && Object.keys(quantities).length) {
            const totalAmount = carts.items.reduce((sum, item) => {
                const key = getCartItemKey(item);
                const q = quantities[key] || 1;
                const price = item?.product?.price ?? 0;
                return sum + price * q;
            }, 0);
            setTotalProduct(totalAmount);
            setTotal(totalAmount + (totalAmount > 0 ? shippingFee : 0));
        } else {
            setTotalProduct(0);
            setTotal(0);
        }
    }, [quantities, carts]);

    const editCart = async (productId, size, color, quantity) => {
        if (quantity < 1) return;
        try {
            const res = await CartApi.put(
                '/',
                { id: productId, size, color, quantity },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success(t("cartUpdated"));
                setQuantities(prev => ({
                    ...prev,
                    [`${productId}_${size}_${color}`]: quantity,
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const removeItemFromCart = async (productId, size, color) => {
        try {
            const res = await CartApi.delete(`/${productId}?lang=${lang}`, {
                params: { size, color },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(t("itemRemoved"));
                setCarts(res.data.cart);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const clearCart = async () => {
        try {
            const res = await CartApi.delete('/', { withCredentials: true });
            toast.success(res.data.message || t("cartCleared"));
            setCarts({ items: [] });
            setQuantities({});
            setTotal(0);
            setTotalProduct(0);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleCheckout = async () => {
        try {
            const variantIds = carts.items.map(item => item?.variantId);
            const isEmpty = carts?.items?.length;
            
            if (!isEmpty || isEmpty <= 0) {
                toast.info(t("cartEmptyInvalid"));
                return;
            }

            navigate('/checkout');
        } catch (err) {
            console.error("Payment error:", err);
            toast.error(t("checkoutFailed"));
        }
    };

    if (loading) {
        return <SpinnerLoad label={t("loading")} />
    }

    return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 mt-[10vh] px-4">
  {/* Clear Cart Modal */}
  {modal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-200 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("clearCart")}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t("clearCartConfirm")}</p>
          <div className="flex gap-3">
            <button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              onClick={() => {
                clearCart();
                setModal(false);
              }}
            >
              {t("clearCart")}
            </button>
            <button
              className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium py-3 px-4 rounded-xl transition-colors"
              onClick={() => setModal(false)}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="flex items-center gap-3 mb-8">
      <ShoppingCart className="h-8 w-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("shoppingCart")}
            </h1>
      <span className="text-xs sm:text-sm md:text-md lg:text-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full font-medium">
        {carts?.items?.length ?? 0} {t("items")}
      </span>
    </div>

    {(carts?.items?.length ?? 0) > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("cartItems")}</h2>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {carts.items.map((cart) => {
                const key = getCartItemKey(cart);
                const product = cart?.product;
                if (!key || !product) return null;

                const productImage = product?.images?.[0] || 'https://via.placeholder.com/150';
                const productPrice = product?.price ?? 0;
                const currentQuantity = quantities[key] || 1;
                const itemTotal = currentQuantity * productPrice;

                return (
                  <div key={cart._id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl"
                          src={productImage}
                          alt={product?.name}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {product?.name}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100">
                            {t("size")}: {cart?.size}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100">
                            {t("color")}: {cart?.color}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Price */}
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              ${productPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-300">
                              {t("total")}: ${itemTotal.toFixed(2)}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                              <button
                                onClick={() => editCart(cart.product._id, cart.size, cart.color, currentQuantity - 1)}
                                disabled={currentQuantity <= 1 || isUpdating[key]}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center text-gray-900 dark:text-gray-100">
                                {currentQuantity}
                              </span>

                              <button
                                onClick={() => editCart(cart.product._id, cart.size, cart.color, currentQuantity + 1)}
                                disabled={isUpdating[key]}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItemFromCart(cart?.product?._id, cart.size, cart.color)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                              title={t("removeItem")}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clear Cart Button */}
          <div className="mt-6 flex justify-end">
            <button
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
              onClick={() => setModal(true)}
            >
              <Trash2 className="h-4 w-4" />
              {t("clearCart")}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">{t("orderSummary")}</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{t("subtotal")} ({carts.items.length} {t("items")})</span>
                <span>${totalProduct.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>{t("shipping")}</span>
                <span>${totalProduct > 0 ? `$${shippingFee.toFixed(2)}` : t("free")}</span>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                <span>{t("total")}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              {t("proceedCheckout")}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-300 text-center mt-4">
              {t("secureCheckout")}
            </p>
          </div>
        </div>
      </div>
    ) : (
      /* Empty Cart State */
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400 dark:text-gray-200" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("emptyTitle")}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {t("emptyDescription")}
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
            {t("continueShopping")}
          </button>
        </div>
      </div>
    )}
        </div>
        
      <LatestSuggestion user={user}/>

        <Footer />
        
</div>

    );
};

export default Cart;
