import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import OrderApi from "../../../context/orderApi";
import { CreditCard, Shield, Package } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const { lang } = useLanguage();
  const { t } = useTranslation();

  // prevent double init (React 18 StrictMode)
  const initedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await OrderApi.get(`/${id}`, { withCredentials: true });
        setOrder(res?.data?.order);
      } catch (err) {
        console.error("[PAY] fetch order error:", err);
      }
    })();
  }, [id]);


  useEffect(() => {
    if (!order) return;
    if (initedRef.current) return;
    initedRef.current = true;

    // load SDK once
    if (!window.paypal && !document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        import.meta.env.VITE_PAYPAL_CLIENT_ID || ""
      )}&currency=USD&intent=capture&components=buttons`;
      script.onload = () => {
        // console.log("[PAY] PayPal SDK loaded");
        renderPayPalButtons();
      };
      script.onerror = (e) => console.error("[PAY] SDK failed to load:", e);
      document.body.appendChild(script);
    } else {
      renderPayPalButtons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const renderPayPalButtons = () => {
    const container = document.getElementById("paypal-button-container");
    if (!container) {
      console.error("[PAY] Missing #paypal-button-container");
      return;
    }
    container.innerHTML = ""; // ✅ avoid multiple renders

    try {
      window.paypal
        .Buttons({
          style: { layout: "vertical", shape: "rect", label: "paypal" },

          createOrder: async () => {
            try {
              const res = await OrderApi.post(
                `/${id}/paypal/create`,
                {},
                { withCredentials: true }
              );

              // Accept common shapes: {id}, {orderID}, {paypalOrderId}
              const orderId =
                res.data?.id || res.data?.orderID || res.data?.paypalOrderId;

              if (!orderId || typeof orderId !== "string") {
                throw new Error("Backend did not return a valid PayPal order ID");
              }
              return orderId;
            } catch (e) {
              console.error("[PAY] createOrder error:", e);
              // Throw to tell PayPal to abort (prevents stuck popup)
              throw e;
            }
          },

          onApprove: async (data) => {
            try {
              const capture = await OrderApi.post(
                `/${id}/paypal/capture`,
                { orderID: data.orderID },
                { withCredentials: true }
              );
              navigate(`/order/${id}`);
            } catch (e) {
              console.error("[PAY] capture error:", e);
              alert(
                "Payment approved but capture failed. Check console/network tab."
              );
            }
          },

          onCancel: (data) => {
            console.warn("[PAY] user cancelled:", data);
          },

          onError: (err) => {
            console.error("[PAY] PayPal onError:", err);
            alert("PayPal error: " + (err?.message || "unknown error"));
          },
        })
        .render("#paypal-button-container");
    } catch (e) {
      console.error("[PAY] Buttons init error:", e);
    }
  };

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        {t("loadingOrder")}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 mt-[10vh]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8 space-y-8">
        <div className="flex items-center gap-3">
          <CreditCard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("completeYourPayment")}
          </h2>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              <span className="inline">{t("order")}</span> #{order?._id}
            </span>
          </div>

          <div className="space-y-4">
            {order?.orderItems?.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
              >
                <img
                  src={item?.product?.images?.[0] || "https://via.placeholder.com/60"}
                  alt={item.product?.name?.[lang] || item.product?.name?.en}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {item?.product?.name?.[lang] || item?.product?.name?.en}
                  </h4>
                  <div className="flex gap-2 mt-1">
                    {!!item?.size && (
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {item?.size}
                      </span>
                    )}
                    {!!item?.color && (
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full">
                        {item?.color}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {t("quantity")}: {item?.quantity}
                  </p>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  ${(item?.product?.price * item?.quantity)?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-600 pt-4 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>${order?.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("shipping")}</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between">
              <span>{t("tax")}</span>
              <span>{t("calculatedAtCheckout")}</span>
            </div>
            <hr className="border-gray-200 dark:border-gray-600" />
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
              <span>{t("total")}</span>
              <span>${(order?.totalPrice + 5.99)?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
              alt="PayPal"
              className="h-8"
            />
            <p className="text-gray-900 dark:text-gray-100 font-semibold">
              {t("paySecurelyWithPaypal")}
            </p>
          </div>
          <div id="paypal-button-container"></div>
          <div className="flex items-center gap-2 mt-5 text-sm text-gray-500 dark:text-gray-400">
            <Shield className="h-4 w-4" />
            <span>{t("paymentInfoEncryptedSecure")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
