import React from "react";
import { Shield, Heart, Truck, Leaf, ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  const values = [
    {
      icon: Shield,
      title: t("premium_quality"),
      description: t("premium_quality_desc")
    },
    {
      icon: Heart,
      title: t("customer_obsessed"),
      description: t("customer_obsessed_desc")
    },
    {
      icon: Truck,
      title: t("fast_free_shipping"),
      description: t("fast_free_shipping_desc")
    },
    {
      icon: Leaf,
      title: t("sustainable_fashion"),
      description: t("sustainable_fashion_desc")
    }
  ];

  const stats = [
    { number: "100K+", label: t("happy_customers") },
    { number: "50+", label: t("countries_served") },
    { number: "99%", label: t("satisfaction_rate") },
    { number: "24/7", label: t("customer_support") }
  ];

  const team = [
    {
      name: t("ceo"),
      role: "Founder & CEO",
      image: "https://i.pinimg.com/736x/a5/d3/8d/a5d38df71eb858d9b629cf6c47006f65.jpg"
    },
    {
      name: t("head_design"),
      role: "Head of Design",
      image: "https://i.pinimg.com/736x/98/05/63/980563de9d8c8b7c72a4035a718ff5d4.jpg"
    },
    {
      name: t("marketing"),
      role: "Marketing Director",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: t("tech_lead"),
      role: "Tech Lead",
      image: "https://i.pinimg.com/736x/57/10/6d/57106d17fb1e53c8ee845d24f2513533.jpg"
    }
  ];

  return (
<div className="bg-white dark:bg-gray-900">

  {/* Hero Section */}
  <section className="relative overflow-hidden bg-white dark:bg-gray-800 mt-[10vh] ">
    <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-gray-700 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          {t("about_fitvibe")} <span className="text-blue-600 dark:text-blue-400">FitVibe</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {t("fitvibe_brand")}
        </p>
      </div>
    </div>
  </section>

  {/* Stats Section */}
  <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.number}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* Story Section */}
  <section className="py-20 lg:py-28">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {t("our_story")}
          </h2>
          <div className="prose prose-lg text-gray-600 dark:text-gray-300">
            <p className="mb-6">{t("fitvibe_story")}</p>
            <p className="mb-6">{t("fitvibe_story_two")}</p>
            <p>{t("fitvibe_story_three")}</p>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80"
            alt="Our story"
            className="rounded-2xl shadow-2xl"
          />
          <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">2018</div>
            <div className="text-sm opacity-90">{t("founded")}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Values Section */}
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("what_sets_us_apart")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {t("what_sets_us_apart_desc")}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>

  {/* Mission Section */}
  <section className="py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
        {t("our_mission")}
      </h2>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-3xl p-12">
        <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
          {t("our_mission_desc")}
        </p>
        <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
          <CheckCircle className="w-5 h-5" />
          <span>{t("commited")}</span>
        </div>
      </div>
    </div>
  </section>

  {/* Team Section */}
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("meet_our_team")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("passionate")}
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {member.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* CTA Section */}
  <section className="py-20 bg-gray-900 dark:bg-gray-900 text-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("ready_join")}</h2>
      <p className="text-xl text-gray-300 dark:text-gray-200 mb-10 max-w-2xl mx-auto">
        {t("discover_latest_desc")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-full transition-colors duration-200">
          {t("shop_collection")}
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
        <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-white dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-semibold rounded-full transition-colors duration-200">
          {t("get_in_touch")}
        </button>
      </div>
    </div>
  </section>

</div>

  );
};

export default About;