import React, { useEffect, useState } from "react";
import AnalyticsApi from "../../context/analytics";
import { toast } from "react-toastify";
import { Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

function TopCustomers() {

  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const res = await AnalyticsApi.get("/customers/best", {
          withCredentials: true,
        });

        if (res.data.success) {
          setCustomers(res.data.data);
          console.log(res.data);
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error?.response?.data || error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 h-fit">
      <div className="w-full mx-auto">
        <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 dark:text-gray-200">
          <Trophy /> {t('bestCustomers')}
        </h2>

        <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-800">
          <table className="w-full text-left border-collapse">
            {/* Head */}
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr className="text-gray-700 dark:text-gray-200">
                <th className="px-4 py-4">{t('customer')}</th>
                <th className="px-4 py-4">{t('email')}</th>
                <th className="px-4 py-4">{t('phone')}</th>
                <th className="px-4 py-4">{t('orders')}</th>
                <th className="px-4 py-4">{t('totalSpent')}</th>
                <th className="px-4 py-4">{t('lastOrder')}</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="dark:text-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t('loading')}
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t('noCustomersFound')}
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <tr
                    key={c.userId}
                    className={`
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      ${i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}
                    `}
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={c.avatar || "https://via.placeholder.com/40"}
                        alt={c.name}
                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700"
                      />
                      <span className="font-medium">{c.name}</span>
                    </td>

                    <td className="px-6 py-4">{c.email}</td>
                    <td className="px-6 py-4">{c.phone || "—"}</td>
                    <td className="px-6 py-4">{c.ordersCount}</td>

                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${c.totalSpent.toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {c.lastOrder
                        ? new Date(c.lastOrder).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopCustomers;
