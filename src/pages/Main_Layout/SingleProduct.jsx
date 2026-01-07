import { Star, StarHalf, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, Minus, Plus, Package, ZoomIn, X, ShoppingBagIcon, ShoppingBag, Bookmark, Flag } from 'lucide-react';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import API from '../../context/apiProduct';
import ProductImages from '../../components/Product/ProductImages'
import SpinnerLoad from '../../components/SpinnerLoad';
import { useAuth } from '../../context/AuthProvider';
import UserApi from '../../context/userApi';
import ProductFeatures from '../../components/Product/ProductFeatures';
import CopyBtn from '../../components/CopyBtn';
import ProductReviews from '../../components/Product/ProductReviews';
import CardProduct from '../../components/Product/CardProduct';
import ProductSuggestions from '../../components/Product/ProductSuggestions';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import ReportModal from '../../components/Report/ReportModal';
import CartApi from '../../context/cartApi';

const SingleProduct = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  
  const { user, setUser } = useAuth();
  
  const navigate = useNavigate();
  const params = useParams();

  const [product, setProduct] = useState(null);
  const [suggestion, setSuggestion] = useState([]);

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const [price, setPrice] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);

  const [showReportModal, setShowReportModal] = useState(false);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!params.id) return;

    const fetchSingleProduct = async () => {
      try {
        const res = await API.get(`/${params.id}?lang=${lang}`);
        if (res.data.success) {
          setProduct(res.data?.product);
          if (res.data.product?.discount > 0) {
            const discountedPrice = res.data.product?.price * (1 - res.data.product?.discount / 100);
            setPrice(discountedPrice);
          }
          setIsLiked(res?.data?.isLiked);
          setLikes(res.data.product?.likes?.length);
          setAverageRating(res?.data?.product?.averageRating);
          setReviewsCount(res?.data?.product?.reviewsCount);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleProduct();
  }, [lang, params.id]);
  
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

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await API.get(`/${params.id}/suggestions?lang=${lang}`, { withCredentials: true });
        if (res.data.success) {
          setSuggestion(res.data.products);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchSuggestion();
  }, [lang,params.id])

  // Avoid crash before product is loaded
  const selectedVariant =
    product?.variants?.find((variant) => variant.size === size && variant.color === color) || null;

  const allSizes = [...new Set(product?.variants?.map((v) => v.size))];
  const allColors = [...new Set(product?.variants?.map((v) => v.color))];

  // GET THE AVAILABLE SIZES
  const availableSizes = color
    ? product?.variants?.filter((v) => v.color === color).map((v) => v.size)
    : allSizes;

  // GET THE AVAILABLE COLORS
  const availableColors = size
    ? product?.variants?.filter((v) => v.size === size).map((v) => v.color)
    : allColors;

  const stock = selectedVariant ? selectedVariant.stock : null;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  function handleIncrementQnt() {
    if (quantity >= stock) {
      toast.warn('max Stock limit reached!')
      return;
    } else {
      incrementQuantity();
    }
  };

  const handleAddToCart = async () => {
      
      if (!size || !color || quantity <= 0) {
        toast.warn("Please select size, color and valid quantity");
      return;
    }

      if (!selectedVariant) {
        toast.error("This size/color combination is not available.");
        return;
      }
      
      if (!user || !product) return;
      try {
        const res = await CartApi.post(`/`, {
          product: product,
          size,
          color,
          quantity
        }, { withCredentials: true });
        if (res.data.success) {
          toast.dark('Product added to cart');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add to wishlist");
      }
  };

  useEffect(() => {    
    if (product && user) {
      const inWishlist = user.wishList?.some(id => String(id) === String(product?._id));
      setIsInWishlist(inWishlist);
    }
  }, [product]);

  const handleToggleWishlist = async () => {
      if (!user) {
        toast.info("Please sign in to manage wishlist");
        return;
      }

      try {
        if (user.wishList?.includes(product?._id)) {
          // REMOVE
          const response = await UserApi.delete(`/me/wishlist/remove/${product?._id}`, { withCredentials: true });
          if (response.data.success) {
            setUser(prev => ({
              ...prev,
              wishList: prev.wishList.filter(id => id !== product?._id)
            }));
            toast.success("Removed from wishlist");
          }
        } else {
          // ADD
          const response = await UserApi.post(`/me/wishlist/add/${product?._id}`, { withCredentials: true });
          if (response.data.success) {
            setUser(prev => ({
              ...prev,
              wishList: [...prev.wishList, product?._id]
            }));
            toast.success("Added to wishlist");
          }
        }
      } catch (err) {
        toast.error("Failed to update wishlist");
        console.error(err);
      }
  };
  //   HANDLE LIKE API
  const handleLikeProduct = async (productId) => {
    
    try {
      const res = await API.post(`/like/${productId}?lang=${lang}`, { withCredentials: true });
      if (res.data.success) {
        setProduct(res.data.product)
        toast.success(res.data.message);
        setIsLiked(res?.data?.isLiked);
      }
      
    } catch (error) {
      console.log(error?.response?.data);
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const RatingStars = ({ rating, size = 5, className = "" }) => {
    // rating can be 0..5 (e.g., 4.3)
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const empty = size - full - (hasHalf ? 1 : 0);
  
    return (
      <div className={`flex items-center ${className}`}>
        {[...Array(full)].map((_, i) => (
          <Star key={`f-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalf && <StarHalf className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
        {[...Array(empty)].map((_, i) => (
          <Star key={`e-${i}`} className="w-5 h-5 text-gray-300 dark:text-gray-600" />
        ))}
      </div>
    );
  };

  // HANDLE BUY NOW
  const handleBuyNow = (product, color, size, quantity) => {
    navigate("/checkout", {
      state: {
        buyNow: true,
        item: {
          product,
          color,
          size,
          quantity,
        },
      },
    });
  };

  //    LOADING STATE
  if (!product) {
    return <SpinnerLoad />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 lg:py-16 mt-[8vh] transition-colors duration-300">

      {/* CONTAINER  */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Images Section */}
          <div className="relative space-y-6">
                            {/* Like Button */}
                <button
                  onClick={()=>handleLikeProduct(product?._id)}
                  className="absolute top-8 ltr:right-8 rtl:left-8 z-30 p-3 rounded-full transition-all duration-200 
                            bg-slate-100 hover:bg-red-100 
                            dark:bg-gray-800 dark:hover:bg-red-900 
                            shadow-md hover:shadow-lg 
                            flex items-center justify-center
                            hover:scale-105 active:scale-95"
                >

                  <Heart
                    className="w-6 h-6 text-red-600 dark:text-red-400"
                    fill={ product?.likes?.includes(user?._id) ? "currentColor" : "none"}
                  />
                </button>
            <ProductImages images={product?.images} /> 
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">

                {/* NAME + BRAND */}
                <div className="flex-1">

                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                    {product?.name}
                  </h1>

                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">
                    {product?.brand}
                  </p>
                </div>

                <button
                  onClick={()=>handleToggleWishlist()}
                  className="ml-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                >

                  <Bookmark 
                    className={`w-6 h-6 transition-colors duration-200 ${
                      user?.wishList?.includes(product?._id) 
                        ? 'text-blue-500 fill-current' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-300'
                    }`} 
                  />

                </button>

                {/* COPY BUTTON */}
                <CopyBtn />

              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className='flex items-center justify-between gap-3'>

                  <RatingStars rating={averageRating} />

                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {averageRating} ({reviewsCount} {reviewsCount > 1 ? t("reviews") : t("review")})
                  </span>

                </div>

                {product?.likes?.length > 0 && (
                  <div className='flex items-center gap-2 text-md text-slate-700 font-medium '>
                    {product?.likes?.length} {product?.likes?.length === 1 ? t("like") : t("likes")}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                { price !== 0 ? (
                  <>
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      ${price?.toFixed(2)}
                    </span>

                    <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                      ${product?.price}
                    </span>

                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-full">
                      {product?.discount}{t("percentOff")}
                    </span>
                  </>
                ): (
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      ${product?.price}
                    </span>
                ) }
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t("description")}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("selectSize")}
              </h3>

              {/* SIZES BUTTONS  */}
              <div className="grid grid-cols-4 gap-3">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize((prev) => prev === s ? '' : s)}
                    className={`p-3 rounded-xl border-2 font-medium transition-all duration-200 hover:scale-105 ${
                      size === s
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                 {t("selectColor")}
              </h3>

              {/* COLOR SIZES */}
              <div className="flex flex-wrap gap-3">
                {availableColors.map((c) => (
                  <div
                      key={c}
                    className={`flex gap-2 items-center px-4 py-2 rounded-xl border-2 font-medium transition-all duration-200 hover:scale-105 ${
                        color === c
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-400'
                      }`}>
                      <div
                      className="w-6 h-6 rounded-full border border-slate-400 dark:border-gray-100 cursor-pointer"
                      style={{ backgroundColor: c.replace(/\s+/g, '').toLowerCase() }} 
                      title={c}
                    ></div>
                    <button
                      onClick={() => setColor((prev) => prev === c ? '' : c)}
                      className={` font-medium `}
                    >
                      {c}
                    </button> 
                   </div>          
                ))}
              </div>
            </div>

            {/* Stock Status */}
            {selectedVariant ? (
              <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">

                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

                <span className="text-green-700 dark:text-green-400 font-medium">
                  {stock} {t("itemsInStock")}
                </span>

              </div>
            ) : size && color ? (           
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  
                  <span className="text-red-700 dark:text-red-400 font-medium">
                    {t("combinationNotAvailable")}
                  </span>

                </div>          
            ) : null}

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t("quantity")}
              </h3>

              {/* QUANTITY ACTION ( INCREMENT + DECREMET -) */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">

                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-xl transition-colors duration-200"
                  >
                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* QUANTITY DISPLAY */}
                  <span className="px-6 py-3 font-semibold text-gray-900 dark:text-white">
                    {quantity}
                  </span>

                  <button
                    onClick={handleIncrementQnt}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-xl transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>

                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">

                {/* Sticky Action Bar - MOBILE SECTION */}
              <div className="fixed bottom-0 left-0 right-0 bg-transparent  p-4 flex gap-4 md:hidden z-50">

                <button
                  // onClick={handleBuyNow}
                  onClick={() => handleBuyNow(product, color, size, quantity)}
                  disabled={!color || !size || !selectedVariant}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
                            text-white font-semibold py-3 px-4 rounded-full transition-all duration-200 
                            hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-2 
                            shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  {t("buyNow")}
                </button>

                <button
                  onClick={()=>handleAddToCart()}
                  disabled={!color || !size || !selectedVariant}
                  className="p-3 rounded-full transition-all duration-200 
                            bg-slate-100 hover:bg-blue-100 
                            dark:bg-gray-800 dark:hover:bg-blue-900 
                            shadow-md hover:shadow-lg 
                            flex items-center justify-center
                            hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </button>

              </div>

              {/* Desktop Buttons (LARGE SCREENS ) */}
              <div className="gap-4 md:flex hidden">

                <button
                  // onClick={handleBuyNow}
                  onClick={() => handleBuyNow(product, color, size, quantity)}
                  disabled={!color || !size || !selectedVariant}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
                        text-white font-semibold py-4 px-6 rounded-full transition-all duration-200 
                        hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3 
                        shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  {t("buyNow")}
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!color || !size || !selectedVariant}
                  className="p-4 rounded-full transition-all duration-200 
                            bg-slate-100 hover:bg-blue-100 
                            dark:bg-gray-800 dark:hover:bg-blue-900 
                            shadow-md hover:shadow-lg 
                            flex items-center justify-center
                            hover:scale-105 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </button>

              </div>
           
            </div>

            {/* Features */}
            <ProductFeatures />

                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center self-start gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition"
                >
                  <Flag className="w-4 h-4" />
                  <span className="text-sm font-medium">{t("reportProduct")}</span>
                </button>

          </div>

        </div>

      </div>

      <div className='w-full max-w-7xl flex flex-col gap-4 mx-auto'>
        
        <div className="my-12 px-4">
          <h2 className="text-xl font-semibold mb-6">{t("youMayAlsoLike")}</h2>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 }, 
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1200: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="!pb-12"
          >
            {suggestion.map((product) => (
              <SwiperSlide key={product?._id}>
                <div className="flex justify-center">
                  <CardProduct
                    product={product}
                    user={user}
                    addToWishList={addToWishList}
                    removeFromWishList={removeFromWishList}
                    handleToggleWishlist={handleToggleWishlist}
                    className="max-w-[280px] w-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className='p-2'>
          <ProductReviews
            product={product}
            initialReviews={product?.reviews || []} 
            isAuthenticated={!!user}
            user={user}
          />
        </div>
        
        <ReportModal
          open={showReportModal}
          onClose={() => setShowReportModal(false)}
          type="product"
          targetId={product?._id}
          context={{
            productName: product?.name,
          }}
        />
        
      </div>

    </div>
  );
};

export default SingleProduct;