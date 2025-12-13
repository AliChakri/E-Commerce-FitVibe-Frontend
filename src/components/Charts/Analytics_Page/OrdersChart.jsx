
// 📁 src/components/analytics/OrdersChart.jsx
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Filler);

const OrdersChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Orders',
      data: data.values,
      backgroundColor: '#6366f1',
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: 'inherit' } },
    },
    scales: {
      x: { ticks: { color: 'inherit' } },
      y: { ticks: { color: 'inherit' } },
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow">
      <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-white">📊 Orders Per Month</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OrdersChart;
