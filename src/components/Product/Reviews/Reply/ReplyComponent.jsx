import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ThumbsUp,
  Trash2, MessageSquareWarningIcon,
  Edit2,
  Send
} from "lucide-react";
import API from "../../../../context/apiProduct";
import { toast } from "react-toastify";
import ReportModal from "../../../Report/ReportModal";
import { useTranslation } from "react-i18next";

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

const ReplyComponent = ({ product, review, setReplies, reply, user }) => {

  const { t } = useTranslation();
    
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
          // Reply system states
          const [replyText, setReplyText] = useState(reply?.comment || "");
  const [replyLoading, setReplyLoading] = useState(false);
  
    const [showReportModal, setShowReportModal] = useState(false);

const hasReported = useMemo(() => {
  if (!reply?.reports || !user?._id) return false;
  return reply.reports.some(r => r.user.toString() === user._id.toString());
}, [reply, user]);

      // Reply functions
  const handleDeleteReply = async () => {
    try {
      const res = await API.delete(`/${product._id}/reviews/${review._id}/replies/${reply._id}`, { withCredentials: true });
      if (res.data.success) {
        setReplies(prev => prev.filter(r => r._id !== reply._id));
        toast.success("Reply deleted successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete reply");
      console.log(error?.response?.data || error.message);
    }
    };
    
const handleLikeReply = async () => {
    try {
      const res = await API.post(`/${product._id}/reviews/${review._id}/replies/${reply._id}/like`, { withCredentials: true });
      if (res.data.success) {
        setReplies(res.data.review?.replies);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete reply");
      console.log(error?.response?.data || error.message);
    }
    };

      const handleEditReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
    
        setReplyLoading(true);
        try {
          const res = await API.put(`/${product._id}/reviews/${review._id}/replies/${reply?._id}`, {
            comment: replyText,
          }, { withCredentials: true });
    
          if (res.data.success) {
            setReplies(res.data.review?.replies);
            setReplyText("");
            setOpenEditModal(false);
            toast("Reply added successfully");
          }
        } catch (error) {
          toast.error(error?.response?.data?.message || "Failed to add reply");
          console.log(error?.response?.data || error.message);
        } finally {
          setReplyLoading(false);
        }
      };
    
    return (
<div className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
        
    <Avatar avatar={reply?.user?.avatar} name={(reply?.user?.firstName + " " + reply?.user?.lastName)} size="w-8 h-8" />
    <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
        <span className="font-medium text-sm text-gray-900 dark:text-white">
        {(reply?.user?.firstName + " " + reply?.user?.lastName) || t("anonymous")}
        </span>
        {reply?.user?.role === 'admin' && (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <BadgeCheck className="w-3 h-3" />
            {t("admin")}
        </span>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(reply?.createdAt).toLocaleDateString()}
        </span>
    </div>
                {openEditModal ? (
                  <div className="flex-1">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t("writeYourReply")}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {replyText.length}/500
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenEditModal(false);
                            setReplyText("");
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {t("cancel")}
                        </button>
                                <button
                                    onClick={(e)=>handleEditReply(e)}
                          disabled={!replyText.trim() || replyLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {replyLoading ? (
                            <span className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full" />
                          ) : (
                            <Send className="w-3 h-3" />
                          )}
                          {t("reply")}
                        </button>
                      </div>
                    </div>
                  </div>
                ): (
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {reply?.comment}
                        </p>
    )}
    <div className="flex flex-col sm:flex-row gap-2 items-center">
    { user && (
        <button
        onClick={() => handleLikeReply()}
        className="mt-2 text-xs text-gray-800 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 flex items-center gap-1"
        >
         {reply?.likes.length > 0 ? <span className="text-sm font-medium">{reply?.likes.length}</span> : ''}                   
        <ThumbsUp className="w-3 h-3" />
        {t("helpful")}
        </button>
    )}
    {(reply?.user?._id?.toString() === user?._id?.toString()) && (
        <button
        onClick={() => setOpenEditModal(prev => !prev)}
        className="mt-2 text-xs text-gray-800 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
        >
        <Edit2 className="w-3 h-3" />
        {t("edit")}
        </button>
                    )}                 
    {(reply?.user?._id?.toString() === user?._id?.toString() || user?.role === 'admin') ? (
        <button
        onClick={() => handleDeleteReply()}
        className="mt-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
        >
        <Trash2 className="w-3 h-3" />
        {t("delete")}
        </button>
            ) : (
              <button
                  onClick={() => setShowReportModal(true)}
                  className="mt-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                  >
                  <MessageSquareWarningIcon className="w-3 h-3" />
                  {t("report")}
              </button> 
            )} 
                </div>           
            </div>
            
             <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        type="reply"
        targetId={reply._id}
        product={product}
        setReplies={setReplies}
        context={{
          reviewText: reply.text,
        }}
      />

</div>
    );
};

export default ReplyComponent