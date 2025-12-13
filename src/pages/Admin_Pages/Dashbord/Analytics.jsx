import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Package, 
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChartArea
} from 'lucide-react';
import AnalyticsApi from '../../../context/analytics';
import axios from 'axios';
import { toast } from 'react-toastify';


// Chart.js registrations
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import RevenueChart from '../../../components/Charts/Analytics_Page/RevenueChart';
import OrderStatusChart from '../../../components/Charts/Analytics_Page/OrderStatusChart';
import UserGrowthChart from '../../../components/Charts/Analytics_Page/UserGrowthChart';
import SalesByCategoryChart from '../../../components/Charts/Analytics_Page/SalesByCategoryChart';
import TopSellingProductsChart from '../../../components/Charts/Analytics_Page/TopSellingProductsChart';
import AverageOrderValueChart from '../../../components/Charts/Analytics_Page/AverageOrderValueChart';
import LatestOrders from '../../../components/Charts/Analytics_Page/Tables/LatestOrders';
import TopProductTable from '../../../components/Charts/Analytics_Page/Tables/TopProductTable';
import KPICard from '../../../components/Charts/Analytics_Page/Tables/KPICard';
import { useTranslation } from 'react-i18next';

const Analytics = () => {


  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [orders, setOrders] = useState(0);
  const [products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError(null);
        const res = await axios.get('https://e-commerce-fitvibe-backend.onrender.com/api/analytics', { withCredentials: true });
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        setError('Failed to load analytics data');
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await AnalyticsApi.get('/dashboard', { withCredentials: true });
        if (res.data.success) {
          setOrders(res.data.orders);
          setProducts(res.data.products);
          setUsers(res.data.users);
          setRevenue(res.data.revenue);
        }
      } catch (error) {
        console.log(error?.response?.data || error?.message);
        toast.error('Something went wrong loading stats');
      }
    };
    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch both analytics and stats
      const [analyticsRes, statsRes] = await Promise.all([
        axios.get('https://e-commerce-fitvibe-backend.onrender.com/api/analytics', { withCredentials: true }),
        AnalyticsApi.get('/dashboard', { withCredentials: true })
      ]);
      
      setData(analyticsRes.data);
      if (statsRes.data.success) {
        setOrders(statsRes.data.orders);
        setProducts(statsRes.data.products);
        setUsers(statsRes.data.users);
        setRevenue(statsRes.data.revenue);
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
      toast.error('Failed to refresh data');
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Package className="w-16 h-16 mx-auto mb-4" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">{t('loadingAnalytics')}</p>
        </div>
      </div>
    );
  }

  const ChartContainer = ({ title, children, action, className = "" }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {action && action}
      </div>
      <div className="min-h-[300px]">
        {children}
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {t('refresh')}
      </button>
      {/* <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
        <Download className="w-4 h-4 mr-2" />
        {t('export')}
      </button> */}
      {/* <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
        <Filter className="w-4 h-4 mr-2" />
        {t('filter')}
      </button> */}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <ChartArea className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('analyticsDashboard')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {t('analyticsSubtitle')}
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7d">{t('last7days')}</option>
                    <option value="30d">{t('last30days')}</option>
                    <option value="90d">{t('last3months')}</option>
                    <option value="1y">{t('lastYear')}</option>
                  </select>
                </div> */}
                <QuickActions />
              </div>
            
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard
            title={t("totalRevenue")}
            value={`$${revenue.toLocaleString()}`}
            change={12.5}
            trend="up"
            icon={DollarSign}
            color="bg-emerald-500"
          />
          <KPICard
            title={t("totalOrders")}
            value={orders.toLocaleString()}
            change={8.3}
            trend="up"
            icon={ShoppingCart}
            color="bg-blue-500"
          />
          <KPICard
            title={t("totalUsers")}
            value={users.toLocaleString()}
            change={15.7}
            trend="up"
            icon={Users}
            color="bg-purple-500"
          />
          <KPICard
            title={t("totalProducts")}
            value={products.toLocaleString()}
            change={5.2}
            trend="up"
            icon={TrendingUp}
            color="bg-orange-500"
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1  xl:grid-cols-3 gap-6">
          <ChartContainer className="xl:col-span-2">
            <RevenueChart data={data.revenue} />
          </ChartContainer>
          <ChartContainer>
            <OrderStatusChart data={data.orderStatus} />
          </ChartContainer>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
          <ChartContainer>
            <UserGrowthChart data={data.userGrowth} />
          </ChartContainer>
          <ChartContainer>
            <SalesByCategoryChart data={data.salesByCategory} />
          </ChartContainer>
        </div>

        {/* Product Performance Section */}
        <div className="grid grid-cols-1  xl:grid-cols-2 gap-6">
          <ChartContainer>
            <TopSellingProductsChart data={data.topProducts} />
            <TopProductTable />
          </ChartContainer>
          
          <ChartContainer 
            action={
              <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <Eye className="w-4 h-4 mr-1" />
                {t("view_all")}
                
              </button>
            }
          >
            <LatestOrders />
          </ChartContainer>
        </div>

        {/* Performance Metrics */}
        <ChartContainer className="w-full">
          <AverageOrderValueChart data={data.averageOrderValue} />
          
        </ChartContainer>

        {/* Footer Stats - Using real data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{t("totalRevenue")}</p>
                <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">{t("totalOrders")}</p>
                <p className="text-2xl font-bold">{orders.toLocaleString()}</p>
              </div>
              <Package className="w-8 h-8 text-emerald-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">{t("totalUsers")}</p>
                <p className="text-2xl font-bold">{users.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;