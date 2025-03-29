import React, { useRef, useEffect } from 'react'
import { toggleViewModal } from "@/store/Slices/AccountingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from 'next-intl';
import { downloadBase64Image, toTitleCase } from '@/lib/common.modules';
import { LuDownload } from "react-icons/lu";
import Link from 'next/link';

const ViewModal: React.FC<any> = () => {
    const t = useTranslations();
    const viewModal = useAppSelector((state) => state.accounting.viewModal)
    const payment = useAppSelector((state) => state.accounting.accountingData)
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
                            {
                                payment.transactionType == "Income" ?
                                    <>
                                        <div className="flex justify-between items-center mt-8">
                                            {/* Income Details */}
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-3xl font-semibold ">Income Details</h3>
                                            </div>
                                            <button className="bg-transparent border-0 text-[26px] font-bold text-black "
                                                onClick={() => dispatch(toggleViewModal())}>
                                                x
                                            </button>
                                        </div>
                                        <div className="w-full my-6 ">
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'> {t('ACCOUNTING.viewModal.invoice.label1')}</p>
                                                <p className='font-medium w-2/3'>{payment.invoiceId || "N/A"}</p>
                                            </div>
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.invoice.label2')}</p>
                                                <p className='font-medium w-2/3'>{payment.residentName || "N/A"}</p>
                                            </div>
                                            {/* <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.invoice.label3')}</p>
                                                <p className='font-medium w-2/3'> {payment.type ? toTitleCase(payment.type) : "N/A"}</p>
                                            </div> */}
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.invoice.label4')}</p>
                                                <p className='font-medium w-2/3'> {payment.status || "N/A"}</p>
                                            </div>
                                            {payment.attachment &&
                                                <div className=" py-4 ">
                                                    <div className="flex justify-between">
                                                        <div className='font-bold '>{t('ACCOUNTING.viewModal.invoice.label5')}</div>
                                                        <div className="relative group flex items-center me-">
                                                            <Link href={payment.attachment} download target="_blank" rel="noopener noreferrer">
                                                                <LuDownload className="text-lg" />
                                                            </Link>
                                                            {/* <button onClick={() => downloadBase64Image(payment.attachmentBase64)} className="p-2">
                                                                <LuDownload className="text-lg" />
                                                            </button> */}
                                                            <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-gray-900 text-blue-950 text-xs font-bold fo px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                                                                Download
                                                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <img src={payment.attachment} className='w-full mt-3 h-[250px] object-cover rounded-lg' alt='Attachment' /> */}
                                                </div>
                                            }
                                        </div>
                                        {/* Product Details */}
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-3xl font-semibold ">Product Details</h3>
                                        </div>
                                        <div className="w-full my-6 ">
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'> {t('ACCOUNTING.viewModal.product.label1')}</p>
                                                <p className='font-medium w-2/3'>{payment.productTitle || "N/A"}</p>
                                            </div>
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.product.label2')}</p>
                                                <p className='font-medium w-2/3'>{payment.amount || "N/A"}</p>
                                            </div>
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.product.label3')}</p>
                                                <p className='font-medium w-2/3'> {payment.productDesc || "N/A"}</p>
                                            </div>
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.product.label4')}</p>
                                                <p className='font-medium w-2/3'> {payment.productType || "N/A"}</p>
                                            </div>
                                            {payment.productType == "monthly" ?
                                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                    <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.product.label4')}</p>
                                                    <p className='font-medium w-2/3'> {payment.productMonth || "N/A"}</p>
                                                </div>
                                                : ""}
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.product.label5')}</p>
                                                <p className='font-medium w-2/3'> {payment.productStatus || "N/A"}</p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {/* Expense Details */}
                                        <div className="flex justify-between items-center mt-8">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-3xl font-semibold ">Expense Details</h3>
                                            </div>
                                            <button className="bg-transparent border-0 text-[26px] font-bold text-black "
                                                onClick={() => dispatch(toggleViewModal())}>
                                                x
                                            </button>
                                        </div>
                                        <div className="w-full my-6 ">
                                            {/* <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'> {t('ACCOUNTING.viewModal.expenses.label1')}</p>
                                                <p className='font-medium w-2/3'>{payment.expenseUser || "N/A"}</p>
                                            </div> */}
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.expenses.label2')}</p>
                                                <p className='font-medium w-2/3'>{payment.amount || "N/A"}</p>
                                            </div>
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.expenses.label3')}</p>
                                                <p className='font-medium w-2/3'> {payment.description || "N/A"}</p>
                                            </div>
                                            <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                                <p className='font-bold w-1/3'>{t('ACCOUNTING.viewModal.expenses.label4')}</p>
                                                <p className='font-medium w-2/3'> {payment.createdAt || "N/A"}</p>
                                            </div>
                                            {payment.attachment &&
                                                <div className=" py-4 ">
                                                    <div className="flex justify-between">
                                                        <div className='font-bold '>{t('ACCOUNTING.viewModal.expenses.label5')}</div>
                                                        <div className="relative group flex items-center me-">
                                                            <Link href={payment.attachment} download target="_blank" rel="noopener noreferrer">
                                                                <LuDownload className="text-lg" />
                                                            </Link>
                                                            {/* <button onClick={() => downloadBase64Image(payment.attachmentBase64)} className="p-2">
                                                                <LuDownload className="text-lg" />
                                                            </button> */}
                                                            <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-gray-900 text-blue-950 text-xs font-bold fo px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                                                                Download
                                                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <img src={payment.attachment} className='w-full mt-3 h-[250px] object-cover rounded-lg' alt='Attachment' /> */}
                                                </div>
                                            }
                                        </div>
                                    </>
                            }
                            <div className="flex gap-3 items-center ">
                                <button
                                    className=" border rounded-lg border-[#DDDDDD]  background-transparent font-medium  px-6 text-sm py-3  outline-none  ml-2 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    {t('ACCOUNTING.button3')}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

export default ViewModal;