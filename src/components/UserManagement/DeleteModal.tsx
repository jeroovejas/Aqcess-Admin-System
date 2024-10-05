"use client"
import React, { useRef, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleIsUpdated, toggleDeleteModal } from "@/store/Slices/UserManagementSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { deleteSocietyAdmin } from "@/lib/api/userManagement";
const DeleteModal: React.FC<any> = () => {
    const deleteModal = useAppSelector((state) => state.userManagement.deleteModal)
    const admin = useAppSelector((state) => state.userManagement.adminData)
    const token = useAppSelector((state) => state.auth.token)
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()

    const handleDelete = async () => {
        try {
            let params = { id: admin.id, token: token }
            const response = await deleteSocietyAdmin(params);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleDeleteModal())
                showSuccessToast(response.data.message);
                console.log(response.data.data)
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during deleting society admin:', err.message);
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
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div ref={modalRef} className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <MdErrorOutline size={45} className="mb-6 text-danger bg-danger-light rounded-full p-2" />

                                <h3 className="text-3xl font-semibold mt-8">Delete Society Admin?</h3>
                                <p className="font-[500] mt-2 mb-6">Their account and all related information will be permanently deleted. If you want to temporarily restrict the society admin access, deactivate their account instead.</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDeleteModal())}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-lg bg-danger font-bold  text-sm px-6 py-3  outline-none  mr-1 mb-1"
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

export default DeleteModal;