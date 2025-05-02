import React, { useState } from 'react'
import { toggleViewModal } from "@/store/Slices/SubscriptionSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaRegCopy } from "react-icons/fa6";
import { PiGreaterThan } from "react-icons/pi";
import { useLocale, useTranslations } from 'next-intl';

const ViewModal: React.FC<any> = () => {
    const t = useTranslations();
    const viewModal = useAppSelector((state) => state.subscription.viewModal)
    const subscriptionData = useAppSelector((state) => state.subscription.subscriptionData)
    const dispatch = useAppDispatch()

    const truncateText = (text: any, maxLength: any) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };
    return (
        <>
            {viewModal ? (
                <>
                    <div className={`absolute top-0 right-0 w-full z-999 md:w-2/5 bg-white  h-screen overflow-y-scroll my-scrollbar`}>
                        <div className="border-0  relative text-black w-full h-full outline-none focus:outline-none  px-8 py-8">
                            <div className="flex justify-between items-center mt-8">
                                <div className="flex items-center">
                                    <h3 className="text-3xl font-semibold ">{t('Subscription.viewModal.head')}</h3>
                                </div>

                                <button className="bg-transparent border-0 text-[20px] font-bold text-black "
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    x
                                </button>
                            </div>
                            <div className="w-full my-6 ">

                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('Subscription.table.col1')}</p>
                                    <p className='font-medium w-2/3'>{subscriptionData.userName}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('Subscription.table.col2')}</p>
                                    <p className='font-medium w-2/3'>{subscriptionData.email}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('Subscription.table.col3')}</p>
                                    <p className='font-medium w-2/3'>{subscriptionData.packageType}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('Subscription.table.col4')}</p>
                                    <p className='font-medium w-2/3'>{subscriptionData.startDate}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <div className='font-bold w-1/3'>{t('Subscription.table.col5')}</div>
                                    <div className='font-medium w-2/3 '>{subscriptionData.endDate}</div>

                                </div>
                            </div>
                            <div className="flex gap-3 items-center j">
                                <button
                                    className=" border rounded-lg border-[#DDDDDD]  background-transparent font-medium  px-6 text-sm py-3  outline-none  ml-2 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    {t('Subscription.viewModal.closeButton')}
                                </button>
                            </div>


                        </div>

                    </div>





                </>
            ) : null}
        </>
    );
}

export default ViewModal


