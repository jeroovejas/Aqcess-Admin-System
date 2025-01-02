"use client"
import React, { useRef, useEffect,useState } from "react";
import { CiWarning } from "react-icons/ci";
import { toggleSaveModal, toggleIsUpdated } from "@/store/Slices/ResidentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editResident } from "@/lib/api/resident";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const SaveChangesModal: React.FC<any> = () => { 
      const t = useTranslations();
    
    const saveModal = useAppSelector((state) => state.resident.saveModal)
    const resident = useAppSelector((state) => state.resident.residentData);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);

    const handleEdit = async () => {
        setLoading(true)
        try {
            const body = {
                ...resident,
                pets: resident.pets.length > 0 ? JSON.stringify(resident.pets) : null,
                vehicles: resident.vehicles.length > 0 ? JSON.stringify(resident.vehicles) : null,
                token: token 
            };
            console.log(body)
            const response = await editResident(body);
            if (response.success) {
                dispatch(toggleSaveModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                dispatch(toggleSaveModal());
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during edit resident:', err.message);
        }finally {
            setLoading(false)
          }
    };



    return (
        <>
            {saveModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[400px] my-6 max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <CiWarning size={45} className="mb-6 text-[#DC6803] bg-[#FEF0C7] rounded-full p-2" />

                                <h3 className="text-xl font-semibold mt-8">{t('RESIDENT.changesModal.title')}</h3>
                                <p className="font-[500] mt-2 mb-6">{t('RESIDENT.changesModal.lable')}</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-base outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleSaveModal())}
                                    >
                                        {t('RESIDENT.changesModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold  text-base px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleEdit}
                                        disabled={loading}
                                    >
                                         {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('RESIDENT.changesModal.button2')}`}
                                       
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