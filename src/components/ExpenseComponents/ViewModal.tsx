import React, { useRef, useEffect } from 'react'
import { toggleViewModal } from "@/store/Slices/ExpenseSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from 'next-intl';

const ViewModal: React.FC<any> = () => {
    const t = useTranslations();

    const viewModal = useAppSelector((state) => state.expense.viewModal)
    const expense = useAppSelector((state) => state.expense.expenseData)
    const dispatch = useAppDispatch()


    const truncateText = (text: any, maxLength: any) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <>
            {viewModal ? (
                <>
                    <div className={`absolute top-0 right-0 w-full z-999 md:w-2/5 bg-white  h-screen overflow-y-scroll my-scrollbar`}>
                        <div className="border-0  relative text-black w-full h-full outline-none focus:outline-none  px-8 py-8">
                            <div className="flex justify-between items-center mt-8">


                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-semibold "> {t('EXPENSE.viewModal.title')}</h3>
                                </div>

                                <button className="bg-transparent border-0 text-[20px] font-bold text-black "
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    x
                                </button>
                            </div>
                            <div className="w-full my-6 ">

                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('EXPENSE.viewModal.label1')}</p>
                                    <p className='font-medium w-2/3'>{expense.userName}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('EXPENSE.viewModal.label2')}</p>
                                    <p className='font-medium w-2/3'> {expense.amount}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <div className='font-bold w-1/3'>{t('EXPENSE.viewModal.label3')}</div>
                                    <div className='font-medium w-2/3 '>{truncateText(expense.desc, 100)}</div>

                                </div>
                                {expense.attachment &&
                                    <div className=" py-4 ">
                                        <div className='font-bold w-1/3'>{t('EXPENSE.viewModal.label4')}</div>
                                        <img src={expense.attachment} className='w-full mt-3 h-[250px] object-cover rounded-lg' alt='Attachment' />

                                    </div>}
                            </div>
                            <div className="flex gap-3 items-center ">
                                <button
                                    className=" border rounded-lg border-[#DDDDDD]  background-transparent font-medium  px-6 text-sm py-3  outline-none  ml-2 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    {t('PAYMENT.viewModal.button')}
                                </button>
                            </div>


                        </div>

                    </div>





                </>
            ) : null}
        </>
    );
}

export default ViewModal


