import React, { useRef, useEffect } from 'react'
import { toggleViewModal } from "@/store/Slices/PaymentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from 'next-intl';
import { downloadBase64Image, toTitleCase } from '@/lib/common.modules';
import { LuDownload } from "react-icons/lu";
import Link from 'next/link';

const ViewModal: React.FC<any> = () => {
    const t = useTranslations();

    const viewModal = useAppSelector((state) => state.payment.viewModal)
    const payment = useAppSelector((state) => state.payment.paymentData)
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
                                    <h3 className="text-3xl font-semibold ">{payment.invoiceId}</h3>
                                    <span className={` p-2 rounded-2xl ${payment.adminStatus == 'approved' ? 'text-meta-3 bg-[#ECFDED]' : payment.adminStatus == 'rejected' ? 'text-meta-1 bg-[#FEF3F2]' : 'bg-[#F2F4F7] text-[#344054]'}`}>
                                        {toTitleCase(payment.adminStatus)}
                                    </span>
                                </div>

                                <button className="bg-transparent border-0 text-[20px] font-bold text-black "
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    x
                                </button>
                            </div>
                            <div className="w-full my-6 ">

                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'> {t('PAYMENT.viewModal.label2')}</p>
                                    <p className='font-medium w-2/3'>{payment.invoiceId}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('PAYMENT.viewModal.label1')}</p>
                                    <p className='font-medium w-2/3'>{payment.residentName}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('PAYMENT.viewModal.label3')}</p>
                                    <p className='font-medium w-2/3'> {payment.productTitle}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('PAYMENT.viewModal.label4')}</p>
                                    <p className='font-medium w-2/3'> {payment.amount}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('PAYMENT.viewModal.label5')}</p>
                                    <p className='font-medium w-2/3'> {toTitleCase(payment.type)}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <div className='font-bold w-1/3'>{t('PAYMENT.viewModal.label6')}</div>
                                    <div className='font-medium w-2/3 '>{truncateText(payment.desc, 100)}</div>

                                </div>
                                {payment.rejectReason &&
                                    <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                        <div className='font-bold w-1/3'>{t('PAYMENT.viewModal.label7')}</div>
                                        <div className='font-medium w-2/3 '>{truncateText(payment.rejectReason, 100)}</div>

                                    </div>}
                                {payment.attachment &&
                                    <div className=" py-4 ">
                                        <div className="flex justify-between">
                                            <div className='font-bold '>{t('PAYMENT.viewModal.label8')}</div>
                                            <div className="relative group flex items-center me-">
                                                <Link href={payment.attachment} download target="_blank" rel="noopener noreferrer">
                                                    Download File
                                                </Link>
                                                {/* <Link onClick={() => downloadImage(payment.attachmentBase64)} className="p-2">
                                                    <LuDownload className="text-lg" />
                                                </Link> */}

                                                <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-gray-900 text-blue-950 text-xs font-bold fo px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                                                    Download
                                                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <img src={payment.attachment} className='w-full mt-3 h-[250px] object-cover rounded-lg' alt='Attachment' /> */}
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


