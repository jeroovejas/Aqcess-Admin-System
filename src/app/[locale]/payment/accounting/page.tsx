"use client"
import { useState, useEffect, useRef } from "react";
import AccountingTable from "@/components/Tables/accountingTable";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import ExportModal from "@/components/AccountingComponents/ExportModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Loader from "@/components/common/Loader";
import { toggleExportModal, resetAccountingState } from "@/store/Slices/AccountingSlice";
import { Link,useRouter } from '@/navigation';
import { IoSearchOutline } from "react-icons/io5";
import { useTranslations } from 'next-intl';
import ViewModal from "@/components/AccountingComponents/ViewModal";
import SearchFilterModal from "@/components/AccountingComponents/filterMOdal";
console.log();


const AccountingManager = () => {
    const t = useTranslations();
    const exportModal = useAppSelector((state) => state.accounting.exportModal)
    const accountingDetails = useAppSelector((state) => state.accounting.accountingDetails)
    const viewModal = useAppSelector((state) => state.accounting.viewModal)
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterTerm, setFilterTerm] = useState<string>('');
    const dispatch = useAppDispatch();
    const filterRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleFiltersSubmit = (newFilters: any) => {
        console.log("Here is Filter Data");
        console.log(newFilters);
        setFilterTerm(newFilters)
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); 
    };

    useEffect(() => {
        if (isTokenValid) {
            setVerified(true);
        } else {
            router.push('/auth/login');
        }
    }, [isTokenValid, router])

    useEffect(() => {
        if (exportModal || viewModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [exportModal, viewModal]);

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
    }, [router])


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
                                {t('PAYMENT.title')}
                            </h2>
                        </div>
                        <div className="mx-auto">
                            <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                                <div className="mt-1 text-lg font-bold me-3">
                                    <Link href="/payment/payment-history">{t('PAYMENT.tab1')}</Link>
                                </div>
                                <div className="mt-1 text-lg font-bold me-3">
                                    <Link href="/payment/expenses">{t('PAYMENT.tab3')}</Link>
                                </div>
                                <div className="mt-1 text-lg font-bold me-4">
                                    <Link href="/payment/products">{t('PAYMENT.tab2')}</Link>
                                </div>
                                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center mr-4">
                                    {t('PAYMENT.tab4')}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">

                            <CardDataStats title={t('ACCOUNTNG.card1')} total={`$${accountingDetails.totalIncomeAmount || 0}`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('ACCOUNTNG.card2')} total={`$${accountingDetails.totalProductAmount || 0}`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('ACCOUNTNG.card3')} total={`$${accountingDetails.totalExpenseAmount || 0}`} rate="">
                            </CardDataStats>

                        </div>
                        <div className="mb-4 flex flex-wrap justify-between">
                            <div className="flex flex-wrap w-full md:w-auto">
                                <div className="relative mb-4 w-full md:w-auto">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <IoSearchOutline size={20} />
                                    </div>
                                    <input type="search" id="default-search" name="searchTerm" onChange={handleChange} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder={t('ACCOUNTNG.search')} required />
                                </div>
                                <div className="px-2">
                                    <button
                                        className="px-4 py-[10px] flex items-center bg-black text-white rounded-lg"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <IoFilterSharp className="mr-2" /> {t('ACCOUNTNG.button2')}
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
                                        {t('ACCOUNTNG.button1')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10">
                            <AccountingTable filterTerm={filterTerm} searchTerm={searchTerm} />
                        </div>
                        {(exportModal || viewModal) && <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50">
                        </div>}
                        <ExportModal filterTerm={filterTerm} searchTerm={searchTerm} />
                        <ViewModal />
                    </DefaultLayout>
                </>
            ) : null}
        </>
    );
};

export default AccountingManager;
