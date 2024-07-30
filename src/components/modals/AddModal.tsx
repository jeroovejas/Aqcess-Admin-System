"use client"
import React, { useState } from "react";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
interface ComponentProps {
    addModal: boolean;
    toggleAddModal: () => void;
}

const AddModal: React.FC<ComponentProps> = ({ addModal, toggleAddModal }) => {

    return (
        <>
            {addModal ? (
                <>
                    <div className="flex justify-center  items-center overflow-x-hidden overflow-y-auto  inset-0 z-50 outline-none focus:outline-none">
                        <div className="absolute top-0 right-0 w-2/5  max-w-3xl min-h-[100vh] ">
                            <div className="border-0 shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">
                                <div className="flex justify-between items-center mt-8">



                                    <h3 className="text-3xl font-semibold ">Add New Resident</h3>

                                    <button className="bg-transparent border-0 text-[20px] font-bold text-black "
                                        onClick={() => toggleAddModal()}
                                    >
                                        x
                                    </button>
                                </div>
                                <div className="w-full my-6">

                                    <div className="relative">
                                        <label className="block uppercase tracking-wide  text-[14px] font-bold mb-2" htmlFor="grid-state">
                                            Status
                                        </label>
                                        <select className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8   focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                            <option className="rounded-xl py-3 my-5">Active</option>
                                            <option>DeActivated</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">

                                        <div className="w-1/2 ">
                                            <label className="block uppercase tracking-wide   text-[14px] font-bold mb-2" htmlFor="grid-first-name">
                                                First Name
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />

                                        </div>


                                        <div className="w-1/2  ">
                                            <label className="block uppercase tracking-wide  text-[14px] font-bold mb-2" htmlFor="grid-first-name">
                                                First Name
                                            </label>
                                            <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />

                                        </div>

                                    </div>
                                </div>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-xl border-[#DDDDDD] w-1/2 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => toggleAddModal()}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-xl bg-slate-900 font-bold uppercase text-sm px-6 py-3  shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => toggleAddModal()}
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

export default AddModal;