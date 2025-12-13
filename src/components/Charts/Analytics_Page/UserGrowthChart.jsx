// 📁 src/components/analytics/UserGrowthChart.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const UserGrowthChart = ({ data }) => {

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
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: data.values,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#E5E7EB" : "#111827",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#ffffff",
        titleColor: isDark ? "#E5E7EB" : "#111827",
        bodyColor: isDark ? "#E5E7EB" : "#111827",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#E5E7EB" : "#111827",
        },
        grid: {
          color: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.08)",
        },
      },
      y: {
        ticks: {
          color: isDark ? "#E5E7EB" : "#111827",
        },
        grid: {
          color: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.08)",
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-200">
        <Users className="inline-block w-6 h-6 mr-2" /> {t('userGrowth')}
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default UserGrowthChart;
