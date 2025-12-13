// components/LineChart.jsx
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LineChart = ({ dataa }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect Tailwind dark mode from the <html> class
  useEffect(() => {
    const html = document.documentElement;

    const updateTheme = () =>
      setIsDarkMode(html.classList.contains("dark"));

    updateTheme();

    // Watch for class changes on <html>
    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const textColor = isDarkMode ? "#E5E7EB" : "#111827";
  const gridColor = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tooltipBg = isDarkMode ? "#1F2937" : "#F9FAFB";

  const data = {
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
        label: "Total Revenue",
        data: dataa?.values,
        fill: false,
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textColor,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: { size: 12 },
        },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: { size: 12 },
        },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <div className="w-full h-72 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <Bar data={data} options={options} />
    </div>
  );
};

export default LineChart;
