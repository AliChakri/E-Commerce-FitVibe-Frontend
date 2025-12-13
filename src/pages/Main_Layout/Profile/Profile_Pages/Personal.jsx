import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar,
  Edit2, Save, X, Upload, Shield, Camera, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthProvider';
import UserApi from '../../../../context/userApi';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Personal = () => {

  const { t } = useTranslation();
  const { user, setUser } = useAuth(); // Assuming setUser exists to update context
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Separate state for each section
  const [nameData, setNameData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const [addressData, setAddressData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    // state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  // Update states when user changes
  useEffect(() => {
    setNameData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
    setAddressData({
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || ''
    });
    setAvatarPreview(user?.avatar || '');
  }, [user]);

  // Handle name changes
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setNameData(prev => ({ ...prev, [name]: value }));
  };

  // Handle address changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

// Handle avatar change
const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setAvatarFile(file);

  // Show preview (optional but nice)
  const previewUrl = URL.createObjectURL(file);
  setAvatarPreview(previewUrl);

  // Auto upload
  await changeAvatar(file);
};

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // API: Change Name
  const changeName = async () => {
    try {
      setLoading(true);
      const res = await UserApi.put('/me/name', {nameData}, { withCredentials: true });
      
      if (res.data.success) {
        // Update user context if setUser exists
        if (setUser) {
          setUser(prev => ({
            ...prev,
            firstName: user?.firstName,
            lastName: user?.lastName
          }));
        }
        showMessage('success', 'Name updated successfully!');
        setEditingSection(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update name');
      console.error('Error updating name:', error);
    } finally {
      setLoading(false);
    }
  };

// API: Change Avatar
const changeAvatar = async (file) => {
  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await UserApi.put("/me/avatar", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      // Update context user
      if (setUser) {
        setUser(prev => ({
          ...prev,
          avatar: res.data.user?.avatar
        }));
      }

      showMessage("success", "Avatar updated successfully!");
    }

  } catch (error) {
    console.error( error?.response?.data?.message || "Error updating avatar:");
    toast.error(error?.response?.data?.message || "Failed to update avatar");
  } finally {
    setLoading(false);
  }
};

  // API: Change Address
  const changeAddress = async () => {
    try {
      setLoading(true);
      const res = await UserApi.put('/me/address', { address: addressData }, { withCredentials: true });
      
      if (res.data.success) {
        if (setUser) {
          setUser(prev => ({
            ...prev,
            address: addressData
          }));
        }
        showMessage('success', 'Address updated successfully!');
        setEditingSection(null);
      }
    } catch (error) {
      toast.error( error.response?.data?.message || 'Failed to update address');
      console.error('Error updating address:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = (section) => {
    if (section === 'personal') {
      setNameData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || ''
      });
    } else if (section === 'address') {
      setAddressData({
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        postalCode: user?.address?.postalCode || '',
        country: user?.address?.country || ''
      });
    }
    setEditingSection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8  mt-[10vh]">
      <div className="max-w-6xl mx-auto">

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </div>
        )}

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t("myProfile")}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t("manageYourPersonalInformation")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition">

              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative mb-6 group">
                  <img
                    src={avatarPreview || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500 ring-offset-4 ring-offset-white dark:ring-offset-gray-800"
                  />

                  {/* Hover upload overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition cursor-pointer">
                    <label className="cursor-pointer">
                      <Camera className="w-8 h-8 text-white" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full shadow-md">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium capitalize">
                    {t(String(user?.role).toLocaleLowerCase()) || t("user")}
                  </span>
                </div>

                {/* Contact */}
                <div className="w-full mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 mb-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 mb-3">
                      <Phone className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">{user?.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">
                      {t("joined")} {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* PERSONAL INFO CARD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("personalInformation")}</h3>
                </div>

                {editingSection !== 'personal' ? (
                  <button
                    onClick={() => setEditingSection('personal')}
                    className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t("edit")}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancel('personal')}
                      className="px-4 py-2 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" /> {t("cancel")}
                    </button>
                    <button
                      onClick={changeName}
                      disabled={loading}
                      className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {t("save")}
                    </button>
                  </div>
                )}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">
                    {t("firstName")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={nameData.firstName}
                    onChange={handleNameChange}
                    disabled={editingSection !== "personal"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">
                    {t("lastName")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={nameData.lastName}
                    onChange={handleNameChange}
                    disabled={editingSection !== "personal"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">{t("email")}</label>
                  <input
                    disabled
                    value={user?.email}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">{t("phone")}</label>
                  <input
                    disabled
                    value={user?.phone || t("notProvided")}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS CARD */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">

              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("shippingAddress")}</h3>
                </div>

                {editingSection !== "address" ? (
                  <button
                    onClick={() => setEditingSection("address")}
                    className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t("edit")}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancel('address')}
                      className="px-4 py-2 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" /> {t("cancel")}
                    </button>
                    <button
                      onClick={changeAddress}
                      disabled={loading}
                      className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {t("save")}
                    </button>
                  </div>
                )}
              </div>

              {/* Address Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("street")}</label>
                  <input
                    type="text"
                    name="street"
                    value={addressData.street}
                    onChange={handleAddressChange}
                    disabled={editingSection !== "address"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("city")}</label>
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    disabled={editingSection !== "address"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">State</label>
                  <input
                    type="text"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    disabled={editingSection !== "address"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div> */}

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("country")}</label>
                  <input
                    type="text"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressChange}
                    disabled={editingSection !== "address"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">{t("postalCode")}</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={addressData.postalCode}
                    onChange={handleAddressChange}
                    disabled={editingSection !== "address"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 font-medium">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressChange}
                    disabled={editingSection !== "address"}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div> */}
              </div>
            </div>

            {/* ACCOUNT DETAILS CARD */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-xl font-bold mb-4">{t("accountDetails")}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-gray-100">{t("memberSince")}</p>
                  <p className="text-lg font-semibold">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-gray-100">{t("accountStatus")}</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    {t("active")}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;