"use client"
import { useState, useEffect, useRef } from "react";
import ExpenseTable from "@/components/Tables/expenseTable";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Loader from "@/components/common/Loader";
import { Link, usePathname, useRouter } from '@/navigation';
import { IoSearchOutline } from "react-icons/io5";
import { useLocale, useTranslations } from 'next-intl';
import AddExpense from "@/components/ExpenseComponents/AddExpense";
import { resetExpenseState, toggleAddExpense, toggleExportModal } from "@/store/Slices/ExpenseSlice";
import ViewModal from "@/components/ExpenseComponents/ViewModal";
import ExportModal from "@/components/ExpenseComponents/ExportModal";
import DeleteModal from "@/components/ExpenseComponents/DeleteModal";

const Expenses = () => {
    const t = useTranslations();
    const exportModal = useAppSelector((state) => state.expense.exportModal)
    const deleteModal = useAppSelector((state) => state.expense.deleteModal)
    const expenseDetails = useAppSelector((state) => state.expense.expenseDetails)
    const addExpense = useAppSelector((state) => state.expense.addExpense)
    const viewModal = useAppSelector((state) => state.expense.viewModal)
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterTerm, setFilterTerm] = useState<string>('');
    const dispatch = useAppDispatch();
    const filterRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Update the search term
    };

    const handleAddExpense = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        dispatch(toggleAddExpense())
    };

    useEffect(() => {
        if (isTokenValid) {
            setVerified(true);
        } else {
            router.push('/auth/login');
            // setTimeout(() => {
            //   showErrorToast("Plz Login First");
            // }, 2000);
        }
    }, [isTokenValid, router])

    useEffect(() => {
        if (exportModal || addExpense || viewModal || deleteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [exportModal, addExpense, viewModal, deleteModal]);

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
        dispatch(resetExpenseState())
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
                                <div className="mt-1 text-lg font-bold">
                                    <Link href="/payment/payment-history">{t('PAYMENT.tab1')}</Link>
                                </div>
                                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center mx-4">
                                    {t('PAYMENT.tab3')}
                                </button>
                                <div className="mt-1 text-lg font-bold">
                                    <Link href="/payment/products">{t('PAYMENT.tab2')}</Link>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">

                            <CardDataStats title={t('EXPENSE.label1')} total={`${expenseDetails.expenseThisMonth}$`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('EXPENSE.label2')} total={`${expenseDetails.totalExpenses}$`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('EXPENSE.label3')} total={`${expenseDetails.totalIncomes}$`} rate="">
                            </CardDataStats>

                        </div>
                        <div className="mb-4 flex flex-wrap justify-between">
                            <div className="flex flex-wrap w-full md:w-auto">
                                <div className="relative mb-4 w-full md:w-auto">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <IoSearchOutline size={20} />
                                    </div>
                                    <input type="search" id="default-search" name="searchTerm" onChange={handleChange} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder={t('EXPENSE.label4')} required />
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
                                        {t('EXPENSE.button1')}
                                    </button>
                                </div>
                                <div className="w-full mr-3 md:w-auto mt-2 md:mt-0">
                                    <button
                                        type="button"
                                        onClick={handleAddExpense}
                                        className="w-full justify-center text-white bg-primary-blue font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center"
                                    >
                                        <IoIosAdd className="mr-2 text-white text-xl" />
                                        {t('EXPENSE.button2')}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10">
                            <ExpenseTable filterTerm={filterTerm} searchTerm={searchTerm} />
                        </div>
                        {(exportModal || addExpense || viewModal || deleteModal) && <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50">
                        </div>}
                        <AddExpense />
                        <ViewModal />
                        <ExportModal />
                        <DeleteModal />
                    </DefaultLayout>
                </>
            ) : null}
        </>
    );
};

export default Expenses;
