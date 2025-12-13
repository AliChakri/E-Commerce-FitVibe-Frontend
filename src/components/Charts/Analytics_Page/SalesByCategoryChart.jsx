// 📁 src/components/analytics/SalesByCategoryChart.jsx
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const SalesByCategoryChart = ({ data }) => {

  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  // Detect Tailwind Dark Mode
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains("dark"));
    update();

    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          "#f87171",
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#a78bfa",
        ],
        borderColor: isDark ? "#1f2937" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#E5E7EB" : "#111827", // gray-200 / gray-900
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#ffffff", // gray-700
        titleColor: isDark ? "#E5E7EB" : "#111827",
        bodyColor: isDark ? "#E5E7EB" : "#111827",
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-200">
        <Package className="inline-block w-6 h-6 mr-2" /> {t('salesByCategory')}
      </h3>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default SalesByCategoryChart;
