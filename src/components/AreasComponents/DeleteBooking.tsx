"use client"
import React, { useState, useRef, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleBookingModal, toggleIsUpdated } from "@/store/Slices/AreaSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { cancelAreaBooking } from "@/lib/api/commonArea";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const DeleteBooking: React.FC<any> = () => {
    const t = useTranslations();
    const bookingModal = useAppSelector((state) => state.area.bookingModal)
    const bookingId = useAppSelector((state) => state.area.bookingId)
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleBookingCancel = async () => {
        setLoading(true)
        try {
            const body = {
                booking_id: bookingId,
                token: token
            };
            const response = await cancelAreaBooking(body);
            if (response.success) {
                dispatch(toggleIsUpdated());
                dispatch(toggleBookingModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during cancel booking :', err.message);
        }finally{
            setLoading(false)
        }
    };

    return (
        <>
            {bookingModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">
                                <MdErrorOutline size={45} className="mb-6 text-danger bg-[#FEE4E2] rounded-full p-2" />
                                <h3 className="text-3xl font-semibold mt-8">{t('AREA.delete2Modal.title')}</h3>
                                <p className="font-[500] mt-2 mb-6"> {t('AREA.delete2Modal.lable')}</p>
                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold px-6 py-3 text-sm outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleBookingModal())}
                                    >
                                        {t('AREA.delete2Modal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-danger font-bold  text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleBookingCancel}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('AREA.delete2Modal.button2')}`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default DeleteBooking;