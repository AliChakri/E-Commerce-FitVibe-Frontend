
import { Send } from 'lucide-react';
import React, { useState } from 'react'
import API from '../../../../context/apiProduct';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

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

const ReplyForm = ({ product, review, user, setReplies, setShowReplyForm }) => {

  const { t } = useTranslation();

      // Reply system states
      const [replyText, setReplyText] = useState("");
      const [replyLoading, setReplyLoading] = useState(false);
  
      // Reply functions
      const handleSubmitReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
    
        setReplyLoading(true);
        try {
          const res = await API.post(`/${product._id}/reviews/${review._id}/replies`, {
            comment: replyText,
          }, { withCredentials: true });
    
          if (res.data.success) {
            setReplies(res.data.review?.replies);
            setReplyText("");
            setShowReplyForm(false);
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
            <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <form onSubmit={handleSubmitReply} className="space-y-3">
                <div className="flex gap-3">
                  <Avatar avatar={user?.avatar} name={(user?.firstName + " " + user?.lastName)} size="w-8 h-8" />
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
                            setShowReplyForm(false);
                            setReplyText("");
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {t("cancel")}
                        </button>
                        <button
                          type="submit"
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
                </div>
              </form>
            </div>
  )
}

export default ReplyForm