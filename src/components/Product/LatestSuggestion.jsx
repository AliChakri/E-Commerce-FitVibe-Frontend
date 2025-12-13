// ProductSuggestions.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CardProduct from "./CardProduct";
import API from "../../context/apiProduct";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import UserApi from "../../context/userApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const LatestSuggestion = ({ user }) => {

    const navigate = useNavigate
  const [suggestion, setSuggestion] = useState([]);
  const { t } = useTranslation();
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await API.get(`/?lang=${lang}`, { withCredentials: true });
        if (res.data.success) setSuggestion(res.data.products.slice(0, 10));
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestion();
  }, [lang]);
    
    const addToWishList = async (productId) => {
        if (!user || !productId || suggestion?.wishlist?.includes(productId)) return;
        try {
        const res = await UserApi.post(`/me/wishlist/add/${productId}`, {}, { withCredentials: true });
        if (res.data.success) {
            toast.dark(res.data.message);
            setWishlist(res.data.user.wishList);
        }
        } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add to wishlist");
        }
    };

  const removeFromWishList = async (productId) => {
    if (!user || !productId || !suggestion?.wishlist?.includes(productId)) return;
    try {
      const res = await UserApi.delete(`/me/wishlist/remove/${productId}`, { withCredentials: true });
      if (res.data.success) {
        toast.dark(res.data.message);
        setWishlist(res.data.user.wishList);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove from wishlist");
    }
  };


if (!user) navigate('/login');
  if (!suggestion.length) return null;

  return (
    <div className="my-12 px-4">
      <h2 className="text-2xl text-gray-800 dark:text-white font-semibold mb-6">{t("youMayAlsoLike")}</h2>
      <Swiper
        modules={[Navigation, Pagination]}
slidesPerView={1} // default for small screens
  spaceBetween={16} // default spacing
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },  // >=640px: 2 cards
          768: { slidesPerView: 3, spaceBetween: 24 },  // >=768px: 3 cards
          1024: { slidesPerView: 4, spaceBetween: 24 }, // >=1024px: 4 cards
        }}
        className="!pb-12"
      >
        {suggestion.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="flex justify-center">
              <CardProduct
                product={product}
                user={user}
                addToWishList={addToWishList}
                removeFromWishList={removeFromWishList}
                // handleToggleWishlist={handleToggleWishlist}
                className="max-w-[280px] w-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LatestSuggestion;
