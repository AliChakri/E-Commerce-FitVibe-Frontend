import { Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const OrderStatusChart = ({ data }) => {

  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  // Detect Tailwind dark mode
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains("dark"));
    update();

    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => obs.disconnect();
  }, []);

  if (!data) return <p>{t('loading')}...</p>;

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        data: data.values || [],
        backgroundColor: [
          "#10B981", // paid
          "#F59E0B", // pending
          "#EF4444", // cancelled
          "#3B82F6", // created
          "#6366F1", // completed
        ],
        borderColor: isDark ? "#1F2937" : "#ffffff", // adjust border in dark
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#E5E7EB" : "#111827",
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
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">
        <Package className="inline-block w-6 h-6 mr-2" /> {t('orderStatusDistribution')}
      </h2>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default OrderStatusChart;
