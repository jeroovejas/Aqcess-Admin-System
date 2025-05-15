"use client"
import React, { useRef, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleIsUpdated, toggleDeleteModal } from "@/store/Slices/UserManagementSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { deleteSocietyAdmin } from "@/lib/api/userManagement";
import { useTranslations } from 'next-intl';
const DeleteModal: React.FC<any> = () => {
    const t = useTranslations();
    const deleteModal = useAppSelector((state) => state.userManagement.deleteModal)
    const admin = useAppSelector((state) => state.userManagement.adminData)
    const token = useAppSelector((state) => state.auth.token)
    const dispatch = useAppDispatch()

    const handleDelete = async () => {
        try {
            let params = { id: admin.id, token: token }
            const response = await deleteSocietyAdmin(params);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleDeleteModal())
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during deleting society admin:', err.message);
        }
    };

    return (
        <>
            {deleteModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div  className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <MdErrorOutline size={45} className="mb-6 text-danger bg-danger-light rounded-full p-2" />

                                <h3 className="text-3xl font-semibold mt-8">   {t('USERMANAGEMENT.modal.deleteTitle')}</h3>
                                <p className="font-[500] mt-2 mb-6">{t('USERMANAGEMENT.modal.deleteDesc')}</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        {t('USERMANAGEMENT.modal.cancelButton')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-lg bg-danger font-bold  text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleDelete}
                                    >
                                        {t('USERMANAGEMENT.modal.deleteButton')}
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