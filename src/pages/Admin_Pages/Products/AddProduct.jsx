import React, { useState } from "react";
import { Cloud, Upload, X, Plus, Package, Globe, DollarSign, Tag, Image as ImageIcon, Palette, Ruler, Package2, Trash2, Languages } from "lucide-react";
import API from "../../../context/apiProduct";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const AddProduct = () => {

  const { t } = useTranslation();
  const [variants, setVariants] = useState([{ size: "", color: "", stock: 0 }]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    brand: "",
    category: ""
  });

  const categories = [
    { value: t("shirts"), label: t("shirts"), icon: "👔" },
    { value: t("pants"), label: t("pants"), icon: "👖" },
    // { value: t("jean"), label: t("jean"), icon: "👖" },
    { value: t("jackets"), label: t("jackets"), icon: "🧥" },
    { value: t("shoes"), label: t("shoes"), icon: "👟" },
    { value: t("hoodie"), label: t("hoodie"), icon: "👕" }
  ];



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
    setVariants(newVariants);
  };

  const addVariant = () => setVariants([...variants, { size: "", color: "", stock: 0 }]);
  
  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e, i) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...images];
    newImages[i] = file;
    setImages(newImages);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();

      // Add images
      images.forEach((image) => {
        if (image) formData.append("images", image);
      });

      // Add fields
      formData.append("name", form.name);
      formData.append("description", form.description);
      
      // Add other fields
      formData.append("price", form.price);
      formData.append("discount", form.discount);
      formData.append("brand", form.brand);
      formData.append("category", form.category);
      formData.append("variants", JSON.stringify(variants));

      const res = await API.post("/add", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Product created successfully!");
      
      // Reset form
      setForm({
        name: "",
        description: "",
        price: "",
        discount: 0,
        brand: "",
        category: ""
      });
      setVariants([{ size: "", color: "", stock: 0 }]);
      setImages([]);
      
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      form.name &&
      form.price && 
      form.category && 
      variants.every(v => v.size && v.color && v.stock >= 0)
      // && images.some(img => img !== null && img !== undefined)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('addNewProduct')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('createNewProduct')}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Product Images */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('productImages')}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('uploadInstructions')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="relative group">
                    <label className="block w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700/50">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, i)}
                      />
                      
                      {images[i] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={URL.createObjectURL(images[i])}
                            alt="preview"
                            className="object-cover w-full h-full rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-xs font-medium">{t('uploadImage')}</span>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('basicInformation')}
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Product Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Package className="w-4 h-4" />
                  {t('productName')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder={t('enterProductName')}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe className="w-4 h-4" />
                  {t('description')}
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t('enterProductDescription')}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('brandName')}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={form.brand}
                    onChange={handleInputChange}
                    placeholder={t('brandName')}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4" />
                    {t('category')} *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">{t('selectCategory')}</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4" />
                    {t('price')} *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('discount')} (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={form.discount}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package2 className="w-5 h-5 text-purple-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('productVariants')}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('defineVariants')}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors duration-200 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {t('addVariant')}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {variants.map((variant, i) => (
                  <div key={i} className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('variant')} {i + 1}
                      </span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          <Ruler className="w-3 h-3" />
                          {t('size')}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., M, L, XL, 42"
                          value={variant.size}
                          onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          <Palette className="w-3 h-3" />
                          {t('color')}
                        </label>
                        <input
                          type="text"
                          placeholder={t('exampleColors')}
                          value={variant.color}
                          onChange={(e) => handleVariantChange(i, "color", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          <Package className="w-3 h-3" />
                          {t('stock')}
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={variant.stock}
                          min="0"
                          onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none min-w-[200px] justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('creating')}...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {t('createProduct')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;