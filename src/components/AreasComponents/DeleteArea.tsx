"use client"
import React, { useState, useRef, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleDeleteModal, toggleIsUpdated } from "@/store/Slices/AreaSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { deleteCommonArea } from "@/lib/api/commonArea";
const DeleteArea: React.FC<any> = () => {
    const deleteModal = useAppSelector((state) => state.area.deleteModal)
    const areaData = useAppSelector((state) => state.area.areaData)
    const token = useAppSelector((state) => state.auth.token)
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()

    const handleDelete = async () => {
        try {
            let params = { id: areaData.id, token: token }
            const response = await deleteCommonArea(params);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleDeleteModal())
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during deleting common area', err.message);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(toggleDeleteModal());
        }
    };

    useEffect(() => {
        if (deleteModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [deleteModal]);

    return (
        <>
            {deleteModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div ref={modalRef} className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <MdErrorOutline size={45} className="mb-6 text-danger bg-danger-light rounded-full p-2" />

                                <h3 className="text-3xl font-semibold mt-8">Delete common area</h3>
                                <p className="font-[500] mt-2 mb-6"><span className="font-bold">{areaData.title}</span> will be removed from common areas list and all active bookings will be canceled.</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-medium px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-lg bg-danger font-medium  text-sm px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleDelete}
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

export default DeleteArea;