import React, { useEffect, useState } from 'react';
import OrderApi from '../../context/orderApi';
import { useAuth } from '../../context/AuthProvider';
import OrderModal from './OrderModal';
import { toast } from 'react-toastify';
import { 
  Search,Package, Eye, Edit3, ArrowUpDown, X,
  CheckCircle, Clock, XCircle, ArrowDown, ArrowUp, Edit2, Package2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

const AllOrders = () => {
  
  const { user } = useAuth();
  const { t } = useTranslation();
  const { lang } = useLanguage();

  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [delivery, setDelivery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [date, setDate] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dropdownOrderId, setDropdownOrderId] = useState(null);
  const [editingDeliveryId, setEditingDeliveryId] = useState(null);
  const [deliveryValues, setDeliveryValues] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch orders function - cleaned up
  const fetchOrders = async () => {
    setLoading(true);

    try {
      // Build params object with only defined values
      const params = {};
      
      if (status) params.status = status;
      if (search && search.trim()) params.search = search.trim();
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (sort) params.sort = sort;
      if (delivery) params.delivery = delivery;
      
      // Always include these
      params.date = date.toString();
      params.page = currentPage;
      params.limit = 10;

      const res = await OrderApi.get('/all', {
        params,
        withCredentials: true,
      });

      if (res?.data?.success) {
        const ordersArray = res?.data?.orders || [];
        
        if (!Array.isArray(ordersArray)) {
          toast.error('Invalid data format received');
          return;
        }

        setOrders(ordersArray);
        setTotalPages(res.data.totalPages || 1);

        // Set initial delivery values
        const initialDeliveries = {};
        ordersArray.forEach((order) => {
          if (order && order._id) {
            initialDeliveries[order._id] = order.delivery || 'processing';
          }
        });
        setDeliveryValues(initialDeliveries);

      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Fetch error:', error?.response?.data || error?.message);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [status, date, sort, delivery, currentPage, search, startDate, endDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status, date, sort]);

  // Handler functions
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await OrderApi.put(`/${orderId}/${newStatus}`, { status: newStatus });
      if (res.data.success) {
        setDropdownOrderId(null);
        fetchOrders();
        toast.success('Status updated successfully');
      }
    } catch (error) {
      console.error('Status update error:', error?.response?.data || error?.message);
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleUpdateDelivery = async (orderId, deliveryState) => {
    try {
      const res = await OrderApi.put(`/delivery/${orderId}/${deliveryState}`);
      if (res.data.success) {
        fetchOrders();
        toast.success('Delivery status updated successfully');
        setEditingDeliveryId(null);
      }
    } catch (error) {
      console.error('Delivery update error:', error?.response?.data || error?.message);
      toast.error( error?.response?.data?.message || 'Failed to update delivery status');
    }
  };

  // UI helper functions
  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const icons = {
      paid: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badges[status] || badges.pending}`}>
        {icons[status] || icons.pending}
        {status ? t(String(status).toLowerCase()) : t('pending')}
      </span>
    );
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setDelivery('');
    setStartDate('');
    setEndDate('');
    setSort('');
    setDate(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = search || status || delivery || startDate || endDate || sort;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          {/* Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Package2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t("orderManagement")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {t("orderManagementDesc")}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{t("totalOrders")}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{orders.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 items-center mb-4">
              {['', 'paid', 'pending', 'cancelled'].map((s) => {
                const isActive = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {s ? t(String(s).toLocaleLowerCase()) : t("allStatus")}
                    
                  </button>
                );
              })}

              {/* Delivery Filters */}
              {['', 'delivered', 'processing'].map((d) => {
                const isActive = delivery === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDelivery(d)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {d ? t(String(d).toLocaleLowerCase()) : t("allDelivery")}
                    
                  </button>
                );
              })}

              {/* Today Button */}
              <button
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  setStartDate(today);
                  setEndDate(today);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  startDate === endDate &&
                  startDate === new Date().toISOString().split("T")[0]
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                }`}
              >
                {t("today")}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors duration-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  {t("clearAll")}
                </button>
              )}
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("searchOrders")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sort */}
              <div className="flex flex-wrap gap-2 items-center">
                {[
                  { label: "Price", value: "priceAsc" },
                  { label: "Price", value: "priceDesc" },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setSort(value)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      sort === value
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {t(String(label).toLocaleLowerCase()) + (value.includes("Asc") ? " ↑" : " ↓")}
                  </button>
                ))}

                {/* Dates */}
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-3 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 rounded-xl"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-3 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 rounded-xl"
                />

                <button
                  onClick={() => setDate(!date)}
                  className="p-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-xl"
                >
                  {date ? (
                    <ArrowUp className="text-blue-500" size={20} />
                  ) : (
                    <ArrowDown className="text-blue-500" size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SUMMARY */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            {loading ? (
              t("loadingOrders")
            ) : (
              <>
                {t("showing")} {" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {orders.length}
                </span>{" "}
                {t("orders")}
                {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </>
            )}
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">

          {/* Loading */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">{t("loadingOrders")}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t("noOrdersFound")}</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {t("adjustSearch")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-700 dark:to-gray-800 border-b border-slate-200 dark:border-gray-700">
                  <tr>
                    {["#", "Date", "Customer", "Payment", "Total", "Delivery", "Items", "Actions"].map(
                      (h) => (
                        <th key={h} className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                          {t(String(h).toLowerCase())}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                {/* BODY */}
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order._id}
                      className="border-b border-slate-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                          #{(currentPage - 1) * 10 + index + 1}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6">
                        <div className="text-sm text-slate-900 dark:text-white">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(order.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-900 dark:text-white">
                        {order.paymentResult?.email || "N/A"}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-6">{getStatusBadge(order.paymentResult?.status)}</td>

                      {/* Total */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-white text-lg">
                          ${order.totalPrice?.toFixed(2) || "0.00"}
                        </div>
                      </td>

                      {/* Delivery Selector */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            className="px-3 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            value={deliveryValues[order._id] || "processing"}
                            disabled={editingDeliveryId !== order._id}
                            onChange={(e) =>
                              setDeliveryValues((prev) => ({
                                ...prev,
                                [order._id]: e.target.value,
                              }))
                            }
                          >
                            <option value="processing">{t("Processing")}</option>
                            <option value="shipped">{t("Shipped")}</option>
                            <option value="in transit">{t("InTransit")}</option>
                            <option value="delivered">{t("Delivered")}</option>
                            <option value="cancelled">{t("Cancelled")}</option>
                          </select>

                          {editingDeliveryId !== order._id ? (
                            <button
                              onClick={() => setEditingDeliveryId(order._id)}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200 group"
                            >
                              <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-green-600" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUpdateDelivery(order._id, deliveryValues[order._id])
                              }
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                            >
                              {t("save")}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Items Count */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {order.orderItems?.length || 0}
                          </span>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">

                          {/* View */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          </button>

                          {/* Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setDropdownOrderId(
                                  dropdownOrderId === order._id ? null : order._id
                                )
                              }
                              className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                              <Edit3 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                            </button>

                            {dropdownOrderId === order._id && (
                              <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-48">
                                <div className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-gray-700">
                                  {t("changePaymentStatus")}
                                </div>

                                {[
                                  { value: "paid", label: "Paid", color: "text-green-600" },
                                  { value: "pending", label: "Pending", color: "text-amber-600" },
                                  { value: "cancelled", label: "Cancelled", color: "text-red-600" },
                                ].map(({ value, label, color }) => (
                                  <button
                                    key={value}
                                    onClick={() => handleUpdateStatus(order._id, value)}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors duration-200 ${color}`}
                                  >
                                    {t(String(label).toLocaleLowerCase())}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {t("previous")}
                </button>
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">{currentPage}</div>
                <button
                  className="px-4 py-2 border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t("next")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t("orderDetails")}</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] text-slate-900 dark:text-slate-200">
                <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default AllOrders;