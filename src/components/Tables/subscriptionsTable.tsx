import Image from "next/image";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { toggleViewModal, setSubscriptionData } from "@/store/Slices/SubscriptionSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from 'next-intl';
import { getAllSubscriptions } from "@/lib/api/subscription";
import { useRouter } from "@/navigation";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { setSubscriptionDetails } from "@/store/Slices/SubscriptionSlice";

const SubscriptionTable: React.FC<any> = ({ searchTerm, fromDate, toDate }) => {
  const t = useTranslations();
  const limit = 10;
  const PAGE_RANGE = 5;
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const token = useAppSelector((state) => state.auth.token)
  const isUpdated = useAppSelector((state) => state.subscription.isUpdated)
  const [totalPages, setTotalPages] = useState(1);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleViewSubscription = (subscription: any) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    dispatch(setSubscriptionData(subscription))
    dispatch(toggleViewModal())
  }

  useEffect(() => {
    setLoading(true);
    fetchSubscriptions().finally(() => {
      setLoading(false);
    });
  }, [currentPage, isUpdated, searchTerm, fromDate, toDate])

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


  const fetchSubscriptions = async () => {
    try {
      let params = { page: currentPage, token: token, limit: limit, searchTerm: searchTerm, fromDate: fromDate, toDate: toDate }
      const response = await getAllSubscriptions(params);

      // Check the success property to determine if the request was successful
      if (response.success) {
        setSubscriptions(response.data.data.allSubscriptions);
        setTotalPages(response.data.data.pagination.totalPages);
        dispatch(setSubscriptionDetails({
          totalSubscriptions: response.data.data.totalSubscriptions,
          freeSubscriptions: response.data.data.freeSubscriptions,
          paidSubscriptions: response.data.data.paidSubscriptions,
          totalAmount: response.data.data.totalAmount
        }))
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during Subscriptions Fetch:', err.message);
    }
  }

  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
        {t('Subscription.table.head')}
      </h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-auto text-black">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('Subscription.table.col1')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('Subscription.table.col2')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('Subscription.table.col3')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('Subscription.table.col4')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('Subscription.table.col5')}
                </th>
                <th>

                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((Subscription, key) => (
                <tr key={key} className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <p className=" text-black font-bold dark:text-white  mt-2 ml-2">
                      {Subscription.userName}
                    </p>
                  </th>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Subscription.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Subscription.packageType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Subscription.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Subscription.endDate}
                  </td>
                  <td className="px-6 relative group whitespace-nowrap">
                    <BsThreeDotsVertical className="text-black" />
                    <ul className="absolute z-20 bottom-0 mb-0 w-[150px] right-2 my-4 text-[14px] bg-white hidden group-hover:block  text-black border border-gray ">
                      <li onClick={() => handleViewSubscription(Subscription)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">{t('Subscription.table.view')}</li>
                    </ul>
                  </td>

                </tr>
              )
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

export default SubscriptionTable;
