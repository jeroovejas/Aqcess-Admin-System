"use client"
import { useState, useEffect } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaChevronRight } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useRouter } from "@/navigation";
import Loader from "@/components/common/Loader";
import { Check } from "lucide-react"
import PricingCard from "@/components/MySubscriptionsComponents/card";
import { useTranslations } from "next-intl";


const Subscriptions = () => {
    const t = useTranslations();
    const router = useRouter();
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const packageId = useAppSelector((state) => state.auth.packageId);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const dispatch = useAppDispatch()
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

    useEffect(() => {
        if (isTokenValid) {
            setVerified(true);
        } else {
            router.push('/auth/login');
        }
    }, [isTokenValid, router])

    if (verified === null) {
        return <Loader />
    }

    return (
        <>
            {verified ? (
                <>
                    <DefaultLayout>
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-title-md2 font-bold text-black dark:text-white">
                                {t('MySubscription.head')}
                            </h2>
                        </div>
                        {/* <div className="flex flex-col lg:flex-row gap-6 justify-center items-center lg:items-end mt-6 md:mt-12"> */}
                        <div className="flex flex-col md:flex-row gap-6 justify-center items-center md:items-stretch mt-6 md:mt-12">
                        {/* <div className="flex flex-wrap gap-6 justify-center items-center mt-6 md:mt-12"> */}


                            <PricingCard
                                cardId={1}
                                title={t('MySubscription.card1.head')}
                                price={'$0'}
                                subtitle={t('MySubscription.card1.subHead')}
                                features={[
                                    'MySubscription.card1.feature1',
                                    'MySubscription.card1.feature2',
                                    'MySubscription.card1.feature3',
                                    'MySubscription.card1.feature4',
                                    'MySubscription.card1.feature5',
                                    'MySubscription.card1.feature6',
                                    'MySubscription.card1.feature7'
                                ]}
                            />

                            <PricingCard
                                cardId={2}
                                title={t('MySubscription.card2.head')}
                                price={'$10'}
                                subtitle={t('MySubscription.card2.subHead')}
                                features={[
                                    'MySubscription.card1.feature1',
                                    'MySubscription.card2.feature2',
                                    'MySubscription.card2.feature3',
                                    'MySubscription.card2.feature4',
                                    'MySubscription.card2.feature5',
                                    'MySubscription.card2.feature6',
                                    'MySubscription.card2.feature7',
                                    'MySubscription.card2.feature8',
                                    'MySubscription.card2.feature9',
                                    'MySubscription.card2.feature10',
                                    'MySubscription.card2.feature11',
                                    'MySubscription.card2.feature12',
                                    'MySubscription.card2.feature13'
                                ]}
                            />

                        </div>

                    </DefaultLayout>

                </>
            ) : null
            }
        </>
    );
};

export default Subscriptions;
