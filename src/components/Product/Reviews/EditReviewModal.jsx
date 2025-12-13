import { useState, useEffect } from "react";
import { Star, MessageSquarePlus, X, Camera, Send } from "lucide-react";
import API from "../../../context/apiProduct";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const EditReviewModal = ({ product, review, open, onClose, setReviews }) => {

  const { t } = useTranslation();
  
  const [rating, setRating] = useState(review?.rating || 0);
  const [hover, setHover] = useState(review?.rating || 0);
  const [title, setTitle] = useState(review?.title || "");
  const [text, setText] = useState(review?.comment || "");
  
  // Separate existing images (URLs) from new images (Files)
  const [existingImages, setExistingImages] = useState(review?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle new image previews
  useEffect(() => {
    // Clean up old previews
    newImagePreviews.forEach(preview => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    });

    // Create new previews
    const previews = newImages.map(file => URL.createObjectURL(file));
    setNewImagePreviews(previews);

    // Cleanup function
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [newImages]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && review) {
      setRating(review.rating || 0);
      setHover(review.rating || 0);
      setTitle(review.title || "");
      setText(review.comment || "");
      setExistingImages(review.images || []);
      setNewImages([]);
    }
  }, [open, review]);

  if (!open) return null;

  // Calculate total images (existing + new)
  const totalImages = existingImages.length + newImages.length;

  // File input handler
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Filter only image files
    const validImages = selectedFiles.filter(file => file.type.startsWith("image/"));
    
    if (validImages.length < selectedFiles.length) {
      toast.warn("Some files were rejected (only images allowed).");
    }

    // Check total limit
    const availableSlots = 3 - totalImages;
    const filesToAdd = validImages.slice(0, availableSlots);

    if (validImages.length > availableSlots) {
      toast.warn(`You can only upload ${availableSlots} more image(s). Maximum 3 images total.`);
    }

    // Add new files
    setNewImages(prev => [...prev, ...filesToAdd]);
    
    // Clear the input
    e.target.value = '';
  };

  // Remove existing image
  const handleRemoveExisting = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove new image
  const handleRemoveNew = (index) => {
    setNewImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    if (!rating || rating < 1 || rating > 5) {
      toast.warn("Rating must be between 1 and 5");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("comment", text);
    formData.append("rating", rating);

    // Add existing images (URLs to keep)
    existingImages.forEach((imageUrl) => {
      formData.append("existingImages", imageUrl);
    });

    // Add new images (File objects)
    newImages.forEach((file) => {
      formData.append("newImages", file);
    });

    try {
      const res = await API.put(`/${product._id}/reviews`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Review updated successfully");
        setReviews(res.data.reviews)
        onClose?.();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update review");
      console.error(error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">

      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5" />
            {t("editYourReview")}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">

          {/* Rating */}
          <div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hover || rating) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 mt-1">{t("clickToRate")}</p>
          </div>

          {/* Title & Comment */}
          <div className="grid gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("reviewTitle")}
              maxLength={100}
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("reviewPlaceholder")}
              maxLength={2000}
            />
          </div>

          {/* File Upload */}
          <div>

            <label
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border 
                ${totalImages >= 3 
                  ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed" 
                  : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"}`}
            >

              <Camera className="w-4 h-4" />

              <span className="text-sm">
                {totalImages >= 3 ? t("maxPhotos") : `${t("addPhotos")} (${totalImages}/3)`}
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                disabled={totalImages >= 3}
                onChange={handleFileChange}
              />

            </label>

            {/* Image Previews */}
            {(existingImages.length > 0 || newImages.length > 0) && (

              <div className="mt-3 space-y-2">
                {/* Existing Images */}
                {existingImages.length > 0 && (

                  <div>

                    <p className="text-xs text-gray-500 mb-2">{t("currentImages")}:</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative w-20 h-20">
                          <img
                            src={imageUrl}
                            alt={`existing-${index}`}
                            className="w-full h-full rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExisting(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>

                )}

                {/* New Images */}
                {newImages.length > 0 && (

                  <div>

                    <p className="text-xs text-gray-500 mb-2">{t("newImages")}:</p>
                    <div className="flex flex-wrap gap-2">

                      {newImagePreviews.map((previewUrl, index) => (

                        <div key={`new-${index}`} className="relative w-20 h-20">

                          <img
                            src={previewUrl}
                            alt={`new-${index}`}
                            className="w-full h-full rounded-lg object-cover border-2 border-blue-300 dark:border-blue-700 "
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNew(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tr">
                            {t("new")}
                          </div>

                        </div>
                        
                      ))}
                    </div>
                  </div>

                )}
              </div>

            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {t("cancel")}
            </button>
            
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? t("updating"): t("updateReview")}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditReviewModal;