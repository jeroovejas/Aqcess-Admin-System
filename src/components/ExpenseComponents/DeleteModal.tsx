"use client"
import React, { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleDeleteModal,toggleIsUpdated } from "@/store/Slices/ExpenseSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useTranslations } from 'next-intl';
import { deleteExpense } from "@/lib/api/expense";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
const DeleteModal: React.FC<any> = () => {
    const t = useTranslations();
    const deleteModal = useAppSelector((state) => state.expense.deleteModal)
    const expense = useAppSelector((state) => state.expense.expenseData)
    const token = useAppSelector((state) => state.auth.token)
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true)
        try {
            let params = { id: expense.id, token: token }
            const response = await deleteExpense(params);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleDeleteModal())
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during deleting expense:', err.message);
        } finally {
            setLoading(false)
        }

    };


    return (
        <>
            {deleteModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-999 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <MdErrorOutline size={45} className="mb-6 text-danger bg-danger-light rounded-full p-2" />

                                <h3 className="text-xl font-semibold mt-8">{t('EXPENSE.deleteModal.title')}</h3>
                                <p className="font-[500] mt-2 mb-6">{t('EXPENSE.deleteModal.desc')}</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-semibold  px-6 py-3 text-base outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        {t('RESIDENT.deleteModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-danger font-semibold  text-base px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleDelete}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('RESIDENT.deleteModal.button2')}`}

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