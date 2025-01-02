"use client"
import React, { useState, useRef, useEffect } from "react";
import { toggleBillingModal, toggleAddMethodModal, toggleEditMethodModal, setCardData, toggleDeleteModal } from "@/store/Slices/SettingSlice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import AddMethodModal from "./AddMethodModal";
import EditMethodModal from "./EditMethodModal";
import DeleteModal from "./DeleteModal";
import { getAllCards } from "@/lib/api/payment";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { useLocale, useTranslations } from 'next-intl';


// Define types for survey form state

const paymentData: any[] = [
    {
        invoice: "Premium Plan-May 2024",
        Amount: "$19",
        Date: "May 19,2024",
        Status: "Paid",
    },
    {
        invoice: "Premium Plan-April 2024",
        Amount: "$19",
        Date: "Apr 19,2024",
        Status: "Paid",
    },
    {
        invoice: "Premium Plan-March 2024",
        Amount: "$19",
        Date: "Feb 19,2024",
        Status: "Paid",
    },
    {
        invoice: "Premium Plan-February 2024",
        Amount: "$19",
        Date: "Sep 19,2024",
        Status: "Paid",
    },
    {
        invoice: "Premium Plan-January 2024",
        Amount: "$19",
        Date: "Aug 19,2024",
        Status: "Paid",
    },
    {
        invoice: "Premium Plan-May 2024",
        Amount: "$19",
        Date: "May 19,2024",
        Status: "Paid",
    },
    {
        invoice: "Premium Plan-January 2024",
        Amount: "$19",
        Date: "Aug 19,2024",
        Status: "Paid",
    },
    {
        invoice: "Premium Plan-May 2024",
        Amount: "$19",
        Date: "May 19,2024",
        Status: "Paid",
    },

];

const PaymentAndBilling: React.FC = () => {
      const t = useTranslations();
    
    const billingModal = useAppSelector((state) => state.setting.billingModal)
    const deleteModal = useAppSelector((state) => state.setting.deleteModal)
    const addMethod = useAppSelector((state) => state.setting.addMethod)
    const editMethod = useAppSelector((state) => state.setting.editMethod)
    const isUpdated = useAppSelector((state) => state.setting.isUpdated)
    const token = useAppSelector((state) => state.auth.token);
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch()

    const handleEdit = (card: any) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // For a smooth scrolling effect
        })
        dispatch(setCardData(card))
        dispatch(toggleEditMethodModal())
    }

    const handleDelete = (card: any) => {
        dispatch(setCardData(card))
        dispatch(toggleDeleteModal())
    }

    useEffect(() => {
        setLoading(true);
        fetchCards().finally(() => {
            setLoading(false);
        });
    }, [isUpdated])

    const fetchCards = async () => {
        try {

            let params = { token: token }
            const response = await getAllCards(params);

            // Check the success property to determine if the request was successful
            if (response.success) {
                setCards(response.data.data);
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during cards Fetch:', err.message);
        }
    }

    const handleAddMethod = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // For a smooth scrolling effect
        });
        dispatch(toggleAddMethodModal())
    };

    useEffect(() => {
        if (deleteModal || addMethod || editMethod) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [deleteModal, addMethod, editMethod]);

    return (
        <>
            {billingModal ? (


                loading ? (
                    <Loader />
                ) : (

                    <DefaultLayout>
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row items-center justify-between">
                            <div>
                                <h2 className="text-4xl font-bold text-black dark:text-white">
                                {t('PAYMENTBILLING.title')}
                                </h2>
                            </div>
                        </div>
                        <div className="mx-auto">
                            <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                                <div className="mt-1 text-lg font-bold ml-2">
                                    <button onClick={() => dispatch(toggleBillingModal())}  >{t('PAYMENTBILLING.tab1')}</button>
                                </div>
                                <button type="button" className="text-gray-900 bg-white ml-2 border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2  flex items-center mr-4">
                                {t('PAYMENTBILLING.tab2')}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 mb-4 md:mb-0">
                                <h2 className="text-lg font-bold pt-2">{t('PAYMENTBILLING.info')}</h2>
                                <p className="pt-1">{t('PAYMENTBILLING.desc')}</p>
                            </div>
                            <div className="w-full md:w-3/4 bg-white border border-slate-200 rounded-md px-4 py-3">
                                {cards.map((card, index) => (
                                    <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 bg-white border border-slate-200 px-2 py-2 rounded-md">
                                        <div className="flex items-center mb-4 md:mb-0">
                                            <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1" />
                                            <div className=" w-20 text-center  ml-2">
                                                <p className="text-[#1E2A86] font-extrabold italic text-[24px]">{card.cardType}</p>

                                            </div>
                                            <div className="ml-2">
                                                <h2 className="text-lg font-bold pt-1 pl-2">{card.cardNumber}</h2>
                                                <p className="text-base pl-2">Expiry {card.expiryMonth}/{card.expiryYear}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                                            <button onClick={() => handleDelete(card)} className="w-full md:w-auto text-black border border-slate-300 hover:text-white hover:bg-[#1E2A86] font-medium rounded-lg text-sm px-5 py-2.5 mr-0 md:mr-2 mb-2 md:mb-0">{t('PAYMENTBILLING.deleteButton')}</button>
                                            <button onClick={() => handleEdit(card)} className="w-full md:w-auto text-black border border-slate-300 hover:text-white hover:bg-[#1E2A86] font-medium rounded-lg text-sm px-5 py-2.5">{t('PAYMENTBILLING.editButton')}</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center mt-4">
                                    <FaPlus className="mt-3" />
                                    <button onClick={handleAddMethod} className="text-base font-bold pt-3 pl-2">{t('PAYMENTBILLING.addButton')}</button>
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col md:flex-row mt-8">
                            <div className="w-full md:w-1/2 mb-4 md:mb-0">
                                <h2 className="text-lg font-bold pt-2">{t('PAYMENTBILLING.info2')}</h2>
                                <p className="pt-1 ">{t('PAYMENTBILLING.desc2')}</p>
                            </div>
                            <div className="md:w-3/4 relative overflow-x-auto text-black">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                            {t('PAYMENTBILLING.table.column1')}
                                            </th>
                                            <th scope="col" className="pl-16 py-3">
                                            {t('PAYMENTBILLING.table.column2')}
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                            {t('PAYMENTBILLING.table.column3')}
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                            {t('PAYMENTBILLING.table.column4')}
                                            </th>
                                            <th>


                                            </th>
                                            <th>

                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentData.map((payment, key) => (
                                            <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                                                <td className="pl-6 py-4 font-bold whitespace-nowrap">
                                                    {payment.invoice}
                                                </td>
                                                <td className="pl-16 py-4 whitespace-nowrap">
                                                    {payment.Amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {payment.Date}
                                                </td>
                                                <td className={`px-6 py-4 flex items-center whitespace-nowrap font-bold ${payment.Status == 'Paid' ? 'text-meta-3' : 'text-meta-1'}`}>
                                                    <div className="flex items-center">
                                                        {payment.Status}
                                                    </div>
                                                </td>
                                                <td>
                                                    <MdOutlineFileDownload className="text-black mt-4 text-xl" />
                                                </td>
                                            </tr>
                                        )
                                        )}

                                    </tbody>
                                </table>
                            </div>

                        </div>
                        {(deleteModal || addMethod || editMethod)
                            && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
                            </div>}
                        <AddMethodModal />
                        <EditMethodModal />
                        <DeleteModal />
                    </DefaultLayout>
                )

            ) : null}
        </>
    );
};

export default PaymentAndBilling;




