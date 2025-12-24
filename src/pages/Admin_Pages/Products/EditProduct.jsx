import { Cloud, X, Upload, Package, Tag, DollarSign, Percent } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../../context/apiProduct';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../context/LanguageContext';

const EditProduct = () => {

  const { t } = useTranslation();
  const { lang } = useLanguage();
  const params = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    category: "",
    discount: 0
  });

  const categories = ["shirts", "pants", "jackets", "shoes", "hoodie"];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    });
  };
  
  useEffect(() => {
    if (!params.id) return;

    const fetchSingleProduct = async () => {
      try {
        const res = await API.get(`/${params.id}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setImages(prod.images);

          // Set form fields - using English version for editing
          setForm({
            name: prod.name?.en || prod.name || "",
            price: prod.price || "",
            description: prod.description?.en || prod.description || "",
            brand: prod.brand || "",
            category: prod.category || "",
            discount: prod.discount || 0
          });

          // Set existing variants if available
          setVariants(prod.variants && prod.variants.length > 0 ? prod.variants : [{ size: '', color: '', stock: 0 }]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load product");
      }
    };

    fetchSingleProduct();
  }, [params.id]);

  const [variants, setVariants] = useState([{ size: '', color: '', stock: 0 }]);

  // Add a new empty variant
  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', stock: 0 }]);
  };

  // Delete a specific variant
  const deleteVariant = (index) => {
    if (variants && variants.length > 1) {
      const filtered = variants.filter((_, i) => i !== index);
      setVariants(filtered);
    } else {
      toast.warn('At least one variant is required');
    }
  };
  
  // Update a field (size, color, stock) for a specific variant
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
    setVariants(newVariants);
  };

  const handleFileChange = (e, i) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const newImages = [...images];
    newImages[i] = file;
    setImages(newImages);
  };

  // Called when adding a new image if less than 4 exist
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file || images.length >= 4) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setImages([...images, file]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData for the request
      const formData = new FormData();
      
      // Add form fields
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('brand', form.brand);
      formData.append('category', form.category.toLocaleLowerCase());
      formData.append('discount', form.discount);
      
      // Add variants as JSON string
      formData.append('variants', JSON.stringify(variants));
      
      // Handle images - separate existing URLs from new files
      const existingImages = [];
      images.forEach((img, index) => {
        if (typeof img === 'string') {
          // Existing image URL
          existingImages.push(img);
        } else {
          // New image file
          formData.append('images', img);
        }
      });
      
      // Add existing images as JSON string
      if (existingImages.length > 0) {
        formData.append('existingImages', JSON.stringify(existingImages));
      }

      // Send update request to backend
      const response = await API.put(`/edit/${params.id}`, formData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success("Product updated successfully");
        navigate("/admin/products/all");
      } else {
        toast.error("Something went wrong");
      }

    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loadingProduct")}...</p>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("editProduct")}</h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{t("updateProductInfo")}</p>
    </div>

    <div className="space-y-8">

      {/* Product Images */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("productImages")}</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">({images.length}/4)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <label className="block w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors relative overflow-hidden">
                {typeof img === "string" ? (
                  <img
                    src={img}
                    alt={`product-${index}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full rounded-lg"
                  />
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{t("replaceImage")}</span>
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
              
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {images.length < 4 && (
            <label className="w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                className="hidden"
              />
              <Cloud className="w-8 h-8 text-gray-400 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-200">{t("addImage")}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</span>
            </label>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Tag className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("basicInformation")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("productName")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
              placeholder={t("enterProductNamePlaceholder")}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("autoTranslationInfo")}</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("category")} <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
            >
              <option value="">{t("selectCategory")}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {/* {cat.charAt(0).toUpperCase() + cat.slice(1)} */}
                  {t(String(cat).toLocaleLowerCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("brandName")}</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
              placeholder="e.g. Nike, Adidas"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('description')}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all resize-vertical"
              placeholder={t("describeProductPlaceholder")}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("autoTranslationInfo")}</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("pricing")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("price")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">$</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("discount")} (%)
            </label>
            <div className="relative">
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleInputChange}
                className="w-full px-4 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                placeholder="0"
                min="0"
                max="100"
              />
              <Percent className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Price Preview */}
        {form.price && form.discount > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800 dark:text-green-400">{t("pricePreview")} </span>
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">${form.price}</span>
                <span className="ml-2 text-lg font-bold text-green-600 dark:text-green-400">
                  ${(form.price * (1 - form.discount / 100)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Variants */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t("productVariants")}</h2>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            + {t("addVariant")}
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="flex flex-wrap items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{t("size")}</label>
                <input
                  type="text"
                  placeholder="XL, M, 42..."
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{t("color")}</label>
                <input
                  type="text"
                  placeholder="Red, Blue..."
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex-1 min-w-[100px]">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">{t("stock")}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  min="0"
                />
              </div>

              <button
                onClick={() => deleteVariant(index)}
                type="button"
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-700 rounded-lg transition-colors"
                title={t("deleteVariant")}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/products/all")}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {loading ? t("updating") : t("updateProduct")}
          </button>
        </div>
      </div>

    </div>
  </div>
</div>

  );
};

export default EditProduct;