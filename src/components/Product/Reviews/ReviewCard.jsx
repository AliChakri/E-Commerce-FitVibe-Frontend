import { useMemo, useState } from "react";
import {
  ThumbsUp,
  Flag,
  X,
  BadgeCheck,
  Edit3,
  Trash2,
  Heart,
  MessageCircle,
  Reply,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import RatingStars from "./RatingStars";
import EditReviewModal from "./EditReviewModal";
import API from "../../../context/apiProduct";
import { toast } from "react-toastify";
import ReportModal from "./../../Report/ReportModal";
import ReplyComponent from "./Reply/ReplyComponent";
import ReplyForm from "./Reply/ReplyForm";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";

const ReviewCard = ({ product, review, user, setReviews }) => {

  const { lang } = useLanguage();
  const { t } = useTranslation();
  
  const [selectedImage, setSelectedImage] = useState(review?.images[0] || null);
  const [likes, setLikes] = useState(review?.likes?.length || 0);
  const [imageOn, setImageOn] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reply system states
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(review?.replies || []);
  const [replyLoading, setReplyLoading] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);

  const openLightbox = () => setImageOn(true);
  const closeLightbox = () => setImageOn(false);

  const alreadyReported = useMemo(() => {
    return review?.reports?.some(r => r.user === user?._id);
  }, [review, user]);

  const Avatar = ({ avatar, name = "User", size = "w-10 h-10" }) => {
    const initial = String(name).trim().charAt(0).toUpperCase() || "U";
    return (
      <>
        {avatar ? (
          <img
            src={avatar}
            className={`${size} p-0.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white grid place-items-center font-semibold shadow-md`}
            alt=""
          />
        ) : (
          <div className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white grid place-items-center font-semibold shadow-md text-sm`}>
            {initial}
          </div>
        )}
      </>
    );
  };

  const handleLikeReview = async () => {
    try {
      const res = await API.put(`/${product._id}/reviews/${review._id}/like?lang=${lang}`, { withCredentials: true });
      if (res.data.success) {
        toast(res.data.message || 'Liked Review Successfully');
        setLikes(res.data.likesCount);
      }
    } catch (error) {
      console.log(error?.response?.message || error.message);
    }
  };

  const handleDeleteReview = async () => {
    setLoading(true);
    try {
      const res = await API.delete(`/${product._id}/reviews/${review._id}?lang=${lang}`, { withCredentials: true });
      if (res.data.success) {
        toast(res.data.message || 'Review Deleted Successfully');
        setReviews(res.data.reviews);
      }
    } catch (error) {
      console.log(error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">

      <div className="flex items-start gap-4">

        <Avatar avatar={review?.user?.avatar} name={(review.user?.firstName + ' ' + review.user?.lastName) || t("user")} size="w-12 h-12" />

        {/* HEADER */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {(review?.user?.firstName + ' ' + review?.user?.lastName) || t("anonymous")}
            </span>
            {review.verified && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <BadgeCheck className="w-3.5 h-3.5" />
                {t("verifiedPurchase")}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(review?.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            <RatingStars rating={review?.rating} />
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {review?.title}
            </span>
          </div>

          {review?.comment && (
            <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              {review?.comment}
            </p>
          )}

          {Array.isArray(review?.images) && review?.images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {review?.images?.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="review"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedImage(src);
                    openLightbox();
                  }}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            {(review?.user?._id?.toString() === user?._id?.toString()) ? (
              <>
                <button
                  onClick={() => setOpenEditModal(prev => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 transition cursor-pointer hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Edit3 className="w-4 h-4" />
                  {t("edit")}
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 transition">
                  <span className="text-blue-500">{likes}</span>
                  <Heart className="w-4 h-4" />
                  {likes === 1 ? t("like") : t("likes")}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleLikeReview()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition cursor-pointer border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400"
              >
                <span className="text-blue-600">{likes ? likes : ''}</span>
                <ThumbsUp className="w-4 h-4" />
                {t("helpful")}
              </button>
            )}

            {/* Reply Button */}
            <button
              onClick={() => setShowReplyForm(prev => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-400 transition cursor-pointer"
            >
              <Reply className="w-4 h-4" />
              {t("reply")}
            </button>

            {(review?.user?._id?.toString() === user?._id?.toString() || user?.role === 'admin') ? (
              <button
                onClick={() => handleDeleteReview()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-400 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                {t("delete")}
              </button>
            ) : (
              <button
                  // onClick={() => setOpenReportModal(p => !p)}
                  onClick={() => setShowReportModal(true)}
                disabled={alreadyReported ? true : false}
                className={`${alreadyReported ? 'border-red-300 dark:border-red-600 text-red-600 dark:text-red-300' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border hover:border-red-400 transition cursor-pointer`}
              >
                <Flag className="w-4 h-4" />
                {t("report")}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && user && (
            <ReplyForm product={product} review={review} user={user} setReplies={setReplies} setShowReplyForm={setShowReplyForm} />
          )}

          {/* Replies Section */}
          {replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(prev => !prev)}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-3"
              >
                <MessageCircle className="w-4 h-4" />
                {showReplies ? t("hide") : t("show")} {replies.length} {replies.length === 1 ? t("reply") : t("replies")}
                {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showReplies && (
                <div className="space-y-3 border-l-2 border-blue-200 dark:border-blue-700 pl-4 ml-2">
                  {replies?.map((reply, index) => (
                    <ReplyComponent key={reply?._id || index} reply={reply} product={product} review={review} setReplies={setReplies} user={user} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EditReviewModal 
        product={product} 
        review={review} 
        open={openEditModal} 
        onClose={() => setOpenEditModal(false)} 
        setReviews={setReviews} 
      />

      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="review"
        targetId={review._id}
        product={product}
        setReviews={setReviews}
        context={{
          reviewText: review.comment,
          productName: product.name,
        }}
      />

      {imageOn && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex justify-center items-center p-4"
          onClick={closeLightbox}
        >
          <img
            src={selectedImage}
            alt="Full"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
          <button
            onClick={() => setImageOn(false)}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;