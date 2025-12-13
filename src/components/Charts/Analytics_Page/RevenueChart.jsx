import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { ChartArea } from 'lucide-react';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const RevenueChart = ({ data }) => {

  const { t } = useTranslation();

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#fff" : "#1f2937"; 
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tooltipBg = isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)";
  const tooltipText = isDark ? "#fff" : "#000";

  const chartData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [{
      label: 'Revenue ($)',
      data: data.values,
      borderColor: '#4BC0C0',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: textColor }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
      },
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
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        <ChartArea className="inline-block w-6 h-6 mr-2" /> {t('revenueOverTime')}
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;
