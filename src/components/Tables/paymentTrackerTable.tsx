"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getAllPaymentTracker } from "@/lib/api/payment";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { setTrackerDetails } from "@/store/Slices/TrackerSlice";
import { useTranslations } from "next-intl";

const PaymentTrackerTable: React.FC<any> = ({ filterTerm, searchTerm, selectedMonthYear }) => {
  const t = useTranslations();
  const limit = 10;
  const PAGE_RANGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [payments, setPaymentsTracker] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isUpdated = useAppSelector((state) => state.payment.isUpdated);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    setLoading(true);
    fetchPayments().finally(() => setLoading(false));
  }, [currentPage, isUpdated, filterTerm, searchTerm, selectedMonthYear]);

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - PAGE_RANGE);
    const endPage = Math.min(totalPages, currentPage + PAGE_RANGE);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const fetchPayments = async () => {
    try {
      // const params = { token, type: selectedMonthYear,  filterTerm: filterTerm, searchTerm: searchTerm  };
      let params = { page: currentPage, token: token, limit: limit, type: selectedMonthYear, searchTerm: searchTerm, filterTerm: filterTerm }
      const response = await getAllPaymentTracker(params);
      if (response.success) {
        setPaymentsTracker(response.data.data.monthlyData);
        setTotalPages(response.data.data.pagination.totalPages);
        dispatch(setTrackerDetails({
          totalExpectedAmount: response.data.data.expectedAmount,
          totalAmountPaid: response.data.data.totalAmountPaid,
          remainingAmount: response.data.data.remainingAmount,
          payableAmountPercentage: response.data.data.payableAmountPercentage,
        }));
      } else {
        showErrorToast(response.data.message);
      }
    } catch (err: any) {
      console.error("Unexpected error during payments fetch:", err.message);
    }
  };

  const getAllMonths = () => {
    const months = [
      { "name": "January", "spanishName": `${t("MONTHNAME.January")}` },
      { "name": "February", "spanishName": `${t("MONTHNAME.February")}` },
      { "name": "March", "spanishName": `${t("MONTHNAME.March")}` },
      { "name": "April", "spanishName": `${t("MONTHNAME.April")}` },
      { "name": "May", "spanishName": `${t("MONTHNAME.May")}` },
      { "name": "June", "spanishName": `${t("MONTHNAME.June")}` },
      { "name": "July", "spanishName": `${t("MONTHNAME.July")}` },
      { "name": "August", "spanishName": `${t("MONTHNAME.August")}` },
      { "name": "September", "spanishName": `${t("MONTHNAME.September")}` },
      { "name": "October", "spanishName": `${t("MONTHNAME.October")}` },
      { "name": "November", "spanishName": `${t("MONTHNAME.November")}` },
      { "name": "December", "spanishName": `${t("MONTHNAME.December")}` }
    ];

    // const currentMonthIndex = new Date().getMonth();
    const currentMonthIndex = new Date().getMonth();
    const currentMonth = months[currentMonthIndex];
    // const allMonth = months.slice(0, currentMonthIndex + 1);
    return { currentMonth, months }
  };

  const monthData = getAllMonths();

  /** 📌 Extract Unique Months */
  const uniqueMonths = Array.from(new Set(payments.map((p) => p.month)));
  console.log(payments);
  // console.log(uniqueMonths);

  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
        {t("PAYMENTTRACKER.table.title")}
      </h4>
      {loading ? <Loader /> : (
        <div className="relative overflow-x-auto text-black">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base border border-slate-300 bg-black text-white dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">{t("PAYMENTTRACKER.table.column1")}</th>
                <th className="px-6 py-3">{t("PAYMENTTRACKER.table.column2")}</th>
                {/* <th className="px-6 py-3">{t("PAYMENTTRACKER.table.column3")}</th> */}
                {/* 🔥 Dynamic Months */}
                {
                  selectedMonthYear == "month" ?
                    <th className="px-6 py-3">{monthData.currentMonth.spanishName}</th>
                    :
                    monthData?.months.map((month, index) => (
                      <th key={index} className="px-6 py-3">{month.spanishName}</th>
                    ))
                }
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan={uniqueMonths.length + 3} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                    {t("COMMON.noDataText")}
                  </td>
                </tr>
              ) : (
                payments.map((payment, key) => (
                  <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">{payment.property_number}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {payment.resident}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">{payment.product}</td> */}
                    {/* 🔥 Monthly Values */}
                    {
                      selectedMonthYear == "month" ?
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment[monthData.currentMonth.name.toLowerCase()] ? `$${payment[monthData.currentMonth.name.toLowerCase()]}` : "$0"}
                        </td>
                        :
                        // monthData?.months.map((month, index) => (
                        //   <td key={index} className="px-6 py-4 whitespace-nowrap">
                        //     {payment.month === month.name ? `$${payment.total}` : "$0"}
                        //   </td>
                        // ))
                        monthData?.months.map((month: any, index: any) => (
                          <td className="px-6 py-4 whitespace-nowrap" key={index}>
                            ${payment[month.name.toLowerCase()] || 0}
                          </td>
                        ))                        
                    }
                    <td className="px-6 py-4 whitespace-nowrap">${payment.total_payments}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      <div className="mb-4 mt-5 flex justify-center">
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-lg">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 bg-white px-3 font-bold leading-tight text-black dark:hover:text-white"
              >
                <FaArrowLeft className="mr-1" />
                {t('COMMON.previous')}
              </button>
            </li>
            {getPageNumbers().map((page, index) => (
              <li key={index}>
                {page === "..." ? (
                  <span className="text-gray-500 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center border bg-white px-3 leading-tight text-black dark:hover:text-white">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page as number)}
                    className={`text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center border bg-white px-3 leading-tight text-black dark:hover:text-white ${page === currentPage ? "dark:bg-gray-700 border-blue-500 bg-blue-50 text-blue-700 dark:text-white" : ""}`}
                  >
                    {page}
                  </button>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center rounded-e-lg border bg-white px-3 font-bold leading-tight text-black dark:hover:text-white"
              >
                {t('COMMON.next')}
                <FaArrowRight className="ml-1" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PaymentTrackerTable;
