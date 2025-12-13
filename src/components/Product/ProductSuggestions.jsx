// ProductSuggestions.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import CardProduct from "./CardProduct";
import API from "../../context/apiProduct";
import { useEffect, useState } from "react";
import UserApi from "../../context/userApi";
import { toast } from "react-toastify";

const ProductSuggestions = ({ productId, user }) => {
  const [suggestion, setSuggestion] = useState([]);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await API.get(`/${productId}/suggestions`, { withCredentials: true });
        if (res.data.success) setSuggestion(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestion();
  }, [productId]);

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


  if (!suggestion.length) return null;

  return (
    <div className="my-12 px-4">
      <h2 className="text-xl font-semibold mb-6">You may also like</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
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

export default ProductSuggestions;
