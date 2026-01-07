import { useState, useEffect } from "react";
import { Star, MessageSquarePlus, X, Camera, Send } from "lucide-react";
import API from "../../../context/apiProduct";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AddReviewModal = ({ product, open, onClose, setReviews }) => {
  const { t } = useTranslation();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate previews
  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 3);

    if (selected.length > 3) {
      toast.warn("Only image files allowed (max 3).");
    }

    setFiles((prev) => [...prev, ...selected].slice(0, 3));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!rating) {
      toast.warn("Rating must be 1–5");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("comment", text);
    formData.append("rating", rating);
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await API.post(`/${product}/reviews`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Review added");
        setRating(0);
        setHover(0);
        setTitle("");
        setText("");
        setFiles([]);
        setPreviews([]);
        setReviews(res.data.reviews);
        onClose?.();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <MessageSquarePlus className="w-5 h-5" />
            {t("writeAReview")}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* Rating */}
          <div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  className="p-1"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hover || rating) >= s
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600/80"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500/80">
              {t("clickToRate")}
            </p>
          </div>

          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder={t("reviewTitle")}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              px-3 py-2 outline-none
              focus:ring-2 focus:ring-blue-500"
          />

          {/* Comment */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={t("reviewPlaceholder")}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              px-3 py-2 outline-none
              focus:ring-2 focus:ring-blue-500"
          />

          {/* Upload */}
          <div>
            <label
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border
                ${
                  files.length >= 3
                    ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                }`}
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm">
                {files.length >= 3 ? t("maxPhotos") : t("addPhotosOptional")}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={files.length >= 3}
                onChange={handleFileChange}
              />
            </label>

            {previews.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {previews.map((src, index) => (
                  <div key={index} className="relative w-20 h-20">
                    <img
                      src={src}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="absolute top-1 right-1 bg-black/60 dark:bg-gray-900/70 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-200
                hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={!rating || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                bg-blue-600 hover:bg-blue-700 text-white
                disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? t("submitting") : t("submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
