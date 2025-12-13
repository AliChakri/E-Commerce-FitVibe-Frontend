import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ShoppingBag, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SliderHome = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "Summer Collection",
      subtitle: "Fresh Styles for 2025",
      image:
        "https://images.unsplash.com/photo-1599012307530-d163bd04ecab?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      cta: t("shopNow"),
    },
    {
      id: 2,
      title: "Trending Activewear",
      subtitle: "Comfort Meets Performance",
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&auto=format&fit=crop&q=80",
      cta: t("discover"),
    },
    {
      id: 3,
      title: "Classic Essentials",
      subtitle: "Everyday must-haves",
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      cta: t("explore"),
    },
  ];

  return (
    <div className="relative w-full h-[55vh] rounded-2xl shadow-lg overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[55vh]">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                  {slide.title}
                </h3>
                <p className="text-sm md:text-base opacity-90 mb-4 drop-shadow">
                  {slide.subtitle}
                </p>
                <button onClick={() => navigate('/collection')} className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition">
                  <ShoppingBag size={18} />
                  {slide.cta}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SliderHome;
