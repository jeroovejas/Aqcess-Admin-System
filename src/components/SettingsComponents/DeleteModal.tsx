"use client"
import React, { useState, useRef, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleDeleteModal, toggleIsUpdated } from "@/store/Slices/SettingSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCard } from "@/lib/api/payment";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const DeleteModal: React.FC<any> = () => { 
          const t = useTranslations();
    
    const deleteModal = useAppSelector((state) => state.setting.deleteModal)
    const cardData = useAppSelector((state) => state.setting.cardData)
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleDelete = async () => {
        setLoading(true)
        try {
            const params = { id: cardData.id, token: token }
            const response = await deleteCard(params);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleDeleteModal())
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during deleting card:', err.message);
        } finally {
            setLoading(false)
        }
    };


    return (
        <>
            {deleteModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <MdErrorOutline size={45} className="mb-6 text-danger bg-danger-light rounded-full p-2" />

                                <h3 className="text-3xl font-semibold mt-8">{t('PAYMENTBILLING.deleteModal.title')}</h3>
                                <p className="font-[500] mt-2 mb-6">{t('PAYMENTBILLING.deleteModal.lable')}</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className=" border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        {t('PAYMENTBILLING.deleteModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer  rounded-lg bg-danger font-bold  text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleDelete}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PAYMENTBILLING.deleteModal.button2')}`}
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

export default DeleteModal;