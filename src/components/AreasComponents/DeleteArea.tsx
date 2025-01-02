"use client"
import React, { useState, useRef, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleDeleteModal, toggleIsUpdated } from "@/store/Slices/AreaSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { deleteCommonArea } from "@/lib/api/commonArea";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const DeleteArea: React.FC<any> = () => { 
    const t = useTranslations();
    const deleteModal = useAppSelector((state) => state.area.deleteModal)
    const areaData = useAppSelector((state) => state.area.areaData)
    const token = useAppSelector((state) => state.auth.token)
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const handleDelete = async () => {
        setLoading(true)
        try {
            let params = { id: areaData.id, token: token }
            const response = await deleteCommonArea(params);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleDeleteModal())
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during deleting common area', err.message);
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

                                <h3 className="text-3xl font-semibold mt-8">{t('AREA.deleteModal.title')}</h3>
                                <p className="font-[500] mt-2 mb-6"><span className="font-bold">{areaData.title}</span> {t('AREA.deleteModal.lable')}</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-medium px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        {t('AREA.deleteModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-danger font-medium  text-sm px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleDelete}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('AREA.deleteModal.button2')}`}
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

export default DeleteArea;