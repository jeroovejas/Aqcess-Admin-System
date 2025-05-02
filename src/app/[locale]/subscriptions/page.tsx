"use client"
import { useState, useEffect } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaChevronRight } from "react-icons/fa";
import { DateRangePickerElement } from "@/components/DataPicker";
import SubscriptionTable from "@/components/Tables/subscriptionsTable";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "@/navigation";
import ViewModal from "@/components/Subscription/ViewModal";
import { resetState } from "@/store/Slices/SubscriptionSlice";
import { useTranslations } from "next-intl";


const Subscriptions = () => {
      const t = useTranslations();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const token = useAppSelector((state) => state.auth.token)
    const [verified, setVerified] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const viewModal = useAppSelector((state) => state.subscription.viewModal);
    const subscriptionDetails = useAppSelector((state) => state.subscription.subscriptionDetails)
    const dispatch = useAppDispatch()
    const router = useRouter();
    const toggleFilterDropdown = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const closeDropdown = () => {
        setIsFilterOpen(false);
        setIsStatusOpen(false);
    }
    const toggleStatusDropdown = () => {
        setIsStatusOpen(!isStatusOpen);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Update the search term
    };

    useEffect(() => {
        if (isTokenValid) {
            setVerified(true);
        } else {
            router.push('/auth/login');
            // setTimeout(() => {
            //     showErrorToast("Plz Login First");
            // }, 2000);
        }
    }, [isTokenValid, router])

    useEffect(() => {
        dispatch(resetState())
    }, [router])

    useEffect(() => {
        if (viewModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [viewModal]);

    return (
        <>
            {verified ? (
                <>
                    <DefaultLayout>
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-title-md2 font-bold text-black dark:text-white">
                            {t('Subscription.title')}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-5">

                            <CardDataStats title={t('Subscription.card1')} total={`${subscriptionDetails.totalSubscriptions}`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('Subscription.card2')} total={`${subscriptionDetails.paidSubscriptions}`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('Subscription.card3')} total={`${subscriptionDetails.freeSubscriptions}`} rate="">
                            </CardDataStats>
                            <CardDataStats title={t('Subscription.card4')} total={`${subscriptionDetails.totalAmount}`} rate="">
                            </CardDataStats>
                        </div>
                        <div className="mb-4 flex justify-between">
                            <div className="flex">
                                <div className="relative">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <IoSearchOutline size={20} />
                                    </div>
                                    <input type="search" id="default-search" onChange={handleChange}
                                        value={searchTerm} className="block w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder={t('Subscription.placeHolder')} required />
                                </div>
                                <div className="text-black md:mt-0 md:ml-3">
                                    <DateRangePickerElement setFromDate={setFromDate} setToDate={setToDate} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10">
                            <SubscriptionTable searchTerm={searchTerm} fromDate={fromDate} toDate={toDate} />
                        </div>
                        {(viewModal) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
                        </div>}
                        <ViewModal />

                    </DefaultLayout>

                </>
            ) : null
            }
        </>
    );
};

export default Subscriptions;
