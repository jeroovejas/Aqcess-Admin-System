"use client"
import React, { useRef, useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { toggleSaveModal, toggleIsUpdated } from "@/store/Slices/SecurityGuardSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { editSecurityGuard } from "@/lib/api/securityGuard";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const SaveChangesModal: React.FC<any> = () => {
    const saveModal = useAppSelector((state) => state.securityGuard.saveModal)
    const securityGuard = useAppSelector((state) => state.securityGuard.securityGuardData);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);

    const handleEdit = async () => {
        setLoading(true)
        try {
            const body = {
                ...securityGuard,
                token: token // Add the token here
            };
            const response = await editSecurityGuard(body);
            if (response.success) {
                dispatch(toggleSaveModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                dispatch(toggleSaveModal());
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during edit security guard:', err.message);
        } finally {
            setLoading(false)
        }
    };



    return (
        <>
            {saveModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[400px] my-6 max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <CiWarning size={45} className="mb-6 text-[#DC6803] bg-[#FEF0C7] rounded-full p-2" />

                                <h3 className="text-xl font-semibold mt-8">Unsaved Changes</h3>
                                <p className="font-[500] mt-2 mb-6">Do you want to save or discard changes?</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-base outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleSaveModal())}
                                    >
                                        Discard
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold  text-base px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleEdit}
                                        disabled={loading}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : " Save Changes"}

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