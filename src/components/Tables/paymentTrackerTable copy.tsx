"use client"
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getAllPayments } from "@/lib/api/payment";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { setPaymentDetails, setPaymentData, toggleViewModal, togglePaymentStatusModal } from "@/store/Slices/PaymentSlice";
import { useLocale, useTranslations } from 'next-intl';
import { toTitleCase, downloadBase64Image } from "@/lib/common.modules";
import Link from "next/link";


const PaymentTrackerTable: React.FC<any> = ({ filterTerm, searchTerm }) => {
  const t = useTranslations();
  const limit = 10;
  const PAGE_RANGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const isUpdated = useAppSelector((state) => state.payment.isUpdated)
  const token = useAppSelector((state) => state.auth.token);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()

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

  const handleViewPayment = (payment: any) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    dispatch(setPaymentData(payment))
    dispatch(toggleViewModal())
  }

  const handlePaymentStatusChange = (payment: any) => {
    dispatch(setPaymentData(payment))
    dispatch(togglePaymentStatusModal())
  }

  useEffect(() => {
    setLoading(true);
    fetchIncomes().finally(() => {
      setLoading(false);
    });
  }, [currentPage, isUpdated, filterTerm, searchTerm])


  const fetchIncomes = async () => {
    try {

      let params = { page: currentPage, token: token, limit: limit, filterTerm: filterTerm, searchTerm: searchTerm }
      const response = await getAllPayments(params);

      // Check the success property to determine if the request was successful
      if (response.success) {
        setPayments(response.data.data.allPayments);
        setTotalPages(response.data.data.pagination.totalPages)
        dispatch(setPaymentDetails({
          totalPendingAmount: response.data.data.totalPendingAmount,
          painInTime: response.data.data.painInTime,
          paymentThisMonth: response.data.data.paymentThisMonth,
        }))
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during incomes Fetch:', err.message);
    }
  }

  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
        {t('PAYMENTTRACKER.table.title')}
      </h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-auto text-black">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column1')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column2')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column3')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column5')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column7')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column6')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column7')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column8')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column9')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column10')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column11')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column12')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column13')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column14')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PAYMENTTRACKER.table.column15')}
                </th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan={6} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                    {t('COMMON.noDataText')}
                  </td>
                </tr>
              ) : (
                payments.map((payment, key) => (
                  <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.invoiceId}
                    </td>
                    <td scope="row" className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                      <p className=" text-black font-bold dark:text-white  mt-2 ml-2">
                        {payment.residentName}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.productTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {toTitleCase(payment.type)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>)}
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
    </div >
  );
};

export default PaymentTrackerTable;
