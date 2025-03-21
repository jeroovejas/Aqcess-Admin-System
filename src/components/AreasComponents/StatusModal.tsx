"use client"
import React, { useState, useEffect, useRef } from "react";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { GrHide } from "react-icons/gr";
import { BiSolidShow } from "react-icons/bi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toggleStatusModal, toggleIsUpdated,toggleViewModal } from "@/store/Slices/AreaSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeCommonAreaStatus } from "@/lib/api/commonArea";
import { useLocale, useTranslations } from 'next-intl';

const StatusModal: React.FC<any> = () => { 
    const t = useTranslations();
    const statusModal = useAppSelector((state) => state.area.statusModal)
    const areaData = useAppSelector((state) => state.area.areaData)
    const viewModal = useAppSelector((state) => state.area.viewModal)
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleChangeStatus = async () => {
        setLoading(true)
        try {
            const body = {
                area_id: areaData.id,
                status: areaData.status === "hidden" ? "available" : "hidden",
                token: token
            };
            const response = await changeCommonAreaStatus(body);
            if (response.success) {
                if (viewModal) {
                    dispatch(toggleViewModal())
                }
                dispatch(toggleIsUpdated());
                dispatch(toggleStatusModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during hiding area :', err.message);
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            {statusModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[470px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                {areaData.status === "hidden" ? <BiSolidShow size={30} className="mb-6 " /> : <GrHide size={30} className="mb-6 " />}
                                <h3 className="text-3xl font-semibold mt-8">{areaData.status === "hidden" ? "Make available" : "Hide"} {t('AREA.hideModal.title')}</h3>
                                {areaData.status === "hidden" ?
                                    <p className="font-[500] mt-4 mb-6">{t('AREA.hideModal.lable')}</p> :
                                    <p className="font-[500] mt-4 mb-6">{t('AREA.hideModal.lable1')}</p>}




                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleStatusModal())}
                                    >
                                        {t('AREA.hideModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold  text-sm px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleChangeStatus}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                        ) : (
                                            areaData.status === 'hidden' ? `${t('AREA.hideModal.button3')}` : `${t('AREA.hideModal.button2')}`
                                        )}
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

export default StatusModal;