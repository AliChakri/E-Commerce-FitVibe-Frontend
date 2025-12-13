
import { Circle, Heart, Image, Star, StarHalf } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserApi from '../../context/userApi';
import { useAuth } from '../../context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { toast } from 'react-toastify';
import CartApi from '../../context/cartApi';

const CardProduct = ({ product }) => {
    
    const { t } = useTranslation();
    const { lang } = useLanguage();

    const { user, setUser } = useAuth();
    const [stocks, setStocks] = useState(0);
    const [existProduct, setExistProduct] = useState(false);

    // CALCULATE TOTAL STOCK & WISHLIST STATE
    useEffect(() => {
        
        if (product?.variants) {
            let total = 0;
            product?.variants?.forEach(v => total += v?.stock);
            setStocks(total);
        }

        setExistProduct(user?.wishList?.includes(product._id));
    }, [product, user]);

    const handleToggleWishlist = async () => {
          
        if (!user) {
            toast.info("Please sign in to manage wishlist");
            return;
        }

        try {
            // REMOVE
            if (user.wishList?.includes(product._id)) {
                const response = await UserApi.delete(`/me/wishlist/remove/${product._id}`, { withCredentials: true });
                if (response.data.success) {
                    // setUser(prev => ({
                    // ...prev,
                    // wishList: prev.wishList.filter(id => id !== product._id)
                    // }));
                  setUser(response.data.user)
                    toast.success("Removed from wishlist");
                }
            } else {
                // ADD
                const response = await UserApi.post(`/me/wishlist/add/${product._id}`, { withCredentials: true });
                if (response.data.success) {
                    // setUser(prev => ({
                    // ...prev,
                    // wishList: [...prev.wishList, product._id]
                  // }));
                  setUser(response.data.user);
                    toast.success("Added to wishlist");
                }
            }
        } catch (err) {
            toast.error("Failed to update wishlist");
            console.error(err);
        }
  };
  
  const addTocart = async () => {
    try {
      const res = await CartApi.post('/', {
        product,
        size: product?.variants[0]?.size,
        color: product?.variants[0]?.color,
        quantity: 1
      }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message || "Item added to cart.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Somthing went wrong");
    }
  }

    return (

<div className="max-w-sm flex flex-col gap-1 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden">

  {/* IMAGE */}
  <div className="relative mx-auto">
    {product.images ? (
      <a href={`/products/${product._id}`} className="block relative">
        <img
          className="w-sm h-72 object-cover object-center rounded-t-2xl"
          src={product.images[0]}
          alt={product.name}
        />
      </a>
    ) : (
      <div className="w-72 h-72 bg-slate-200 dark:bg-gray-700 flex flex-col gap-4 items-center justify-center rounded-t-2xl">
        <div className="flex flex-col gap-2">
          <div className="p-3 bg-gray-300 dark:bg-gray-600 border border-slate-200 dark:border-gray-700 shadow-xs rounded-full">
            <Image size={37} className="text-gray-500 dark:text-gray-300" />
          </div>
        </div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
          {t("noImage")}
        </div>
      </div>
    )}

    {/* LIKE BUTTON */}
    <button
      onClick={handleToggleWishlist}
      className={`absolute top-3 right-3 p-2 rounded-full cursor-pointer border shadow-md transition-colors duration-300 ${
        existProduct
          ? 'bg-red-500 text-white'
          : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300'
      }`}
    >
      <Heart className={existProduct ? 'fill-white' : 'fill-white'} />
    </button>

    {/* CATEGORY BADGE */}
    <div className="absolute top-3 left-3">
      <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full shadow-md">
        {t(String(product.category).toLowerCase())}
      </span>
    </div>
  </div>

  {/* CONTENT */}
  <div className="flex flex-col bg-white dark:bg-gray-900 gap-2.5 p-3">

    {/* RATING AND STATS */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Star size={15} className="fill-amber-400 text-amber-400" />
        <Star size={15} className="fill-amber-400 text-amber-400" />
        <Star size={15} className="fill-amber-400 text-amber-400" />
        <Star size={15} className="fill-amber-400 text-amber-400" />
        <StarHalf size={15} className="fill-amber-400 text-amber-400" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[15px] text-slate-500 dark:text-gray-300 font-medium">
          {product.averageRating}
        </span>
        <span className="text-[13px] text-slate-500 dark:text-gray-400 font-normal">
          ({product.reviewsCount} {product.reviewsCount === 0 ? t("review") : t("reviews")})
        </span>
      </div>
    </div>

    {/* PRODUCT NAME */}
    <div>
      <span className="text-[17px] font-semibold text-gray-900 dark:text-white">
        {String(product?.name).slice(0, 18)}...
      </span>
    </div>

    {/* PRICE WITH ADDTOCART */}
    <div className="flex items-center justify-between">
      <span className="text-lg xl:text-[18px] 2xl:text-xl font-bold text-blue-500">
        ${product.price}
      </span>
      <button
        onClick={() => addTocart()}        
        className="flex items-center font-medium gap-2 py-1.5 px-3 bg-blue-500 text-sm xl:text-[16px] text-gray-100 rounded-xl cursor-pointer hover:bg-blue-600 transition-all duration-300 divide-gray-300">
        {t("add_to_cart")}
      </button>
    </div>

    {/* STOCK ALERT */}
    <div>
      {stocks > 0 ? (
        <div className="flex items-center gap-2 text-[13px] text-green-600 font-semibold">
          <Circle size={11} className="fill-green-300 text-green-400" />
         {stocks}  {t("onlyLeft")}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-[13px] text-red-600 font-semibold">
          <Circle size={11} className="fill-red-500 text-red-500" />
          {t("outOfStock")}
        </div>
      )}
    </div>

  </div>
</div>

    )
}

export default CardProduct