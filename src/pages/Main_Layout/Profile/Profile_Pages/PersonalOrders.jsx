import {
  ArrowDown, ArrowUp, CheckCheck,
  Clock, Package, Search, XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import OrderApi from '../../../../context/orderApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthProvider';
import OrderCard from '../../../../components/Order/OrderCard';
import { useDebounce } from '../../../../hooks/useDebounce';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';


const PersonalOrders = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortDate, setSortDate] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await OrderApi.get(`/?lang=${lang}`, { withCredentials: true });
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.log(error?.response?.data);
      }
    };

    fetchOrders();
  }, [lang]);


  const debouncedSearch = useDebounce(searchQuery, 400);

  const filteredOrders = [...orders]
    .sort((a, b) =>
      sortDate
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    )
    .filter((order) => {
      if (selectedFilter !== 'All') {
        return order.paymentResult.status.toLowerCase() === selectedFilter.toLowerCase();
      }
      return true;
    })
    .filter((order) => {
      let lowerQuery = debouncedSearch.toLowerCase();

      const orderIdMatch = order._id.includes(lowerQuery);
      const productNameMatch = order.orderItems.some((item) =>
        item?.product?.name.toLowerCase().includes(lowerQuery)
      );

      return orderIdMatch || productNameMatch;
    });

  const countOrders = {
    All: orders.length,
    Paid: orders.filter((o) => o.paymentResult.status.toLowerCase() === 'paid').length,
    Pending: orders.filter((o) => o.paymentResult.status.toLowerCase() === 'pending').length,
    Cancelled: orders.filter((o) => o.paymentResult.status.toLowerCase() === 'cancelled').length,
  };

  const getIcon = (label) => {
    switch (label) {
      case 'Paid': return <CheckCheck />;
      case 'Pending': return <Clock />;
      case 'Cancelled': return <XCircle />;
      default: return <Package />;
    }
  };


  return (
    <section className="min-h-screen px-4 py-8 sm:px-6 md:px-8 max-w-screen-3xl mx-auto space-y-8 ">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row sm:items-center sm:justify-between 
                      border border-gray-200 dark:border-gray-700 
                      rounded-xl shadow-sm p-4 mb-6 
                      bg-white dark:bg-gray-900">

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('myOrders')}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t('myOrdersTrack')}</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative w-full min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={20}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder={t('searchOrdersProducts')}
            className="w-full bg-white dark:bg-gray-800 text-slate-900 dark:text-white 
                      py-2.5 pl-10 pr-4 border-2 rounded-xl 
                      border-gray-200 dark:border-gray-700
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-300 focus:outline-none"
          />
        </div>

      </div>

        {/* FILTER + SORT BAR */}
        <div className="flex flex-col gap-4 my-8">

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap md:flex-row flex-col gap-2 w-full">

            {['All', 'Paid', 'Pending', 'Cancelled'].map((stat, index) => (
              <button
                key={index}
                onClick={() => setSelectedFilter(stat)}
                className={`
                  group px-4 py-2 rounded-xl border text-sm font-medium flex items-center justify-between md:justify-center gap-2
                  transition-all duration-200 shadow-sm
                  w-full md:w-auto
                  ${
                    selectedFilter === stat
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="opacity-70 group-hover:opacity-100 transition-all duration-150">
                    {getIcon(stat)}
                  </span>
                  {t(String(stat).toLowerCase())}
                </div>
                <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
                  {countOrders[stat] || 0}
                </span>
              </button>
            ))}

          </div>


          {/* SORT BUTTON */}
          <button
            onClick={() => setSortDate(!sortDate)}
            className="
              flex items-center justify-between md:justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              border bg-white dark:bg-gray-900 shadow-sm transition duration-200
              hover:bg-gray-100 dark:hover:bg-gray-800
              text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700
              w-full md:w-auto
            "
          >
            {sortDate ? <ArrowDown /> : <ArrowUp />}
            {sortDate ? t("oldest") : t("latest")}
          </button>

        </div>


      {/* ORDER LIST */}
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        <div className="w-[80vw] h-[50vh] flex items-center justify-center text-center py-16 mx-auto">
          <div className="max-w-md">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {t("noOrdersPlaced")}
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t("noOrdersFound")}
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                    {t("continueShopping")}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default PersonalOrders;
