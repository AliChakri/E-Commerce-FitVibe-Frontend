
import React, { useEffect, useState } from 'react'
// import React from 'lucide-react'
import { BadgeDollarSign, ChartBar, DollarSign, Heart, LifeBuoyIcon, ShoppingBag, ShoppingBasket, ShoppingCart, ShoppingCartIcon, TrendingUp, User, Users } from 'lucide-react';
import LineChart from '../../../components/Charts/LineChart';
import AlertStock from '../../../components/TableEcom.jsx/AlertStock';
import { toast } from 'react-toastify';
import AnalyticsApi from '../../../context/analytics';
import axios from 'axios';
import TopProductTable from '../../../components/Charts/Analytics_Page/Tables/TopProductTable';
import KPICard from '../../../components/Charts/Analytics_Page/Tables/KPICard';
import TopCustomers from '../../../components/TableEcom.jsx/TopCustomers';
import { useTranslation } from 'react-i18next';


const Dashbord = () => {

  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [orders, setOrders] = useState(0);
  const [products, setProducts] = useState(0);
  const [users, setUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);

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
      toast.error('something went wrong')
    }
  };

  const fetchAnalytics = async () => {
    const res = await axios.get('https://e-commerce-fitvibe-backend.onrender.com/api/analytics', { withCredentials: true });
    setData(res.data);
  };
    
  useEffect(() => {
      fetchStats();
      fetchAnalytics();
  }, []);
  

  return (
    <section className='w-full min-h-screen flex flex-col gap-12 bg-white dark:bg-gray-900'>

      <div className='p-6 space-y-8'>

              {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <ChartBar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('dashboardManagement')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('dashboardSubtitle')}
              </p>
            </div>
          </div>
                      
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <KPICard
            title={t('totalRevenue')}
            value={`$${revenue.toLocaleString()}`}
            change={12.5}
            trend="up"
            icon={DollarSign}
            color="bg-emerald-500"
          />
          <KPICard
            title={t('totalOrders')}
            value={orders.toLocaleString()}
            change={8.3}
            trend="up"
            icon={ShoppingCart}
            color="bg-blue-500"
          />
          <KPICard
            title={t('totalUsers')}
            value={users.toLocaleString()}
            change={15.7}
            trend="up"
            icon={Users}
            color="bg-purple-500"
          />
          <KPICard
            title={t('totalProducts')}
            value={products.toLocaleString()}
            change={5.2}
            trend="up"
            icon={TrendingUp}
            color="bg-orange-500"
          />
        </div>

        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-[#27272A] rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {t('totalRevenue6Months')}
          </h2>
          <LineChart dataa={data?.revenue} />
        </div>

        <div className='w-full flex flex-col md:flex-row justify-evenly'>
        
          <div  className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <TopCustomers/>
            <TopProductTable/>
          </div>
        
      </div>

      <div className='w-full'>
        <AlertStock />
        </div>
        
        </div>
        
    </section>
  )
}

export default Dashbord