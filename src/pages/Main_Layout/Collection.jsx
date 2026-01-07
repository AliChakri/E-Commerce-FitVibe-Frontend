import { useContext, useEffect, useMemo, useState } from "react";
// import { ApiContext } from "../../Contexts";
import { useAuth } from "../../context/AuthProvider";
import UserApi from "../../context/userApi";
import { toast } from "react-toastify";
import CardProduct from "../../components/Product/CardProduct";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import API from "../../context/apiProduct";
import SpinnerLoad from "../../components/SpinnerLoad";
import { useTranslation } from "react-i18next";
import Footer from "../../components/Footer";

const Collection = () => {


  // const { products, loading } = useContext(ApiContext);
  
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  // --- Filter states ---
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [priceBounds, setPriceBounds] = useState([0, 500]); // computed from data
  const [priceRange, setPriceRange] = useState([0, 500]); // selected by user
  const [minRating, setMinRating] = useState(0); // 0 = any, 4 = 4+

  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // newest, price-low, price-high, rating

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/?lang=${lang}`, { withCredentials: true });
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [lang]);

  // compute categories and price bounds from products
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const computedBounds = useMemo(() => {

    if (!products.length) return [0, 500];
    const prices = products.map((p) => Number(p.price ?? 0)).filter((p) => !Number.isNaN(p));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return [Math.floor(min), Math.ceil(max)];

  }, [products]);

  // set price bounds and initial selected range when products load / change
  useEffect(() => {
    setPriceBounds(computedBounds);
    setPriceRange(computedBounds);
  }, [computedBounds]);

  // helpers
  const getAvgRating = (p) => {
    if (typeof p?.averageRating === "number") return p?.averageRating;
    if (Array.isArray(p?.reviews) && p?.reviews?.length) {
      const sum = p?.reviews?.reduce((s, r) => s + (r?.rating ?? 0), 0);
      return sum / p?.reviews?.length;
    }
    return 0;
  };

  // wishlist functions (safe if user is null)
  const addToWishList = async (productId) => {
    if (!user) {
      toast.info("Please sign in to add wishlist items.");
      return;
    }
    if (!productId || (user.wishList || []).includes(productId)) return;
    try {
      const res = await UserApi.post(`/me/wishlist/add/${productId}`, {}, { withCredentials: true });
      if (res.data.success) toast.dark(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add wishlist");
    }
  };

  const removeFromWishList = async (productId) => {
    if (!user) {
      toast.info("Please sign in.");
      return;
    }
    if (!productId || !(user.wishList || []).includes(productId)) return;
    try {
      const res = await UserApi.delete(`/me/wishlist/remove/${productId}`, { withCredentials: true });
      if (res.data.success) toast.dark(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove wishlist");
    }
  };

  // --- Filtering logic (memoized) ---
  const filteredProducts = useMemo(() => {

    const term = searchTerm.trim().toLowerCase();

    return products
      .filter((p) => {

        // search: name OR description OR category
        const matchesSearch =
          !term ||
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term)) ||
          (p.category && p.category.toLowerCase().includes(term));

        // category
        const matchesCategory = !categoryFilter || categoryFilter === "all" || p?.category?.toLowerCase() === categoryFilter;

        // price
        const price = Number(p.price ?? 0);
        const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

        // rating
        const avg = getAvgRating(p);
        const matchesRating = avg >= minRating;

        // stock
        const totalStock = Array.isArray(p.variants)
          ? p.variants.reduce((s, v) => s + (v.stock ?? 0), 0)
          : p.stock ?? (p.qty ?? 0);
        const matchesStock = !inStockOnly || totalStock > 0;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return Number(a.price) - Number(b.price);
        if (sortBy === "price-high") return Number(b.price) - Number(a.price);
        if (sortBy === "rating") return getAvgRating(b) - getAvgRating(a);
        // newest -> try createdAt else leave original order
        const ad = a.createdAt ? new Date(a.createdAt) : null;
        const bd = b.createdAt ? new Date(b.createdAt) : null;
        if (ad && bd) return bd - ad;
        return 0;
      });
  }, [products, searchTerm, categoryFilter, priceRange, minRating, inStockOnly, sortBy]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  useEffect(() => setCurrentPage(1), [searchTerm, categoryFilter, priceRange, minRating, inStockOnly, sortBy]);

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  // clear all filters
  const clearAll = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPriceRange(priceBounds);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("newest");
  };

  // Suggest more: top-rated or random fallback
  const suggestions = useMemo(() => {
    if (!products.length) return [];
    const top = [...products].sort((a, b) => getAvgRating(b) - getAvgRating(a)).slice(0, 8);
    return top;
  }, [products]);

  if (loading) {
    return (
      <SpinnerLoad label='product' />
    );
  }

  return (

<section className="min-h-screen w-full flex flex-col gap-8 bg-white dark:bg-gray-900 mx-auto p-20 mt-[8vh] overflow-hidden">

  {/* title section + Clear Button */}
  <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 mb-6">
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">{t("allProducts")}</h2>

    <div className="flex items-center gap-3">
      <button
        onClick={clearAll}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
        title="Clear all filters"
      >
        <RefreshCw size={16} /> {t("clearAll")}
      </button>
    </div>
  </div>

  {/* MAIN CONTENT */}
  <div className="flex flex-col lg:flex-row gap-6">

    {/* --- FILTER SIDEBAR --- */}
    <aside className="lg:block w-full lg:w-[250px] 2xl:w-72 sticky top-20 self-start">
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md border border-slate-100 dark:border-gray-700">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-700 dark:text-gray-300">
            <Filter size={18} /> {t("filters")}
          </h3>
          <button onClick={clearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{t("clear")}</button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <label className="text-sm text-slate-600 dark:text-gray-300 mb-1 block">{t("search")}</label>
          <div className="flex items-center border rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-700">
            <Search size={16} className="text-slate-400 dark:text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("searchNameDescriptionCategory")}
              className="ml-3 w-full outline-none text-sm bg-transparent text-slate-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="ml-2 text-slate-400 dark:text-gray-400">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories as pills */}
        <div className="mb-4">
          <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">{t("category")}</label>
          <div className="flex flex-wrap gap-2">
            {["all","shirts","pants","jeans","jackets","shoes","hoodie"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat.toLowerCase())}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  categoryFilter.toLowerCase() === cat.toLowerCase()
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900"
                }`}
              >
                {t(String(cat).toLocaleLowerCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-600 dark:text-gray-300">{t("price")}</label>
            <span className="text-sm text-slate-500 dark:text-gray-400">${priceRange[0]} - ${priceRange[1]}</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={priceBounds[0]}
              max={priceBounds[1]}
              value={priceRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                const maxVal = Math.max(val, priceRange[1]);
                setPriceRange([val, maxVal]);
              }}
              className="w-full accent-blue-500"  
            />
            <input
              type="range"
              min={priceBounds[0]}
              max={priceBounds[1]}
              value={priceRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                const minVal = Math.min(val, priceRange[0]);
                setPriceRange([minVal, val]);
              }}
              className="w-full accent-blue-500"
            />
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={priceRange[0]}
                min={priceBounds[0]}
                max={priceBounds[1]}
                onChange={(e) => {
                  const v = Number(e.target.value || priceBounds[0]);
                  setPriceRange([Math.max(priceBounds[0], Math.min(v, priceRange[1])), priceRange[1]]);
                }}
                className="w-24 px-2 py-1 border rounded bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 border-slate-300 dark:border-gray-600"
              />
              <span className="text-sm text-slate-400 dark:text-gray-500">—</span>
              <input
                type="number"
                value={priceRange[1]}
                min={priceBounds[0]}
                max={priceBounds[1]}
                onChange={(e) => {
                  const v = Number(e.target.value || priceBounds[1]);
                  setPriceRange([priceRange[0], Math.min(priceBounds[1], Math.max(v, priceRange[0]))]);
                }}
                className="w-24 px-2 py-1 border rounded bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 border-slate-300 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">{t("minimumRating")}</label>
          <div className="flex flex-wrap gap-2">
            {[0, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`px-3 py-1 rounded-lg text-sm border transition ${
                  minRating === r
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border-slate-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900"
                }`}
              >
                {r === 0 ? t("all") : <span className="flex items-center gap-1"><Star className="text-yellow-400" size={14} /> {r}+</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Stock */}
        <div className="mb-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
            <span className="text-sm text-slate-700 dark:text-gray-300">{t("inStockOnly")}</span>
          </label>
        </div>

        {/* Sort */}
        <div className="mt-4">
          <label className="text-sm text-slate-600 dark:text-gray-300 mb-1 block">{t("sortBy")}</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 border-slate-300 dark:border-gray-600"
          >
            <option value="newest">{t("newest")}</option>
            <option value="price-low">{t("priceLow")}</option>
            <option value="price-high">{t("priceHigh")}</option>
            <option value="rating">{t("topRated")}</option>
          </select>
        </div>

      </div>
    </aside>

    {/* --- PRODUCTS GRID / CONTENT --- */}
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center gap-6">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <CardProduct
              key={product._id}
              product={product}
              user={user}
              addToWishList={addToWishList}
              removeFromWishList={removeFromWishList}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-700 dark:text-gray-300">
            <p className="text-xl mb-4">{t("noProductsMatchedFilters")}</p>

            {suggestions.length > 0 ? (
              <>
                <p className="text-sm mb-4">{t("youMightLike")}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {suggestions.map((p) => (
                    <div key={p._id} className="border rounded-xl p-3 bg-white dark:bg-gray-800 shadow-sm">
                      <img src={p.images?.[0] ?? p.image} alt={p.name} className="w-full h-36 object-cover rounded-lg mb-2" />
                      <div className="text-sm font-medium text-slate-800 dark:text-gray-100">{p.name.slice(0, 36)}</div>
                      <div className="text-blue-600 dark:text-blue-400 font-bold mt-1">${p.price}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-900 dark:text-gray-500">{t("tryClearingFiltersOrSearchDifferently")}</p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            className="p-2 border rounded-full disabled:opacity-50 dark:border-gray-700"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-full ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="p-2 border rounded-full disabled:opacity-50 dark:border-gray-700"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>

      </div>
      
      <Footer />

</section>


  );
};

export default Collection;