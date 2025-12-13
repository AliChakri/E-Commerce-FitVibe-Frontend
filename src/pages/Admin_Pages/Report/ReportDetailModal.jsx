import {
  CheckCircle2,
  X,
  MessageSquare,
  Package,
  ShoppingCart,
  Bug,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import { useState } from "react";
import ReportApi from '../../../context/reportApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Report Detail Modal Component
const ReportDetailModal = ({ report, onClose, darkMode, onUpdate, loadReports, loadStats, setSelectedReport }) => {

  const { t } = useTranslation();
  const [status, setStatus] = useState(report.status);
  const [resolutionNote, setResolutionNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const TypeIcon = {
    review: MessageSquare,
    reply: MessageCircle,
    product: Package,
    order: ShoppingCart,
    system: Bug,
  }[report.type];

  const handleUpdateReport = async (reportId, updateData) => {
    try {
      const response = await ReportApi.put(`/${reportId}`, updateData, { withCredentials: true });

      if (response.data.success) {
        toast.success('Report updated successfully');
        loadReports();
        loadStats();
        setSelectedReport(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update report');
    }
  };

  const toCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-800 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                report.type === "review"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                  : report.type === "product"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                  : report.type === "order"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
                  : report.type === "system"
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                  : "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
              }`}
            >
              <TypeIcon className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t(toCamelCase(report.reason))}
                
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t("reportId")}: {report._id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Report Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
              {t("reportDetails")}
            </h3>

            <div className="space-y-3">
              <DetailRow label={t("type")} value={report.type} />
              <DetailRow label={t("severity")} value={report.severity} />
              <DetailRow label={t("status")} value={report.status} />

              <DetailRow
                label={t("submitted")}
                value={new Date(report.createdAt).toLocaleString()}
              />

              {report.resolvedAt && (
                <DetailRow
                  label={t("resolved")}
                  value={new Date(report.resolvedAt).toLocaleString()}
                />
              )}
            </div>
          </div>

          {/* Reporter Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
              {t("reporter")}
            </h3>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">
                {report.user.firstName} {report.user.lastName}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-400">{report.user.email}</p>
            </div>
          </div>

          {/* Message */}
          {report.message && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
                {t("description")}
              </h3>

              <p className="text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                {report.message}
              </p>
            </div>
          )}

          {/* Update Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
              {t("updateStatus")}
            </h3>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none mb-3"
            >
              <option value="open">{t("open")}</option>
              <option value="in-progress">{t("inProgress")}</option>
              <option value="resolved">{t("resolved")}</option>
              <option value="dismissed">{t("dismissed")}</option>
            </select>

            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Add resolution note..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-300 dark:border-gray-800">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              {t("cancel")}  
            </button>

            <button
              onClick={() =>
                handleUpdateReport(report?._id, { status, resolutionNote })
              }
              disabled={updating}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t("updating")}...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {t("updateReport")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail Row Component
const DetailRow = ({ label, value }) => {
const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-300 dark:border-gray-800">
    <span className="text-sm text-gray-700 dark:text-gray-400">{t(String(label).toLocaleLowerCase())}:</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
      {t(String(value).toLocaleLowerCase())}
    </span>
  </div>
  )
}

export default ReportDetailModal;
