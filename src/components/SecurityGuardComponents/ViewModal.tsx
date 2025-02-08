import React, { useState} from 'react'
import { toggleEditModal, toggleViewModal } from "@/store/Slices/SecurityGuardSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaRegCopy } from "react-icons/fa6";
import { PiGreaterThan } from "react-icons/pi";
import { useLocale, useTranslations } from 'next-intl';

const ViewModal: React.FC<any> = () => {
      const t = useTranslations(); 
      const [copied, setCopied] = useState(false);
    const viewModal = useAppSelector((state) => state.securityGuard.viewModal)
    const securityGuard = useAppSelector((state) => state.securityGuard.securityGuardData)
    const dispatch = useAppDispatch()

    const viewEdit = () => {
        dispatch(toggleViewModal())
        dispatch(toggleEditModal())
    }

    const truncateText = (text: any, maxLength: any) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const handleCopy = (text: any) => {
        navigator.clipboard.writeText(text)
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }
    return (
        <>
            {viewModal ? (
                <>
                    <div className={`absolute top-0 right-0 w-full z-999 md:w-2/5 bg-white  h-screen overflow-y-scroll my-scrollbar`}>
                        <div className="border-0  relative text-black w-full h-full outline-none focus:outline-none  px-8 py-8">
                            <div className="flex justify-between items-center mt-8">
                                <div className="flex items-center">
                                    <h3 className="text-3xl font-semibold ">{securityGuard.firstName} {securityGuard.lastName}</h3>
                                    <span className={`${securityGuard.status === 'active' ? 'text-meta-3 p-1 px-2 bg-[#ECFDF3]' : 'text-meta-1 bg-[#FEF3F2] p-2'} ms-4 font-semibold text-[16px] rounded-2xl`}>
                                        {securityGuard.status.charAt(0).toUpperCase() + securityGuard.status.slice(1)}
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
                                    <p className='font-bold w-1/3'>{t('SECURITY.viewModal.lable1')}</p>
                                    <p className='font-medium w-2/3'>{securityGuard.firstName} {securityGuard.lastName}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('SECURITY.viewModal.lable2')}</p>
                                    <p className='font-medium w-2/3'>{securityGuard.securityGuard.address}</p>

                                </div>

                                <div className="flex py-6 border-b-[3px] border-slate-100">
                                    <p className="font-bold w-1/3">{t('SECURITY.viewModal.lable3')}</p>
                                    <div className="flex justify-between w-2/3 pe-4 relative">
                                        <p className="font-medium">{securityGuard.email}</p>
                                        <div className="relative flex items-center">
                                            <button
                                                onClick={() => handleCopy(securityGuard.email)}
                                                className="cursor-pointer active:scale-90 transition-transform"
                                            >
                                                <FaRegCopy size={25} />
                                            </button>
                                            {copied && (
                                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-xs font-bold px-2 py-1 rounded-md shadow-md transition-opacity duration-300">
                                                    Copied!
                                                    <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-l-transparent border-r-transparent border-t-4 border-t-gray-800"></span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('SECURITY.viewModal.lable4')}</p>
                                    <p className='font-medium w-2/3'>{securityGuard.phoneNumber}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>{t('SECURITY.viewModal.lable5')}</p>
                                    <p className='font-medium w-2/3'>{securityGuard.lastLoggedIn}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <div className='font-bold w-1/3'>{t('SECURITY.viewModal.lable6')}</div>
                                    <div className='font-medium w-2/3 '>{truncateText(securityGuard.securityGuard.internalNotes, 100)}</div>

                                </div>
                            </div>
                            <div className="flex gap-3 items-center j">



                                <button
                                    className="text-white  rounded-lg bg-primary-blue font-medium text-sm px-6 py-3   outline-none  mr-2 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    {t('SECURITY.viewModal.button1')}
                                </button>
                                <button
                                    className=" border rounded-lg border-[#DDDDDD]  background-transparent font-medium  px-6 text-sm py-3  outline-none  ml-2 mb-1"
                                    type="button"
                                    onClick={viewEdit}
                                >
                                    {t('SECURITY.viewModal.button2')}
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


