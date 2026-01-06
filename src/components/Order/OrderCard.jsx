import {
  Calendar,
  CheckCheck,
  Clock,
  DollarSign,
  Flag,
  MapPin,
  Package,
  XCircle,
} from "lucide-react";
import ReportModal from "../Report/ReportModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CopyableText from "../CopyableText";

const OrderCard = ({ order }) => {

  const { t } = useTranslation();
  const [showReportModal, setShowReportModal] = useState(false);

  // Payment Status
  const handlePaymentStatus = (orderStatus) => {
    const base =
      "flex items-center rounded-lg px-4 py-3 shadow-sm border";
    if (orderStatus === "paid")
      return (
        <div
          className={`${base} bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800`}
        >
          <CheckCheck
            size={20}
            className="text-green-700 dark:text-green-300 mr-3 shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t("payment")}
            </p>
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">
              {t("paid")}
            </p>
          </div>
        </div>
      );

    if (orderStatus === "pending")
      return (
        <div
          className={`${base} bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-800`}
        >
          <Clock
            size={20}
            className="text-yellow-700 dark:text-yellow-300 mr-3 shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {t("payment")}
            </p>
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
              {t("pending")}
            </p>
          </div>
        </div>
      );

    return (
      <div
        className={`${base} bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800`}
      >
        <XCircle
          size={20}
          className="text-red-700 dark:text-red-300 mr-3 shrink-0"
        />
        <div>
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {t("payment")}
          </p>
          <p className="text-sm font-semibold text-red-900 dark:text-red-100">
            {t("cancelled")}
          </p>
        </div>
      </div>
    );
  };

  // Delivery Status
  const handleDeliveryStatus = (status) => {
    const base =
      "flex items-center rounded-lg px-4 py-3 shadow-sm border";

    if (status === "delivered")
      return (
        <div
          className={`${base} bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800`}
        >
          <CheckCheck
            size={20}
            className="text-green-700 dark:text-green-300 mr-3"
          />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t("status")}
            </p>
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">
              {t("delivered")}
            </p>
          </div>
        </div>
      );

    if (["processing", "shipped", "in transit"].includes(status))
      return (
        <div
          className={`${base} bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-800`}
        >
          <Clock
            size={20}
            className="text-yellow-700 dark:text-yellow-300 mr-3"
          />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {t("status")}
            </p>
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
              {t(String(status).toLowerCase())}
            </p>
          </div>
        </div>
      );

    return (
      <div
        className={`${base} bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800`}
      >
        <XCircle
          size={20}
          className="text-red-700 dark:text-red-300 mr-3"
        />
        <div>
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {t("status")}
          </p>
          <p className="text-sm font-semibold text-red-900 dark:text-red-100">
            {t("cancelled")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 bg-white dark:bg-gray-900 transition">
      {/* Header */}
      <div className="flex items-center gap-3 border border-gray-100 dark:border-gray-700 rounded-lg p-4 mb-6 bg-slate-50 dark:bg-gray-800">
        <div className="p-2 bg-slate-200 dark:bg-gray-700 rounded-xl">
          <Package className="w-6 h-6 text-slate-600 dark:text-gray-300" />
        </div>
        <div>
          <h2 className="flex items-center justify-between text-xs md:text-lg font-semibold text-slate-800 dark:text-gray-100">
            <span> {t("order")}</span> #{<CopyableText text={order._id} />}
          </h2>
          <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
            <Calendar size={17} />
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {handlePaymentStatus(order.paymentResult.status)}
        {handleDeliveryStatus(order.delivery)}

        {/* Address */}
        <div className="flex items-center bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm">
          <MapPin
            size={22}
            className="text-slate-600 dark:text-gray-300 mr-3"
          />
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-gray-100">
              {t("deliveryAddress")}
            </p>
            <p className="text-sm text-slate-600 dark:text-gray-300">
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex items-center bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 shadow-sm">
          <DollarSign
            size={22}
            className="text-blue-600 dark:text-blue-300 mr-3"
          />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t("totalAmount")}
            </p>
            <p className="text-base font-bold text-blue-700 dark:text-blue-100">
              ${order.totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="my-8">
        <div className="flex gap-2 items-center text-lg font-semibold my-4 text-gray-900 dark:text-gray-100">
          <Package size={21} />
          {t("orderItems")}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {order.orderItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 bg-slate-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <img
                className="w-24 h-24 object-cover rounded-2xl"
                src={item.product?.images[0]}
                alt=""
              />

              <div className="flex flex-col gap-1.5 text-gray-900 dark:text-gray-100">
                <span className="font-semibold">{item.product?.name}</span>
                <span className="text-sm text-slate-600 dark:text-gray-300">
                  {t("quantity")}: {item.quantity}x
                </span>
                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>

                <div className="flex gap-2">
                  <span className="bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-100 text-[13px] px-2 py-0.5 border border-gray-600 dark:border-gray-500 rounded-md">
                    {t("color")}: {item.color}
                  </span>
                  <span className="bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-100 text-[13px] px-2 py-0.5 border border-gray-600 dark:border-gray-500 rounded-md">
                    {t("size")}: {item.size}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-2 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2 text-sm font-semibold transition-all shadow-sm hover:shadow-md"
        >
          <Flag size={18} />
          {t("reportProblem")}
        </button>
      </div>

      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="order"
        targetId={order._id}
        context={{ orderNumber: order.orderNumber }}
      />
    </div>
  );
};

export default OrderCard;
