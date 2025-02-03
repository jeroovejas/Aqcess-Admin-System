"use client"
import React, { useState, useRef, useEffect } from "react";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { togglePaymentStatusModal, toggleIsUpdated } from "@/store/Slices/PaymentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from 'next-intl';
import { updatePaymentStatus } from "@/lib/api/payment";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PaymentStatusModal: React.FC<any> = () => {
    const t = useTranslations();

    const [status, setStatus] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const paymentStatusModal = useAppSelector((state) => state.payment.paymentStatusModal)
    const token = useAppSelector((state) => state.auth.token);
     const payment = useAppSelector((state) => state.payment.paymentData)
    const dispatch = useAppDispatch()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        try {
            const body = {
                income_id: payment.id,
                status: status,
                reason: reason,
                token: token
            }

            const response = await updatePaymentStatus(body);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(togglePaymentStatusModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message);
            }
        } catch (err: any) {
            console.error('Unexpected error during updating payment status:', err.message);
        } finally {
            setLoading(false)
        }

    };


    console.log("status", status)
    return (
        <>
            {paymentStatusModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <form onSubmit={handleSubmit}>
                            <div className="relative w-[calc(100vw-20px)] md:w-auto my-6">
                                <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                    <FaRegArrowAltCircleUp size={30} className="mb-6 " />
                                    <h3 className="text-3xl font-semibold mt-8">{t('PAYMENT.statusModal.title')}</h3>
                                    <p className="font-[500] mt-2">{t('PAYMENT.statusModal.desc')}</p>
                                    <div className="relative mt-3">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="productId">
                                        {t('PAYMENT.statusModal.label1')}
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={status}
                                            onChange={(e) => { setStatus(e.target.value) }}
                                            required
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        >
                                            <option value="" disabled>{t('PAYMENT.statusModal.placeHolder1')}</option>
                                            <option value="approved">{t('PAYMENT.statusModal.option1')}</option>
                                            <option value="rejected">{t('PAYMENT.statusModal.option2')}</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {status === 'rejected' &&
                                        <div className="relative">
                                            <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="price">
                                            {t('PAYMENT.statusModal.label2')}
                                            </label>
                                            <input
                                                id="reason"
                                                name="reason"
                                                className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                type="text"
                                                placeholder={t('PAYMENT.statusModal.placeHolder2')}
                                                value={reason}
                                                onChange={(e) => { setReason(e.target.value) }}
                                                required
                                            />
                                        </div>}
                                    <div className="flex gap-3 items-center">
                                        <button
                                            className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 flex items-center justify-center cursor-pointer  background-transparent font-bold px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                            type="button"
                                            onClick={() => dispatch(togglePaymentStatusModal())}
                                        >
                                            {t('PAYMENT.statusModal.button1')}
                                        </button>
                                        <button
                                            className="text-white w-1/2 flex items-center justify-center cursor-pointer  rounded-lg bg-primary-blue font-bold text-sm px-6 py-3   outline-none  mr-1 mb-1"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PAYMENT.statusModal.button2')}`}
                                        </button>
                                    </div>
                                </div>




                            </div>
                        </form>
                    </div>
                </>
            ) : null
            }
        </>
    );
};

export default PaymentStatusModal;