"use client"
import React, { useRef, useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { toggleSaveModal, toggleIsUpdated } from "@/store/Slices/SecurityGuardSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editSecurityGuard } from "@/lib/api/securityGuard";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const SaveChangesModal: React.FC<any> = () => { 
      const t = useTranslations();
    
    const saveModal = useAppSelector((state) => state.securityGuard.saveModal)
    const securityGuard = useAppSelector((state) => state.securityGuard.securityGuardData);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);

    const handleEdit = async () => {
        setLoading(true)
        try { 
            const body = {
                ...securityGuard,
                token: token // Add the token here
            };
            const response = await editSecurityGuard(body);
            if (response.success) {
                dispatch(toggleSaveModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                dispatch(toggleSaveModal());
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during edit security guard:', err.message);
        } finally {
            setLoading(false)
        }
    };



    return (
        <>
            {saveModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 md:w-[550px]">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none px-5 py-5 md:px-8 md:py-8">
                                <CiWarning size={45} className="mb-6 text-[#DC6803] bg-[#FEF0C7] rounded-full p-2" />
                                <h3 className="text-xl font-semibold mt-8">{t('SECURITY.changesModal.title')}</h3>
                                <p className="font-[500] mt-2 mb-6">{t('SECURITY.changesModal.lable')}</p>
                                <div className="flex flex-wrap md:flex-nowrap gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-full md:w-1/2 background-transparent font-bold  px-6 py-3 text-base outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleSaveModal())}
                                    >
                                        {t('SECURITY.changesModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-full md:w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold  text-base px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleEdit}
                                        disabled={loading}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SECURITY.changesModal.button2')}`}

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

export default SaveChangesModal;