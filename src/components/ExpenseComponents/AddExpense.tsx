"use client";
import React, { useState, useEffect } from "react";
import { toggleAddExpense, toggleIsUpdated } from "@/store/Slices/ExpenseSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import 'react-phone-number-input/style.css';
import { useTranslations } from 'next-intl';
import { createExpense } from "@/lib/api/expense";


interface ExpenseFormData {
    amount: number | null
    desc: string
    file: File | null;
    imagePreview?: string | null;
}


const initialExpenseFormData: ExpenseFormData = {
    amount: null,
    desc: '',
    file: null,
    imagePreview: null,
};

const AddExpense: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations();
    const addExpense = useAppSelector((state) => state.expense.addExpense);
    const token = useAppSelector((state) => state.auth.token);
    const user = useAppSelector((state) => state.auth.userData);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<ExpenseFormData>(initialExpenseFormData);

    // Handle input change
    const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

    };

    const handleExpenseFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevValues) => ({
                    ...prevValues,
                    file,
                    imagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prevValues) => ({
                ...prevValues,
                file: null,
                imagePreview: null
            }));
        }
    }

    const deleteExpenseImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setFormData((prevValues) => ({
            ...prevValues,
            file: null,
            imagePreview: null // Set the image preview URL
        }));
    }

    const handleExpenseCancel = async () => {
        dispatch(toggleAddExpense());
        setFormData(initialExpenseFormData);
    };

    const handleExpenseSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        try {
            const body = new FormData();
            body.append('amount', formData.amount === null ? '' : formData.amount.toString());
            body.append('desc', formData.desc);
            body.append('token', token);
            if (formData.file) {
                body.append('attachment', formData.file);
            }

            const response = await createExpense(body);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleAddExpense());
                showSuccessToast(response.data.message);
                setFormData(initialExpenseFormData);
            } else {
                showErrorToast(response.data.message);
            }
        } catch (err: any) {
            console.error('Unexpected error during creating expense:', err.message);
        } finally {
            setLoading(false)
        }

    };

    return (
        <>
            {addExpense ? (
                <div className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
                    <div className="flex justify-between items-center mt-8">
                        <h3 className="text-3xl font-semibold">{t('EXPENSE.addModal.title')}</h3>
                        <button className="bg-transparent border-0 text-[20px] font-bold text-black"
                            onClick={() => dispatch(toggleAddExpense())}
                        >
                            x
                        </button>
                    </div>
                    <form onSubmit={handleExpenseSubmit}>
                        <div className="w-full my-6">

                            <div className="relative">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="price">
                                    {t('PAYMENT.paymentModal.label3')}
                                </label>
                                <input
                                    id="amount"
                                    name="amount"
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="number"
                                    onChange={handleExpenseChange}
                                    placeholder={t('PAYMENT.paymentModal.placeHolder3')}
                                    value={formData.amount || ''}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="desc">
                                    {t('PAYMENT.paymentModal.label4')}
                                </label>
                                <input
                                    id="desc"
                                    name="desc"
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    onChange={handleExpenseChange}
                                    placeholder={t('PAYMENT.paymentModal.placeHolder4')}
                                    value={formData.desc}
                                />
                            </div>

                            <div className="w-full">
                                <label className="block uppercase text-black  tracking-wide text-[14px] font-bold mb-2" htmlFor="file">
                                    {t('PAYMENT.paymentModal.label5')}
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="file"
                                        className="flex flex-col items-center justify-center w-full h-50 border-gray-300 border border-[#DDDDDD] rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                    >
                                        {formData.imagePreview ? (
                                            <div className="relative w-full h-full">

                                                <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                                <button onClick={deleteExpenseImage} className="absolute right-2 top-2 bg-[#D0D5DD] rounded-[8px] text-slate-950 p-2">
                                                    <RiDeleteBin6Line size={15} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-semibold">{t('AREA.button1Modal.label5')}</span> {t('AREA.button1Modal.label6')}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {t('AREA.button1Modal.label7')}
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            id="file"
                                            type="file"
                                            name="file"
                                            className="hidden"
                                            onChange={handleExpenseFileChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-4 gap-3 items-center">
                            <button
                                className="text-white flex justify-center items-center rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3 shadow hover:shadow-lg outline-none  mr-1 mb-1"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('EXPENSE.addModal.button')}`}

                            </button>
                            <button
                                className=" border rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                type="button"
                                onClick={handleExpenseCancel}
                            >
                                {t('PAYMENT.paymentModal.button1')}
                            </button>

                        </div>
                    </form>
                </div>
            ) : null}
        </>
    );
};

export default AddExpense;
