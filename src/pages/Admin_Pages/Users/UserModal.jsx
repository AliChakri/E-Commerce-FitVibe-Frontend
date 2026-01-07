
import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  User, 
  Crown, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Activity, 
  Heart, 
  ShoppingBag, 
  Clock,
  Edit,
  Trash2,
  MoreVertical,
  Globe,
  Star,
  TrendingUp,
  Package,
  User2,
  DollarSignIcon,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'react-toastify';
import UserApi from '../../../context/userApi';
import { useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const UserModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const { t } = useTranslation();
  const { lang } = useLanguage();
    
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await UserApi.post(`/details/${user._id}`, { withCredentials: true });
        if (res.data.success) {
          setData(res.data);
        }
      } catch (error) {
        toast.error( error?.response?.data?.message || 'Something went wrong');
        console.log(error?.response?.data || 'Internal server Error');
      }
    }
    fetchUserDetails();
  }, []);

  const getUserStatus = (user) => {
    if (user.isBanned) return { label: 'Banned', color: 'red', icon: Ban, bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' };
    if (!user.isActive) return { label: 'Inactive', color: 'gray', icon: XCircle, bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-700 dark:text-gray-300' };
    if (user.isVerified) return { label: 'Verified', color: 'green', icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' };
    return { label: 'Unverified', color: 'yellow', icon: XCircle, bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' };
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getTimeSinceJoin = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return `1 ${t("dayAgo")}`;
    if (diffDays < 30) return `${diffDays} ${t("dayAgo")}`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ${t("monthsAgo")}`;
    return `${Math.floor(diffDays / 365)} ${t("yearsAgo")}`;
  };

  const status = getUserStatus(user);
    const StatusIcon = status.icon;
    

    const handleBanUser = async () => {
        try {
        const res = await UserApi.post(`/ban/${user._id}`, { withCredentials: true });
        if (res.data.success) {
            toast(res.data.message || 'Changed Successfully');
            onClose?.();
        }
        } catch (error) {
        toast.error( error?.response?.data?.message || "Something went wrong");
        console.log(error?.response?.data || error?.message);
        }
    };
    
    const deleteUser = async () => {
        try {
            const res = await UserApi.delete(`/delete/${user._id}`, { withCredentials: true });
            if (res.data.success) {
                toast(res.data.message || 'User Deleted Successfully');
                onClose?.();
            }
        } catch (error) {
            toast.error( error?.response?.data?.message || "Something went wrong");
            console.log(error?.response?.data || error?.message);
        }
  };
  
  const handleRoleChange = async () => {
    try {
      const res = await UserApi.post(`/role/${user._id}`, { withCredentials: true });
      if (res.data.success) {
        toast(res.data.message || 'Role has been changed successfully');
        onClose?.()
      }
    } catch (error) {
      toast.error( error?.response?.data?.message || "Something went wrong");
      console.log(error?.response?.data || error?.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">

            <div className="absolute inset-0 bg-black/10"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user?.firstName + ' ' + user?.lastName} 
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white/20" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white/20">
                    {getInitials(user?.firstName + ' ' + user?.lastName)}
                  </div>
                )}
                {user.isActive && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 flex-col md:flex-row text-white">

                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">{user?.firstName + ' ' + user?.lastName}</h2>
                  {user.role === 'admin' && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-500 rounded-full">
                      <Crown className="w-4 h-4" />
                      <span className="text-sm font-semibold">{t("admin")}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-white/80 text-lg mb-4">{user.email}</p>
                
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.text} bg-white/20 text-white`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="font-semibold">{t(String(status.label).toLocaleLowerCase())}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span>{t("joined")} {getTimeSinceJoin(user.createdAt)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Contact & Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Contact Information */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    {t("contactInformation")}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t("emailAddress")}</p>
                        <p className="font-medium text-slate-900 dark:text-white">{user.email.slice(0, 17)}...</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t("phoneNumber")}</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {user.phone || t("notProvided")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    {t("addressInformation")}
                  </h3>
                  
                  {user.address && (user.address.street || user.address.city) ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                          <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {user.address.street && `${user.address.street}, `}
                            {user.address.city && `${user.address.city}, `}
                            {user.address.country}
                          </p>
                          {user.address.postalCode && (
                            <p className="text-slate-500 dark:text-slate-400">
                              {t("postalCode")}: {user.address.postalCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">{t("noAddressProvided")}</p>
                  )}
                </div>

                {/* Activity Timeline */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    {t("activityTimeline")}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-600 rounded-xl">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t("accountCreated")}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-600 rounded-xl">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t("lastLogin")}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(user.lastLogin)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-white dark:bg-slate-600 rounded-xl">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{t("profileUpdated")}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Investement Timeline */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    {t("ordersCart")}
                  </h3>

                {/* Orders */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    {t("orders")}
                  </h4>

                  {data?.orders?.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-600">
                      {data.orders.map((order) => (
                        <div key={order._id} className="mb-6 last:mb-0">
                          {/* Order header */}
                          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-t-lg">
                            <div className="flex items-center gap-4">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {t("orderId")} #{order._id.slice(-6)}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-300">
                                {order?.orderItems?.length} {t("items")} – ${order?.totalPrice?.toFixed(2)}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                order?.isPaid
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                              }`}
                            >
                              {order?.isPaid ? t("paid") : t("pending")}
                            </span>
                          </div>

                          {/* Order items table */}
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-t border-slate-200 dark:border-slate-600 text-sm">
                              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                                <tr>
                                  <th className="px-4 py-2 text-left text-slate-600 dark:text-slate-300 font-medium">{t("image")}</th>
                                  <th className="px-4 py-2 text-left text-slate-600 dark:text-slate-300 font-medium">{t("product")}</th>
                                  <th className="px-4 py-2 text-left text-slate-600 dark:text-slate-300 font-medium">{t("quantity")}</th>
                                  <th className="px-4 py-2 text-left text-slate-600 dark:text-slate-300 font-medium">{t("price")}</th>
                                  <th className="px-4 py-2 text-left text-slate-600 dark:text-slate-300 font-medium">{t("variant")}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                                {order?.orderItems?.map((p, i) => (
                                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                    <td className="px-4 py-2">
                                      <img
                                        src={p?.product?.images?.[0] || "/placeholder.png"}
                                        alt={p?.product?.name?.[lang]}
                                        className="w-12 h-12 rounded-md object-cover border border-slate-200 dark:border-slate-500"
                                      />
                                    </td>
                                    <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">
                                      {p?.product?.name?.[lang] || "Unnamed Product"}
                                    </td>
                                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{p?.quantity}</td>
                                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">${p?.product?.price || 0}</td>
                                    <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                                      {p?.size || p?.color ? (
                                        <span className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-200">
                                          {p?.size} {p?.color && `/ ${p?.color}`}
                                        </span>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">{t("noOrdersYet")}</p>
                  )}
                </div>

                  {/* Cart */}
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      {t("cart")}
                    </h4>

                    {((Array.isArray(data?.cart) && data.cart.length > 0) ||
                      (Array.isArray(data?.cart?.items) && data.cart.items.length > 0)) ? (
                      <div className="divide-y divide-slate-200 dark:divide-slate-500 max-h-56 overflow-y-auto pr-2 rounded-lg border border-slate-200 dark:border-slate-600">
                        {(data.cart.items || data.cart).map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-4 p-3 hover:bg-slate-100 dark:hover:bg-slate-600/60 transition"
                          >
                            {/* Image */}
                            <img
                              src={item.product?.images?.[0] || "/placeholder.png"}
                              alt={item.product?.name?.[lang]}
                              className="w-14 h-14 rounded-md object-cover border border-slate-200 dark:border-slate-500"
                            />

                            {/* Product Info */}
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {item.product?.name?.[lang] || "Unnamed Product"}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-300">
                                {item.quantity} × ${item.product?.price || 0}
                              </p>
                            </div>

                            {/* Variant */}
                            {(item.size || item.color) && (
                              <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-200">
                                {item.size} {item.color && `/ ${item.color}`}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 italic">{t("cartIsEmpty")}</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column - Stats & Actions */}
              <div className="space-y-6">
                
                {/* User Stats */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t("userStatistics")}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                          <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{t("wishlistItems")}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {user.wishList?.length || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                          <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{t("totalOrders")}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{data?.orders?.length || 0}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                          <DollarSignIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{t("totalSpent")}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{data?.total?.toFixed(2) || 0}$</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-600 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{t("userId")}</span>
                      </div>
                      <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                        {user._id.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t("actions")}</h3>
                  
                  <div className="space-y-3">

                    <button
                        onClick={()=> handleRoleChange()}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      user.isAdmin
                        ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/50 dark:hover:bg-purple-900 dark:text-purple-300'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/50 dark:hover:bg-amber-900 dark:text-amber-300'
                    }`}>
                      
                      {user.role === 'admin' ? <User2 className="w-4 h-4" /> : <Crown className="w-4 h-4" />}
                      <span>{user.role === 'admin' ? t("setToUser") : t("setToAdmin")}</span>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 dark:text-purple-300 rounded-xl transition-colors">
                      <Mail className="w-4 h-4" />
                      <span>{t("sendEmail")}</span>
                    </button>

                    <button
                        onClick={()=> handleBanUser(user)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      user.isBanned
                        ? 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/50 dark:hover:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300'
                    }`}>
                      <Ban className="w-4 h-4" />
                      <span>{user.isBanned ? t("unbanUser") : t("banUser")}</span>
                    </button>

                    <button onClick={() =>deleteUser()} className="w-full flex items-center gap-3 p-3 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/50 dark:hover:bg-red-900 dark:text-red-300 rounded-xl transition-colors">
                      <Trash2  className="w-4 h-4" />
                      <span>{t("deleteUser")}</span>
                    </button>

                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t("accountStatus")}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t("active")}</span>
                      <div className={`w-3 h-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t("verified")}</span>
                      <div className={`w-3 h-3 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t("admin")}</span>
                      <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-purple-500' : 'bg-gray-400'}`}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t("banned")}</span>
                      <div className={`w-3 h-3 rounded-full ${user.isBanned ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;