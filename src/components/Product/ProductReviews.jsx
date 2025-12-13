
// components/Product/ProductReviews.jsx
import React, { useMemo, useState } from "react";
import {
  MessageSquarePlus,
  Filter,
  ChevronDown,
} from "lucide-react";
import AddReviewModal from "./Reviews/AddReviewModal";
import ReviewCard from "./Reviews/ReviewCard";
import { useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../context/apiProduct";
import RatingStars from "./Reviews/RatingStars";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";



/* ---------- helpers ---------- */

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const pct = (num, total) => (total ? Math.round((num / total) * 100) : 0);

const ProductReviews = ({
  product,
  isAuthenticated = false,
  user// if you have useAuth, replace usage below
}) => {

  const { lang } = useLanguage();
  const { t } = useTranslation();

  // Local state
  const [filterStars, setFilterStars] = useState(0); // 0 = all
  const [withPhotos, setWithPhotos] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // 'recent' | 'highest' | 'lowest'

  const [openModal, setOpenModal] = useState(false);
  const [visible, setVisible] = useState(5);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(product?.averageRating || 0);
  const [reviewsCount, setReviewsCount] = useState(product?.reviewsCount || 0);

useEffect(() => {
  const fetchReviews = async () => {
      
    try {
      const res = await API.get(`/${product._id}/reviews`, { withCredentials: true });
      if (res.data.success) {
        setReviews(res.data.reviews);
        setAverageRating(res.data.averageRating);
        setReviewsCount(res.data.reviewsCount);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error?.response?.data || error.message);
    }
  };
  fetchReviews();
}, []);

  // Derived
  const total = reviews.length;

  useEffect(() => {
    if (total > 0) {
            const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      let averageRate = Math.round((sum / total) * 10) / 10; // 1 decimal
    let reviewsTotal = total;
    setAverageRating(averageRate);
    setReviewsCount(reviewsTotal);
    } else {
      setAverageRating(0);
      setReviewsCount(0);
    }
  }, [reviews]);

  const buckets = useMemo(() => {
    const map = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const k = clamp(Math.round(r.rating), 1, 5);
      map[k] += 1;
    });
    return map;
  }, [reviews]);

  const filtered = useMemo(() => {
    let arr = [...reviews];
    if (filterStars) arr = arr.filter((r) => Math.floor(r?.rating) === filterStars);
    if (withPhotos) arr = arr.filter((r) => Array.isArray(r?.images) && r?.images.length > 0);

    if (sortBy === "highest") arr.sort((a, b) => b?.rating - a?.rating);
    else if (sortBy === "lowest") arr.sort((a, b) => a?.rating - b?.rating);
    else arr.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt));

    return arr;
  }, [reviews, filterStars, withPhotos, sortBy]);

  const visibleReviews = filtered.slice(0, visible);

  /* -------- UI -------- */

  return (
    <section id="reviews" className="my-10">
      {/* header / summary */}
      <div className=" rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* left: average */}
          <div className="lg:w-1/3">
            <div className="flex items-end gap-4">
              <div>
                <div className="text-5xl font-extrabold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">{reviewsCount} {reviewsCount === 1 ? t("review") : t("reviews")}</div>
              </div>
              <RatingStars rating={averageRating} className="mb-1" />
            </div>

            <button
              onClick={() => (isAuthenticated ? setOpenModal(true) : alert("Please sign in to write a review"))}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              {t("writeAReview")}
            </button>
          </div>

          {/* right: histogram */}
          <div className="flex-1 grid gap-2">
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStars(filterStars === s ? 0 : s)}
                className={`group w-full flex items-center gap-3 text-left`}
              >
                <span className="w-10 text-sm text-gray-600 dark:text-gray-300">{s}★</span>
                <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 group-hover:opacity-90 ${filterStars === s ? "bg-blue-600" : "bg-blue-400"}`}
                    style={{ width: `${pct(buckets[s], reviewsCount)}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm text-gray-600 dark:text-gray-300">{buckets[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* controls */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
            <Filter className="w-4 h-4" />
            <span className="text-sm">{t("filters")}</span>
          </div>

          <button
            onClick={() => setWithPhotos((p) => !p)}
            className={`text-sm px-3 py-1.5 rounded-full border transition
            ${withPhotos ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400"}`}
          >
            {t("withPhotos")}
          </button>

          <div className="ml-auto">
            <label className="text-sm mr-2 text-gray-600 dark:text-gray-300">{t("sort")}</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
            >
              <option value="recent">{t("mostRecent")}</option>
              <option value="highest">{t("highestRated")}</option>
              <option value="lowest">{t("lowestRated")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* list */}
      <div className="mt-6 grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-sm text-gray-600 dark:text-gray-300 text-center py-8 border border-dashed rounded-2xl dark:border-gray-700">
            {t("noReviewsFound")}
          </div>
        ) : (
          filtered.map((review) => (
            <ReviewCard key={review._id} product={product} review={review} user={user} setReviews={setReviews} />
          ))
        )}
      </div>

      {/* load more */}
      {filtered.length > visible && (
        <div className="mt-6 grid place-items-center">
          <button
            onClick={() => setVisible((v) => v + 5)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-200"
          >
            {t("loadMore")}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      <AddReviewModal
        product={product._id}
        open={openModal}
        onClose={() => setOpenModal(false)}
        setReviews={setReviews}
        // onSubmit={handleSubmitReview}
      />

    </section>
  );
};

export default ProductReviews;
