import React, { useEffect, useState } from 'react';
import {
  X,
  Users,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Crown,
  User,
  Search,
  Filter,
  MoreVertical,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AuthApi from '../../../context/apiAuth';
import UserModal from './UserModal';
import UserApi from '../../../context/userApi';
import {toast} from 'react-toastify'
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const AllUsers = () => {

  const { lang } = useLanguage();
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AuthApi.get('/users', {
          params: {
            page: currentPage,
            limit: 10
          },
          withCredentials: true
        });
        if (res.data.success) {
          setData(res.data.users);
          setTotalPages(res.data.pagination?.totalPages || 1);
          setTotalUsers(res.data.pagination?.totalUsers || 0);
        }
      } catch (error) {
        console.log(error?.response?.data || 'Error');
      }
    };

    fetchUser();
  }, [lang, currentPage]);

  // Filter users on the frontend (from current page data only)
  const filteredUsers = data?.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' ||
                        (filterRole === 'admin' && user.role === 'admin') ||
                        (filterRole === 'user' && user.role === 'user');

    const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'active' && user.isActive) ||
                          (filterStatus === 'inactive' && !user.isActive) ||
                          (filterStatus === 'banned' && user.isBanned) ||
                          (filterStatus === 'verified' && user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus]);

  const getUserStatus = (user) => {
    if (user.isBanned) return { label: 'Banned', color: 'red', icon: Ban };
    if (!user.isActive) return { label: 'Inactive', color: 'gray', icon: XCircle };
    if (user.isVerified) return { label: 'Verified', color: 'green', icon: CheckCircle };
    return { label: 'Unverified', color: 'yellow', icon: XCircle };
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const deleteUser = async (user) => {
    try {
      const res = await UserApi.delete(`/delete/${user._id}`, { withCredentials: true });
      if (res.data.success) {
        toast(res.data.message || 'User Deleted Successfully');
        // Refresh the current page after delete
        const fetchUser = async () => {
          try {
            const res = await AuthApi.get('/users', {
              params: {
                page: currentPage,
                limit: 10
              },
              withCredentials: true
            });
            if (res.data.success) {
              setData(res.data.users);
              setTotalPages(res.data.pagination?.totalPages || 1);
              setTotalUsers(res.data.pagination?.totalUsers || 0);
            }
          } catch (error) {
            console.log(error?.response?.data || 'Error');
          }
        };
        fetchUser();
      }
    } catch (error) {
      toast.error( error?.response?.data?.message || "Something went wrong");
      console.log(error?.response?.data || error?.message);
    }
  };

  const handleAction = (action, user) => {
    switch (action) {
      case 'show':
        setSelectedUser(user);
        setIsModalOpen(true);
        break;
      case 'delete':
        deleteUser(user);
        break;

      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-6 space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t("usersManagement")} </h1>
                <p className="hidden md:inline text-slate-600 dark:text-slate-400">
                  {totalUsers || 0} {t("totalUsersRegistered")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("searchUsers")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="all">{t("allRoles")}</option>
              <option value="admin">{t("admins")}</option>
              <option value="user">{t("users")}</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
            >
              <option value="all">{t("allStatus")}</option>
              <option value="active">{t("active")}</option>
              <option value="inactive">{t("inactive")}</option>
              <option value="verified">{t("verified")}</option>
              <option value="banned">{t("banned")}</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{t("user")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{t("contact")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{t("roleStatus")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{t("activity")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{t("joined")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers && filteredUsers.map((user, index) => {
                  const status = getUserStatus(user);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={user._id}
                      className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/30 dark:bg-slate-700/20'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {user?.avatar ? (
                              <img
                                src={user?.avatar}
                                alt={user?.firstName + ' ' + user?.lastName}
                                className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                {getInitials(user?.firstName + ' ' + user?.lastName)}
                              </div>
                            )}
                            {user.isActive && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              {user?.firstName + ' ' + user?.lastName}
                              {user.role === 'admin' && (
                                <Crown className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              ID: {user._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                            <Mail className="w-4 h-4 text-slate-400" />
                            {user?.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Phone className="w-4 h-4 text-slate-400" />
                              {user?.phone || 'N/A'}
                            </div>
                          )}
                          {user.address?.city && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {user?.address?.city}, {user?.address?.country}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {user.role === 'admin' ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                <Shield className="w-3 h-3 mr-1" />
                                {t("admin")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                <User className="w-3 h-3 mr-1" />
                                {t("user")}
                              </span>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            status.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                            status.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
                          }`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {t(String(status.label).toLowerCase())}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Activity className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">
                              {t("lastLogin")}: {formatDate(user?.lastLogin)}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            {t("wishlist")}: {user?.wishList?.length || 0} {t("items")}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <div>{formatDate(user?.createdAt)}</div>
                            <div className="text-xs text-slate-500">
                              {getTimeSinceJoin(user?.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAction('show', user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction('delete', user)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers?.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">{t("noUsersFound")}</h3>
              <p className="text-slate-500 dark:text-slate-400">
                {t("adjustSearch")}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("page")} {currentPage} {t("of")} {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {t("previous")}
                </button>
                <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">{currentPage}</div>
                <button
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {t("next")}
                </button>
              </div>
            </div>
          )}
        </div>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {totalUsers}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t("totalUsers")}</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {data.filter(u => u.isActive).length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t("activeUsers")}</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {data.filter(u => u.role === 'admin').length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t("admin")}</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {data.filter(u => u.isVerified).length}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t("verified")}</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
};

export default AllUsers;