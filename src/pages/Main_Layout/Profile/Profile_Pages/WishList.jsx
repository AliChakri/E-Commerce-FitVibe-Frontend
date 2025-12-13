
import { Heart, Search } from 'lucide-react'
import { useState, useEffect, useMemo, useContext } from 'react'
import CardProduct from '../../../../components/Product/CardProduct';

import UserApi from '../../../../context/userApi';
import { useDebounce } from '../../../../hooks/useDebounce';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthProvider';
// import { ApiContext } from '../../../../Contexts';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../../context/LanguageContext';

const WishList = () => {

    const { user, setUser } = useAuth();
    const { t } = useTranslation();
    const { lang } = useLanguage();
    // const { addToWishList, removeFromWishList } = useContext(ApiContext);

    const [products, setProducts] = useState([]);
    // FILTERS
    const [searchQuery, setSearchQuery] = useState('');
    const [dateSort, setDateSort] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');


    // FETCH USER WISHLIST
    useEffect(() => {
            const fetchData = async () => {
            try {
                const res = await UserApi.get(`/me/wishlist?lang=${lang}`, { withCredentials: true });
                if (res.data.success) {
                    setProducts(res.data.wishlist);
                }
            } catch (error) {
                console.log(error?.resposne?.data);
            }
        }

        fetchData();
    }, [user, lang]);
    
    const addToWishList = async (productId) => {
        if (!user || !productId || products?.wishlist?.includes(productId)) return;
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
    if (!user || !productId || !products?.wishlist?.includes(productId)) return;
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

    const debouncedQuery = useDebounce(searchQuery, 400);

    // FILTERED & SORTED PRODUCTS
    const filteredProducts = useMemo(() => {
        return [...products]
            .sort((a, b) => {   // PRICE & DATE FILTER
                if (price === 'priceDesc') return b.price - a.price;
                if (price === 'priceAsc') return a.price - b.price;
                if (dateSort === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
                return true;
            })
            .filter((product) => {  // SEARCH FILTER
                if (searchQuery === '') return true;

                return product.name.toLowerCase().includes(debouncedQuery.toLocaleLowerCase());
            })
            .filter((product) => {  // CATEGORY FILTER
                if (category !== '') return category.toLocaleLowerCase() === product.category.toLowerCase();
                return true;
            });
    }, [products, debouncedQuery, dateSort, price, category])

    // CLEAR ALL FILTERS
    const clearFilters = () => {
        setCategory('');
        setDateSort('');
        setPrice('');
        setSearchQuery('');
    };
return (
    <section className="px-4 py-8 sm:px-6 md:px-8">

        {/* PAGE TITLE */}
        <div className="flex flex-col gap-4 lg:flex-row items-center justify-between 
                        border border-gray-200 dark:border-gray-700 
                        rounded-xl shadow-sm p-4 mb-6 
                        bg-white dark:bg-gray-900">

        {/* Left: Title */}
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
            <Heart className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("wishlist")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("wishlistInfo")}
            </p>
            </div>
        </div>

        {/* Right: Search */}
{/* Right: Search */}
<div className="relative w-full max-w-md">
  <Search
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
    size={20}
  />

  <input
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    type="search"
    placeholder={t("searchWishlist")}
    className="
      w-full bg-white dark:bg-gray-800
      text-slate-900 dark:text-white
      py-2.5 pl-10 pr-4 border rounded-xl
      border-gray-200 dark:border-gray-700
      placeholder:text-slate-400 dark:placeholder:text-gray-500
      focus:border-blue-500 focus:ring-2 focus:ring-blue-300
      transition-all outline-none
    "
  />
            </div>
            
</div>


{/* FILTER BUTTONS */}
<div className="flex flex-wrap gap-3 items-center my-6">

  {/* CATEGORY FILTER BUTTON (Reusable style) */}
  {[
    { key: "shirt", label: t("shirts") },
    { key: "shoes", label: t("shoes") },
    { key: "jacket", label: t("jackets") },
  ].map((item) => (
    <button
      key={item.key}
      onClick={() => setCategory(item.key)}
      className={`
        px-4 py-1.5 text-sm rounded-full font-medium transition-all
        border
        ${
          category === item.key
            ? "bg-blue-600 text-white border-blue-700 shadow-sm"
            : "bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700"
        }
      `}
    >
      {item.label}
    </button>
  ))}

  {/* SORT PRICE */}
  <select
    onChange={(e) => setPrice(e.target.value)}
    className="
      px-4 py-1.5 text-sm rounded-full font-medium
      bg-white dark:bg-gray-800
      text-gray-700 dark:text-gray-300
      border border-gray-300 dark:border-gray-700
      hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-300
      transition-all
    "
  >
    <option value="priceAsc">{t("price")} ↑</option>
    <option value="priceDesc">{t("price")} ↓</option>
  </select>

  {/* SORT DATE */}
  <button
    onClick={() => setDateSort(dateSort === "" ? "latest" : "")}
    className={`
      px-4 py-1.5 text-sm rounded-full font-medium transition-all
      border
      ${
        dateSort === "latest"
          ? "bg-blue-600 text-white border-blue-700 shadow-sm"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-gray-700"
      }
    `}
  >
    {t("newest")}
  </button>

  {/* CLEAR FILTERS */}
  <button
    onClick={clearFilters}
    className="
      px-4 py-1.5 text-sm rounded-full font-medium transition-all
      bg-red-100 dark:bg-red-900 
      text-red-600 dark:text-red-300 
      hover:bg-red-200 dark:hover:bg-red-800
    "
  >
    {t("clearAll")}
  </button>
</div>


        {/* CONTENT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 place-items-center gap-6">

        {filteredProducts && user && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
            <CardProduct
                key={product._id}
                product={product}
                user={user}
                addToWishList={addToWishList}
                removeFromWishList={removeFromWishList}
            />
            ))
        ) : (
            <div className="w-[80vw] h-[50vh] flex items-center justify-center text-center py-16 mx-auto">
            <div className="max-w-md">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("wishlistEmpty")}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t("cartEmpty")}
                </p>

                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                {t("continueShopping")}
                </button>
            </div>
            </div>
        )}
        </div>

    </section>
);

}

export default WishList