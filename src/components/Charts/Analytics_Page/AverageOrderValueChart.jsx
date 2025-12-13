import { BadgeDollarSign } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const AverageOrderValueChart = ({ data }) => {

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

  const chartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Average Order Value ($)",
        data: data.values,
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#ffffff",
        titleColor: isDark ? "#E5E7EB" : "#111827",
        bodyColor: isDark ? "#E5E7EB" : "#111827",
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#E5E7EB" : "#111827" },
        grid: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: isDark ? "#E5E7EB" : "#111827" },
        grid: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">
        <BadgeDollarSign className="inline-block w-6 h-6 mr-2" /> {t('averageOrderValue')}
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AverageOrderValueChart;
