"use client"
import { useState, useEffect, useRef } from "react";
import AccountingTable from "@/components/Tables/accountingTable";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import ExportModal from "@/components/AccountingComponents/ExportModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Loader from "@/components/common/Loader";
import AddPayment from "@/components/PaymentComponents/AddPaymentExpense";
import { toggleExportModal, resetAccountingState } from "@/store/Slices/AccountingSlice";
import { toggleAddPayment } from "@/store/Slices/PaymentSlice";
import { Link, useRouter } from '@/navigation';
import { IoSearchOutline } from "react-icons/io5";
import { useTranslations } from 'next-intl';
import PaymentStatusModal from "@/components/PaymentComponents/PaymentStatusModal";
import ViewModal from "@/components/AccountingComponents/ViewModal";
import SearchFilterModal from "@/components/AccountingComponents/filterMOdal";

const AccountingManager = () => {
    const t = useTranslations();
    const exportModal = useAppSelector((state) => state.accounting.exportModal)
    const accountingDetails = useAppSelector((state) => state.accounting.accountingDetails)
    const paymentStatusModal = useAppSelector((state) => state.payment.paymentStatusModal)
    const viewModal = useAppSelector((state) => state.accounting.viewModal)
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const addPayment = useAppSelector((state) => state.payment.addPayment);
    const packageId = useAppSelector((state) => state.auth.packageId);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterTerm, setFilterTerm] = useState<string>('');
    const filterRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleFiltersSubmit = (newFilters: any) => {
        setFilterTerm(newFilters)
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleAddPayment = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        dispatch(toggleAddPayment())
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
        if (exportModal || viewModal || addPayment || paymentStatusModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [exportModal, viewModal, addPayment, paymentStatusModal]);

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
        dispatch(resetAccountingState())
    }, [router, dispatch]);

    if (verified === null) {
        return <Loader />
    }

    return (
        <>
            {verified ? (
                <>
                    <DefaultLayout>
                        {/* <Breadcrumb pageName="Resident manager" /> */}
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                                {t('ACCOUNTING.title')}
                            </h2>
                        </div>
                        <div className="mx-auto">
                            <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-semibold rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center me-3">
                                    {t('PAYMENT.tab4')}
                                </button>
                                {/* <div className="text-sm font-semibold my-2 me-3">
                                    <Link href="/payment/payment-history">{t('PAYMENT.tab1')}</Link>
                                </div> */}
                                {/* <div className="text-sm font-semibold my-2 me-3">
                                    <Link href="/payment/expenses">{t('PAYMENT.tab3')}</Link>
                                </div> */}
                                <div className="text-sm font-semibold my-2 me-3">
                                    <Link href="/payment/payment-tracker">{t('PAYMENT.tab5')}</Link>
                                </div>
                                <div className="text-sm font-semibold my-2">
                                    <Link href="/payment/products">{t('PAYMENT.tab2')}</Link>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">
                            <CardDataStats title={t('ACCOUNTING.card1')} total={`$${accountingDetails.totalIncomeAmount || 0}`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('ACCOUNTING.card2')} total={`$${accountingDetails.totalExpenseAmount || 0}`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('ACCOUNTING.card3')} total={`$${accountingDetails.totalProductAmount || 0}`} rate="">
                            </CardDataStats>
                        </div>
                        <div className="mb-4 flex flex-wrap justify-between">
                            <div className="flex flex-wrap w-full md:w-auto">
                                <div className="relative mb-4 w-full md:w-auto">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <IoSearchOutline size={20} />
                                    </div>
                                    <input type="search" id="default-search" name="searchTerm" onChange={handleChange} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder={t('ACCOUNTING.search')} required />
                                </div>
                                <div className="px-2">
                                    <button
                                        className="px-4 py-[10px] flex items-center bg-black text-white rounded-lg"
                                        onClick={() => setIsModalOpen(true)}>
                                        <IoFilterSharp className="mr-2" /> {t('ACCOUNTING.button2')}
                                    </button>
                                    <SearchFilterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onFiltersSubmit={handleFiltersSubmit} />
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
                                        {t('ACCOUNTING.button1')}
                                    </button>
                                </div>
                                <div className="w-full mr-3 md:w-auto mt-2 md:mt-0">
                                    <button
                                        type="button"
                                        onClick={handleAddPayment}
                                        className="w-full justify-center text-white bg-primary-blue font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center"
                                    >
                                        <IoIosAdd className="mr-2 text-white text-xl" />
                                        {t('PAYMENT.button2')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10">
                            <AccountingTable filterTerm={filterTerm} searchTerm={searchTerm} />
                        </div>
                        {(exportModal || viewModal || addPayment || paymentStatusModal) && <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50">
                        </div>}
                        <ExportModal filterTerm={filterTerm} searchTerm={searchTerm} />
                        <ViewModal />
                        <AddPayment />
                        <PaymentStatusModal />
                    </DefaultLayout>
                </>
            ) : null}
        </>
    );
};

export default AccountingManager;
