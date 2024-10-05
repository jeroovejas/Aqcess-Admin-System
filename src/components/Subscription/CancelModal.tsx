"use client"
import React, { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleDeleteModal } from "@/store/Slices/ResidentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
const DeleteModal: React.FC<any> = () => {
    const deleteModal = useAppSelector((state) => state.resident.deleteModal)
    const dispatch = useAppDispatch()

    return (
        <>
            {deleteModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <MdErrorOutline size={45} className="mb-6 text-[#D92D20] bg-[#FEE4E2] rounded-full p-2" />

                                <h3 className="text-3xl font-semibold mt-8">Delete Resident?</h3>
                                <p className="font-[500] mt-2 mb-6">Their account and all related information will be permanently deleted. If you want to temporarily restrict the residents access, deactivate their account instead.</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-xl border-[#DDDDDD] w-1/2 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-xl bg-[#D92D20] font-bold uppercase text-sm px-6 py-3  shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        Delete
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