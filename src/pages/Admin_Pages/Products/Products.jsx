import React, { useEffect, useState } from "react";
import API from "../../../context/apiProduct";
import { toast } from "react-toastify";
import {
  Edit,
  X,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../context/LanguageContext";

const Products = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get(`/?lang=${lang}`, { withCredentials: true });
        if (res.data.success) setProducts(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [lang]);

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/delete/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Deleted Successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("productsManagement")}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {t("productsSubtitle")}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border">
            <span className="text-sm text-gray-500">{t("totalProducts")}</span>
            <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchProducts")}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border bg-gray-50 dark:bg-gray-700 min-w-[160px]"
              >
                <option value="">{t("allCategories")}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(cat.toLowerCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b">
              <tr className="text-gray-600 dark:text-gray-300 uppercase">
                <th className="px-6 py-4 text-left flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  {t("product")}
                </th>
                <th className="px-6 py-4 text-left">
                  <Tag className="inline w-4 h-4 text-green-500 mr-1" />
                  {t("category")}
                </th>
                <th className="px-6 py-4 text-left">
                  <DollarSign className="inline w-4 h-4 text-yellow-500 mr-1" />
                  {t("price")}
                </th>
                <th className="px-6 py-4 text-left">{t("stock")}</th>
                <th className="px-6 py-4 text-left">{t("status")}</th>
                <th className="px-6 py-4 text-center">{t("actions")}</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.brand || t("noBrand")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                      {t(product.category.toLowerCase())}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    {product.variants?.slice(0, 2).map((v, i) => (
                      <div key={i} className="text-xs">
                        {v.size}/{v.color}:{" "}
                        <span className="font-semibold">{v.stock}</span>
                      </div>
                    ))}
                    {product.variants?.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{product.variants.length - 2} more
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className="text-green-600 text-xs font-medium">
                      {t("active")}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:scale-110"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Products;
