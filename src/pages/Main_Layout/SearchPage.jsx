import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import UserApi from "../../context/userApi";
import { toast } from "react-toastify";
import CardProduct from "../../components/Product/CardProduct";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import API from "../../context/apiProduct";
import SpinnerLoad from "../../components/SpinnerLoad";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { t } = useTranslation();
    const [params] = useSearchParams();
    
  const query = params.get("q")?.trim() || ""; 
    
    const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
    setSearchQuery(query);
    }, [query]);


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    // Fetch Search
    useEffect(() => {
        const fetchProducts = async () => {
            if (!searchQuery) return;
            console.log(searchQuery);
            console.log(lang);
            
            setLoading(true);
            try {
                const res = await API.get(`/search?q=${encodeURIComponent(searchQuery)}&lang=${lang}`, { withCredentials: true });

        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error("Search error:", error);
        toast.error(t("failedToLoadProducts"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, lang]);

  // Wishlist logic
  const addToWishList = async (productId) => {
    if (!user) return toast.info(t("loginRequired"));
    try {
      const res = await UserApi.post(
        `/me/wishlist/add/${productId}`,
        {},
        { withCredentials: true }
      );
      res.data.success && toast.dark(res.data.message);
    } catch {
      toast.error(t("wishlistError"));
    }
  };

  const removeFromWishList = async (productId) => {
    if (!user) return toast.info(t("loginRequired"));
    try {
      const res = await UserApi.delete(`/me/wishlist/remove/${productId}`, {
        withCredentials: true,
      });
      res.data.success && toast.dark(res.data.message);
    } catch {
      toast.error(t("wishlistError"));
    }
  };

  const totalPages = Math.max(1, Math.ceil(products?.length / itemsPerPage));
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [query, lang]);

  if (loading) return <SpinnerLoad label="product" />;

  return (
    <section className="min-h-screen w-full flex flex-col gap-8 bg-white dark:bg-gray-900 mx-auto mt-[8vh] overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between mt-6 mb-2 p-4">
        <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400">
          {t("searchResults")}
        </h2>
      </div>

      {/* NO QUERY PROVIDED */}
      {!query && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={80} className="text-gray-400 mb-4" />
          <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            {t("typeSomethingToSearch")}
          </h3>
          <p className="text-gray-500 mt-2">{t("startTypingInNavbar")}</p>
        </div>
      )}

      {/* MAIN GRID */}
      {query && (
        <div className="flex-1">
          {/* If no results */}
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <XCircle size={90} className="text-red-400 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                {t("noProductsMatched")}
              </h3>
              <p className="text-gray-500 mt-2">{t("tryDifferentSearch")}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 flex items-center gap-2 bg-blue-600 text-white rounded-full"
              >
                <RefreshCw size={18} /> {t("reload")}
              </button>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center gap-6">
              {paginatedProducts.map((product) => (
                <CardProduct
                  key={product._id}
                  product={product}
                  user={user}
                  addToWishList={addToWishList}
                  removeFromWishList={removeFromWishList}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                className="p-2 border rounded-full disabled:opacity-50 dark:border-gray-700"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
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
      )}
    </section>
  );
};

export default SearchPage;
