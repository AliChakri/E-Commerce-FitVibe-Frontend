import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import AnalyticsApi from '../../../context/analytics';
import { useLanguage } from '../../../context/LanguageContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopSellingProductsChart = () => {

  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [data, setData] = useState(null);

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#fff" : "#1f2937";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tooltipBg = isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)";
  const tooltipText = isDark ? "#fff" : "#000";

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await AnalyticsApi.get('/top-products');
        if (res.data.success) {
          const names = res.data.topProducts.map(p => p.name);
          const sales = res.data.topProducts.map(p => p.totalSold);

          setData({
            labels: names,
            datasets: [
              {
                label: 'Units Sold',
                data: sales,
                backgroundColor: 'rgba(59,130,246,0.6)',
              },
            ],
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTopProducts();
  }, []);

  if (!data) return <p className="text-sm text-gray-500">{t('loadingTopProducts')}...</p>;

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        <BarChart3 className="inline-block w-6 h-6 mr-2" /> {t('topSellingProducts')}
      </h2>

      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
              labels: { color: textColor }
            },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: tooltipText,
              bodyColor: tooltipText,
            }
          },
          scales: {
            x: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor },
              grid: { color: gridColor },
            },
          },
        }}
      />
    </div>
  );
};

export default TopSellingProductsChart;
