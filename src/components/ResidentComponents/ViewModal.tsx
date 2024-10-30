import React, { useRef, useEffect } from 'react'
import { toggleEditModal, toggleViewModal } from "@/store/Slices/ResidentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaRegCopy } from "react-icons/fa6";
import { PiGreaterThan } from "react-icons/pi";
const ViewModal: React.FC<any> = () => {
    const viewModal = useAppSelector((state) => state.resident.viewModal)
    const resident = useAppSelector((state) => state.resident.residentData)
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
    }
    return (
        <>
            {viewModal ? (
                <>
                    <div className={`absolute top-0 right-0 w-full z-999 md:w-2/5 bg-white  h-screen overflow-y-scroll my-scrollbar`}>
                        <div className="border-0  relative text-black w-full h-full outline-none focus:outline-none  px-8 py-8">
                            <div className="flex justify-between items-center mt-8">


                                <div className="flex items-center">
                                    <h3 className="text-3xl font-semibold ">{resident.firstName} {resident.lastName}</h3>
                                    <span className={`${resident.status === 'active' ? 'text-meta-3 p-1 px-2 bg-[#ECFDF3]' : 'text-meta-1 bg-[#FEF3F2] p-2'} ms-4 font-semibold text-[16px] rounded-2xl`}>
                                        {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
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
                                    <p className='font-bold w-1/3'>Name</p>
                                    <p className='font-medium w-2/3'>{resident.firstName} {resident.lastName}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>Adress</p>
                                    <p className='font-medium w-2/3'>{resident.resident.address}</p>

                                </div>
                                <div className="flex py-6 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>Email</p>
                                    <div className="flex justify-between w-2/3  pe-4">
                                        <p className='font-medium'>{resident.email}</p>
                                        <p className='cursor-pointer'><FaRegCopy onClick={() => handleCopy(resident.email)} size={25} /></p>
                                    </div>
                                </div>
                                {/* <div className="flex py-6 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>Password</p>
                                    <div className="flex justify-between w-2/3  pe-4 ">
                                        <p className='font-medium'>12345678</p>
                                        <p className='cursor-pointer'><FaRegCopy onClick={() => handleCopy(12345678)} size={25} /></p>
                                    </div>
                                </div> */}
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>Phone</p>
                                    <p className='font-medium w-2/3'>{resident.resident.phoneNumber}</p>

                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>Last Visit</p>
                                    <p className='font-medium w-2/3'>{resident.lastLoggedIn}</p>

                                </div>
                                <div className="flex py-6 border-b-[3px] border-slate-100 ">
                                    <p className='font-bold w-1/3'>Overdue Payments</p>
                                    <div className="flex justify-between w-2/3  pe-4">
                                        <p className='font-medium'>{resident.resident.overduePayments}</p>
                                        <p className=''><PiGreaterThan size={15} /></p>
                                    </div>
                                </div>
                                <div className="flex py-4 border-b-[3px] border-slate-100 ">
                                    <div className='font-bold w-1/3'>Internal Notes</div>
                                    <div className='font-medium w-2/3 '>{truncateText(resident.resident.internalNotes, 100)}</div>

                                </div>
                            </div>
                            <div className="flex gap-3 items-center j">



                                <button
                                    className="text-white  rounded-lg bg-primary-blue font-medium text-sm px-6 py-3   outline-none  mr-2 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleViewModal())}
                                >
                                    Send Message
                                </button>
                                <button
                                    className=" border rounded-lg border-[#DDDDDD]  background-transparent font-medium  px-6 text-sm py-3  outline-none  ml-2 mb-1"
                                    type="button"
                                    onClick={viewEdit}
                                >
                                    Edit
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


