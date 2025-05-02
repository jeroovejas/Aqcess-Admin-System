"use client"
import { useState, useEffect, useRef } from "react";
import PaymentTable from "@/components/Tables/paymentTable";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import ExportModal from "@/components/PaymentComponents/ExportModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleExportModal, resetPaymentState } from "@/store/Slices/PaymentSlice";
import Loader from "@/components/common/Loader";
import { Link, useRouter } from '@/navigation';
import { IoSearchOutline } from "react-icons/io5";
import { useTranslations } from 'next-intl';
import ViewModal from "@/components/PaymentComponents/ViewModal";
import SearchFilterModal from "@/components/PaymentComponents/filterMOdal";
import PaymentTrackerTable from "@/components/Tables/paymentTrackerTable";
import SearchFilterTrackerModal from "@/components/TrackerComponent/filterMOdal";

const PaymentTracker = () => {
  const t = useTranslations();
  const exportModal = useAppSelector((state) => state.payment.exportModal)
  const paymentStatusModal = useAppSelector((state) => state.payment.paymentStatusModal)
  const trackerDetails = useAppSelector((state) => state.tracker.trackerDetails)
  const addPayment = useAppSelector((state) => state.payment.addPayment)
  const viewModal = useAppSelector((state) => state.payment.viewModal)
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const packageId = useAppSelector((state) => state.auth.packageId);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [selected, setSelected] = useState("month");
  const [filters, setFilters] = useState({
    residentId: null,
    propertyNo: "",
    productId: null,
    month: null,
  });

  const dispatch = useAppDispatch();
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleFiltersSubmit = (newFilters: any) => {
    console.log("Here is Tracker Filter Data");
    console.log(newFilters);
    setFilterTerm(newFilters)
    setFilters(newFilters);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (!isTokenValid) {
      router.push('/auth/login');
    } else if (packageId == 1) {
      router.push('/dashboard');
    } else {
      setVerified(true);
    }
  }, [isTokenValid, router, packageId])

  useEffect(() => {
    if (exportModal || addPayment || viewModal || paymentStatusModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [exportModal, addPayment, viewModal, paymentStatusModal]);

  const handleClickOutside = (event: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
      setIsFilterOpen(false);
      setIsStatusOpen(false);
    }
  };

  useEffect(() => {
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  useEffect(() => {
    dispatch(resetPaymentState())
  }, [router])

  useEffect(() => {
    setSearchTerm('')
  }, [searchTerm])

  if (verified === null) {
    return <Loader />
  }

  console.log("selected",selected)

  return (
    <>
      {verified ? (
        <>
          <DefaultLayout>
            {/* <Breadcrumb pageName="Resident manager" /> */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                {t('PAYMENTTRACKER.title')}
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 border rounded-md ${selected === "month" ? "bg-white font-semibold" : "bg-transparent"
                    }`}
                  onClick={() => {
                    // setSearchTerm('');
                    setSelected("month");
                  }}
                >
                  {t('PAYMENTTRACKER.tab1')}
                </button>

                <button
                  className={`px-4 py-2 border rounded-md ${selected === "year" ? "bg-white font-semibold" : "bg-transparent"}`}
                  onClick={() => {
                    // setSearchTerm('');
                    setSelected("year")
                  }}
                >
                  {t('PAYMENTTRACKER.tab2')}
                </button>
              </div>
            </div>
            <div className="mx-auto">
              <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                <div className="text-sm font-semibold ms-3 my-2 me-3">
                  <Link href="/payment/accounting">{t('PAYMENT.tab4')}</Link>
                </div>
                <div className="text-sm font-semibold my-2 me-3">
                  <Link href="/payment/payment-history">{t('PAYMENT.tab1')}</Link>
                </div>
                <div className="text-sm font-semibold my-2 me-3">
                  <Link href="/payment/expenses">{t('PAYMENT.tab3')}</Link>
                </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-semibold rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center me-3">
                  {t('PAYMENT.tab5')}
                </button>
                <div className="text-sm font-semibold my-2 me-3">
                  <Link href="/payment/products">{t('PAYMENT.tab2')}</Link>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">
              <CardDataStats title={t('PAYMENTTRACKER.card1')} total={`$${trackerDetails.totalExpectedAmount}`} rate="">
              </CardDataStats>
              <CardDataStats title={t('PAYMENTTRACKER.card2')} total={`$${trackerDetails.totalAmountPaid}`} rate="">
              </CardDataStats>
              <CardDataStats title={t('PAYMENTTRACKER.card3')} total={`$${trackerDetails.remainingAmount}`} rate="">
              </CardDataStats>
              <CardDataStats title={t('PAYMENTTRACKER.card4')} total={`${trackerDetails.payableAmountPercentage}%`} rate="">
              </CardDataStats>
            </div>
            <div className="mb-4 flex flex-wrap justify-between">
              <div className="flex flex-wrap w-full md:w-auto">
                <div className="relative mb-4 w-full md:w-auto">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <IoSearchOutline size={20} />
                  </div>
                  <input type="search" id="default-search" name="searchTerm" onChange={handleChange} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder={t('PAYMENTTRACKER.search')} required />
                </div>
                <div className="px-2">
                  <button
                    className="px-4 py-[10px] flex items-center bg-black text-white rounded-lg"
                    onClick={() => setIsModalOpen(true)}>
                    <IoFilterSharp className="mr-2" /> {t('PAYMENTTRACKER.button2')}
                  </button>
                  <SearchFilterTrackerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onFiltersSubmit={handleFiltersSubmit} />
                </div>
              </div>
              <div className="flex flex-wrap w-full md:w-auto">
                <div className="w-full mr-3 md:w-auto mt-2 md:mt-0">
                  <button
                    type="button"
                    onClick={() => dispatch(toggleExportModal())}
                    className="w-full md:w-auto text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-3 ms-0 md:ms-4 mb-2 dark:text-white dark:hover:bg-gray-700 flex items-center justify-center md:justify-start"
                  >
                    <TfiExport className="mr-2 text-base" />
                    {t('PAYMENT.button1')}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <PaymentTrackerTable filterTerm={filterTerm} searchTerm={searchTerm} selectedMonthYear={selected} />
            </div>
            {(exportModal || viewModal) && <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50">
            </div>}
            <ExportModal filterTerm={filterTerm} />
            <ViewModal />
          </DefaultLayout>
        </>
      ) : null}
    </>
  );
};

export default PaymentTracker;