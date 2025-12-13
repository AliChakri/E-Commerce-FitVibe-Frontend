import { useState, useEffect } from "react";
import {
  X,
  Send,
  Loader2,
  AlertTriangle,
  Package,
  MessageCircle,
  ClipboardList,
  Bug,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import ReportApi from "../../context/reportApi";
import { toast } from "react-toastify";
import { useLanguage } from "../../context/LanguageContext";
import API from "../../context/apiProduct";
import { useTranslation } from "react-i18next";

/**
 * Enhanced Report Modal with dynamic type handling
 * @param {Object} props
 * @param {boolean} props.open - Modal visibility state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.type - Report type: 'system', 'product', 'review', 'reply', 'order'
 * @param {string} props.targetId - Optional target ID for specific reports
 * @param {Object} props.product - Optional product object for context
 * @param {Function} props.setReviews - Optional callback to refresh reviews
 * @param {Object} props.context - Additional context data (e.g., order number, review text)
 */
const ReportModal = ({ 
  open, 
  onClose, 
  type = "system", 
  targetId = null, 
  product = null, 
  setReviews = null,
  context = {} 
}) => {

  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [submitted, setSubmitted] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setReason("");
      setMessage("");
      setSeverity("medium");
      setStep(1);
      setSubmitted(false);
    }
  }, [open]);

  if (!open) return null;

  // ========== CONFIGURATION ==========
  const REPORT_CONFIG = {
    system: {
      icon: Bug,
      color: "purple",
      title: "Report System Issue",
      description: "Help us improve by reporting bugs or issues",
      reasons: [
        "Page Not Loading",
        "Broken Feature",
        "Performance Issue",
        "UI/UX Problem",
        "Security Concern",
        "Other",
      ],
    },
    product: {
      icon: Package,
      color: "blue",
      title: "Report Product",
      description: "Report issues with this product listing",
      reasons: [
        "Fake/Counterfeit Product",
        "Misleading Information",
        "Inappropriate Content",
        "Copyright Violation",
        "Scam/Fraud",
        "Other",
      ],
    },
    review: {
      icon: MessageCircle,
      color: "red",
      title: "Report Review",
      description: "Report inappropriate or false reviews",
      reasons: [
        "Spam",
        "Fake Review",
        "Offensive Language",
        "Harassment",
        "Misinformation",
        "Competitor Attack",
        "Other",
      ],
    },
    reply: {
      icon: MessageCircle,
      color: "orange",
      title: "Report Reply",
      description: "Report inappropriate responses",
      reasons: [
        "Spam",
        "Offensive Content",
        "Harassment",
        "Off-Topic",
        "Impersonation",
        "Other",
      ],
    },
    order: {
      icon: ClipboardList,
      color: "green",
      title: "Report Order Issue",
      description: "Report problems with your order",
      reasons: [
        "Wrong Item Received",
        "Item Not Delivered",
        "Payment Issue",
        "Fraudulent Activity",
        "Damaged Product",
        "Other",
      ],
    },
  };

  const config = REPORT_CONFIG[type] || REPORT_CONFIG.system;
  const Icon = config.icon;

  // Color variants
  const colorClasses = {
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700",
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
    red: "text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700",
    orange: "text-orange-500 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700",
    green: "text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
  };

  const buttonColorClasses = {
    purple: "bg-purple-600 hover:bg-purple-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  // ========== HANDLERS ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!reason) {
      toast.warn("Please select a reason");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        type,
        reason,
        message: message.trim(),
        severity,
      };

      // Add targetId only for non-system reports
      if (type !== "system" && targetId) {
        payload.targetId = targetId;
      }

      const res = await ReportApi.post("/", payload, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Report submitted successfully");
      setSubmitted(true);

      // Refresh reviews if applicable
      if (setReviews && product) {
        try {
          const refreshed = await API.get(`/products/${product._id}?lang=${lang}`);
          setReviews(refreshed.data.reviews);
        } catch (err) {
          console.error("Failed to refresh reviews:", err);
        }
      }

      // Close after 2 seconds
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      console.error("Report submission error:", err);
      const errorMsg = 
        err.response?.data?.message || 
        err.message || 
        "Failed to submit report. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !reason) {
      toast.warn("Please select a reason first");
      return;
    }
    setStep(2);
  };

  // ========== RENDER CONTEXT INFO ==========
  const renderContextInfo = () => {
    if (!context || Object.keys(context).length === 0) return null;

    return (
      <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          {t("reporting")}
        </p>
        {context.orderNumber && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t("order")} #{context.orderNumber}
          </p>
        )}
        {context.productName && (
          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
            {context.productName}
          </p>
        )}
        {context.reviewText && (
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            "{context.reviewText}"
          </p>
        )}
      </div>
    );
  };

  // ========== SUCCESS STATE ==========
  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 text-center animate-scaleIn">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t("reportSubmitted")}
            
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("reportThanks")}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {t("close")}
          </button>
        </div>
      </div>
    );
  }

    const toCamelCase = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase());

  // ========== MAIN MODAL ==========
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-scaleIn">
        {/* Header with colored accent */}
        <div className={`px-6 py-4 border-b-4 ${config.color === 'purple' ? 'border-purple-500' : config.color === 'blue' ? 'border-blue-500' : config.color === 'red' ? 'border-red-500' : config.color === 'orange' ? 'border-orange-500' : 'border-green-500'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${colorClasses[config.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t(toCamelCase(config?.title))}
                  
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {t(toCamelCase(config?.description)?.toLocaleLowerCase())}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition group"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? buttonColorClasses[config.color].split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? buttonColorClasses[config.color].split(' ')[0] : 'bg-gray-200 dark:bg-gray-700'}`} />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {renderContextInfo()}

          {/* Step 1: Reason Selection */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t("whatsTheIssue")} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {config.reasons.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left ${
                        reason === r
                          ? `${buttonColorClasses[config.color]} text-white border-transparent shadow-lg scale-[1.02]`
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {t(toCamelCase(r))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!reason}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                    reason
                      ? `${buttonColorClasses[config.color]} shadow-lg hover:shadow-xl`
                      : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  }`}
                >
                  {t("nextStep")}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details & Severity */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              {/* Selected Reason Display */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("reason")}: {t(toCamelCase(reason))}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t("change")}
                </button>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("additionalDetailsOptional")}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  maxLength={500}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-gray-400 dark:focus:border-gray-500 resize-none transition"
                  placeholder={t("reportPlaceholder")}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">
                    {t("moreDetailsFasterHelp")}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {message.length}/500
                  </p>
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t("howUrgentIsThis")}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["low", "medium", "high", "critical"].map((level) => {
                    const severityColors = {
                      low: "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/40 dark:text-green-300",
                      medium: "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
                      high: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
                      critical: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/40 dark:text-red-300",
                    };

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSeverity(level)}
                        className={`px-3 py-2.5 rounded-lg text-xs font-bold uppercase border-2 transition-all duration-200 ${
                          severity === level
                            ? `${severityColors[level]} shadow-md scale-105`
                            : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {t(String(level).toLowerCase())}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {t("back")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : `${buttonColorClasses[config.color]} shadow-lg hover:shadow-xl`
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t("submitReport")}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReportModal;