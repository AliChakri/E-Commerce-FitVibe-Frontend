import React, { useState, useEffect, useContext } from 'react';
import { ArrowRight, Sparkles, Users, Award, Star, TrendingUp } from 'lucide-react';
import CardProduct from '../../components/Product/CardProduct';
import SliderHome from '../../components/SliderHome';
import API from '../../context/apiProduct';
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../context/LanguageContext';

const Home = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const [products, setProducts] = useState([]);
  const [mostProducts, setMostProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/?lang=${lang}`, { withCredentials: true });
        if (res.data.success) {
          setProducts(res.data.products);
          setMostProducts(res.data.popular);
        }
      } catch (error) {}
    };
    fetchData();
  }, [lang]);

  const categories = [
    { id: 'all', name: t("all_items"), count: products.length },
    { id: 'shirts', name: t("shirts"), count: products.filter(p => p.category === 'shirts').length },
    { id: 'pants', name: t("bottoms"), count: products.filter(p => p.category === 'pants').length },
    { id: 'jackets', name: t("jackets"), count: products.filter(p => p.category === 'jackets').length },
    { id: 'shoes', name: t("shoes"), count: products.filter(p => p.category === 'shoes').length },
  ];

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter(product => product.category === activeFilter);

  const stats = [
    { icon: Users, value: '50K+', label: t("happy_customers") },
    { icon: Award, value: '500+', label: t("premium_products") },
    { icon: Star, value: '4.9', label: t("average_rating") },
    { icon: TrendingUp, value: '98%', label: t("satisfaction_rate") },
  ];

  return (
      <div className="min-h-screen bg-white dark:bg-gray-900 mt-72 md:mt-[10vh]">

        {/* Hero Section */}
        <section className="h-[60vh] flex items-center px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center w-full">
            {/* Hero Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-6">
                <Sparkles size={16} /> {t("premium_collection")}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                {t("discover_your")} <span className="text-blue-600 dark:text-blue-400">{t("perfect_style")}</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {t("hero_subtitle")}
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold">
                  {t("shop_now")}
                </button>
                <button className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 px-6 py-3 rounded-xl font-medium text-gray-900 dark:text-gray-100">
                  {t("explore_lookbook")}
                </button>
              </div>
            </div>

            {/* Hero Image/Slider */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <SliderHome />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-6 py-3 rounded-full border font-medium whitespace-nowrap transition ${
                  activeFilter === cat.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </section>

        {/* Latest Products Grid */}
        <section className="max-w-7xl mx-auto px-6 py-16 mt-12 md:mt-0">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("latest_products")}</h2>
            <a href="/collection" className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1">
              {t("view_all")} <ArrowRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <CardProduct key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Trending Section */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t("trending_now")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-6">
            {mostProducts.slice(0, 8).map((product) => (
              <CardProduct key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i}>
                  <Icon size={28} className="mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t("stay_in_loop")}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t("newsletter_subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("enter_email")}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 rounded-xl text-white font-semibold">
              {t("subscribe")}
            </button>
          </div>
        </section>

      </div>

  );
};

export default Home;
