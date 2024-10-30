"use client"
import React, { useState, useRef, useEffect } from "react";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { toggleExportModal } from "@/store/Slices/PaymentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
const ExportModal: React.FC<any> = () => {
    const [selectedOption, setSelectedOption] = useState<string>("");
    const exportModal = useAppSelector((state) => state.payment.exportModal)
    const dispatch = useAppDispatch()


    return (
        <>
            {exportModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[calc(100vw-20px)] md:w-auto my-6">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                <FaRegArrowAltCircleUp size={30} className="mb-6 " />
                                <h3 className="text-3xl font-semibold mt-8">Export payment history</h3>
                                <p className="font-[500] mt-2">Please select the format you would like to use for exporting</p>
                                <div className="w-full my-6">

                                    <div className="relative">
                                        <select
                                            value={selectedOption}
                                            onChange={(e) => {
                                                setSelectedOption(e.target.value);

                                            }}
                                            className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8   focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                            <option value="PDF" className="">PDF</option>
                                            <option value="CSV">Excel</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>



                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleExportModal())}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-lg bg-primary-blue font-bold text-sm px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleExportModal())}
                                    >
                                        Export
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

export default ExportModal;