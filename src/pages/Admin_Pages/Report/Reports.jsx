import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  TrendingUp,
  X,
  Eye,
  Trash2,
  MessageSquare,
  Package,
  ShoppingCart,
  Bug,
  MessageCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  AlertCircle,
  Moon,
  Sun,
} from 'lucide-react';
import ReportApi from '../../../context/reportApi';
import ReportDetailModal from './ReportDetailModal';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../context/LanguageContext';

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, darkMode }) => {

  
  const colors = {
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40',
    yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/40',
    green: 'text-green-600 bg-green-100 dark:bg-green-900/40',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );
};

const Reports = () => {


  const { lang } = useLanguage();
  const { t } = useTranslation();

  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
    const [darkMode, setDarkMode] = useState(true);
    
  const loadReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        order: 'desc',
      });

      // Add filters if not "all"
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.severity !== 'all') params.append('severity', filters.severity);

      const response = await ReportApi.get(`/?${params.toString()}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setReports(response.data.reports);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages,
        });
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ReportApi.get('/stats', {
        withCredentials: true,
      });
      
      if (response.data.success) {
        const statsData = response.data.stats;
        
        // Transform stats data
        setStats({
          total: statsData.total[0]?.count || 0,
          open: statsData.byStatus.find(s => s._id === 'open')?.count || 0,
          inProgress: statsData.byStatus.find(s => s._id === 'in-progress')?.count || 0,
          resolved: statsData.byStatus.find(s => s._id === 'resolved')?.count || 0,
          byType: {
            review: statsData.byType.find(t => t._id === 'review')?.count || 0,
            product: statsData.byType.find(t => t._id === 'product')?.count || 0,
            order: statsData.byType.find(t => t._id === 'order')?.count || 0,
            system: statsData.byType.find(t => t._id === 'system')?.count || 0,
            reply: statsData.byType.find(t => t._id === 'reply')?.count || 0,
          },
          bySeverity: {
            low: statsData.bySeverity.find(s => s._id === 'low')?.count || 0,
            medium: statsData.bySeverity.find(s => s._id === 'medium')?.count || 0,
            high: statsData.bySeverity.find(s => s._id === 'high')?.count || 0,
            critical: statsData.bySeverity.find(s => s._id === 'critical')?.count || 0,
          },
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await ReportApi.delete(`/${reportId}`, {
        withCredentials: true,
      });

      setSelectedReport(null);
      if (response.data.success) {
        toast.success('Report deleted successfully');
        loadReports();
        loadStats();
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error(error.response?.data?.message || 'Failed to delete report');
    }
  };
  
  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    severity: 'all',
    search: '',
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Mock data for demonstration
  useEffect(() => {
    loadReports();
    loadStats();
  }, [filters, pagination.page]);

  const getTypeIcon = (type) => {
    const icons = {
      review: MessageSquare,
      reply: MessageCircle,
      product: Package,
      order: ShoppingCart,
      system: Bug,
    };
    return icons[type] || AlertCircle;
  };

  const getTypeColor = (type) => {
    const colors = {
      review: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      reply: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
      product: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      order: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      system: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    };
    return colors[type] || 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300', icon: Clock },
      'in-progress': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300', icon: RefreshCw },
      resolved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle2 },
      dismissed: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: X },
    };
    return badges[status] || badges.open;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-300',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-300',
      high: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-300',
      critical: 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-300',
    };
    return colors[severity] || colors.low;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 7) return d.toLocaleDateString();
    if (days > 0) return `${days} ${t("dayAgo")}`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };
  
    const toCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase());

return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("reportsDashboard")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("monitorReports")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title={t("totalReports")}
            value={stats.total}
            icon={AlertTriangle}
            color="purple"
            darkMode={darkMode}
          />
          <StatCard
            title={t("open")}
            value={stats.open}
            icon={Clock}
            color="yellow"
            darkMode={darkMode}
          />
          <StatCard
            title={t("inProgress")}
            value={stats.inProgress}
            icon={RefreshCw}
            color="blue"
            darkMode={darkMode}
          />
          <StatCard
            title={t("resolved")}
            value={stats.resolved}
            icon={CheckCircle2}
            color="green"
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder={t("searchReports")}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="all">{t("allTypes")}</option>
            <option value="review">{t("review")}</option>
            <option value="reply">{t("reply")}</option>
            <option value="product">{t("product")}</option>
            <option value="order">{t("order")}</option>
            <option value="system">{t("system")}</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="all">{t("allStatus")}</option>
            <option value="open">{t("open")}</option>
            <option value="in-progress">{t("inProgress")}</option>
            <option value="resolved">{t("resolved")}</option>
            <option value="dismissed">{t("dismissed")}</option>
          </select>

          {/* Severity Filter */}
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="all">{t("allSeverity")}</option>
            <option value="low">{t("low")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="high">{t("high")}</option>
            <option value="critical">{t("critical")}</option>
          </select>

          {/* Export Button */}
          {/* <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t("export")}
          </button> */}
        </div>
      </div>

      {/* Reports Table */}
<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">
  {loading ? (
    <div className="p-12 text-center">
      <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">{t("loadingReports")}</p>
    </div>
  ) : reports.length === 0 ? (
    <div className="p-12 text-center">
      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {t("noReportsFound")}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{t("tryAdjustingFilters")}</p>
    </div>
  ) : (
    <>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
            <tr>
              {["Type", "Reason", "Reporter", "Severity", "Status", "Date", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                >
                  {t(String(h).toLowerCase())}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {reports.map((report) => {
              const TypeIcon = getTypeIcon(report.type);
              const statusBadge = getStatusBadge(report.status);
              const StatusIcon = statusBadge.icon;

              return (
                <tr
                  key={report._id}
                  className="hover:bg-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  {/* Type */}
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTypeColor(
                        report.type
                      )}`}
                    >
                      <TypeIcon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                        {t(String(report.type).toLowerCase())}
                      </span>
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t(toCamelCase(report.reason))}
                      
                    </p>
                    {report.message && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                        {report.message}
                      </p>
                    )}
                  </td>

                  {/* Reporter */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {report.user.firstName} {report.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {report.user.email}
                    </p>
                  </td>

                  {/* Severity */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(
                        report.severity
                      )}`}
                    >
                      {t(String(report.severity).toLowerCase())}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {t(String(report.status).toLowerCase())}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(report.createdAt)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteReport(report._id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                        title="Delete"
                      >
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

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-300 dark:border-gray-700 flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("showing")}{" "}
          <span className="font-medium">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{" "}
          {t("to")}{" "}
          <span className="font-medium">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{" "}
          {t("of")} <span className="font-medium">{pagination.total}</span> {t("reports")}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
            {t("page")} {pagination.page} {t("of")} {pagination.pages}  
          </span>

          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </>
  )}
</div>

    </div>

    {/* Report Detail Modal */}
    {selectedReport && (
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        darkMode={darkMode}
        onUpdate={loadReports}
        loadReports={loadReports}
        loadStats={loadStats}
        setSelectedReport={setSelectedReport}
      />
    )}
  </div>
);

};

// Detail Row Component
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
      {value}
    </span>
  </div>
);

export default Reports