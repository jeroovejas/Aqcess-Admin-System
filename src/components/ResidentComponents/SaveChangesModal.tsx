"use client"
import React, { useRef, useEffect } from "react";
import { CiWarning } from "react-icons/ci";
import { toggleSaveModal, toggleIsUpdated } from "@/store/Slices/ResidentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editResident } from "@/lib/api/resident";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
const SaveChangesModal: React.FC<any> = () => {
    const saveModal = useAppSelector((state) => state.resident.saveModal)
    const resident = useAppSelector((state) => state.resident.residentData);
    const token = useAppSelector((state) => state.auth.token);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()

    const handleEdit = async () => {
        try {
            const body = {
                ...resident,
                token: token // Add the token here
            };
            console.log(body)
            const response = await editResident(body);
            if (response.success) {
                dispatch(toggleSaveModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                dispatch(toggleSaveModal());
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during edit resident:', err.message);
        }
    };



    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(toggleSaveModal());
        }
    };

    useEffect(() => {
        if (saveModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [saveModal]);
    return (
        <>
            {saveModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[400px] my-6 max-w-3xl ">
                            <div ref={modalRef} className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <CiWarning size={45} className="mb-6 text-[#DC6803] bg-[#FEF0C7] rounded-full p-2" />

                                <h3 className="text-3xl font-semibold mt-8">Unsaved Changes</h3>
                                <p className="font-[500] mt-2 mb-6">Do you want to save or discard changes?</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleSaveModal())}
                                    >
                                        Discard
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-lg bg-primary-blue font-bold  text-sm px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleEdit}
                                    >
                                        Save Changes
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

export default SaveChangesModal;