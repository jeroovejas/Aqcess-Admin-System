"use cient"
import { useRef, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import { FaUserLargeSlash } from "react-icons/fa6";
import { toggleStatusModal, toggleIsUpdated } from "@/store/Slices/ResidentSlice"
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeResidentStatus } from "@/lib/api/resident";
const StatusModal: React.FC<any> = () => {
    const statusModal = useAppSelector((state) => state.resident.statusModal)
    const resident = useAppSelector((state) => state.resident.residentData)
    const token = useAppSelector((state) => state.auth.token);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()

    const handleChangeStatus = async () => {
        try {
            const body = {
                resident_id: resident.id,
                status: resident.status == "active" ? "deactivated" : "active",
                token: token
            };
            const response = await changeResidentStatus(body);
            if (response.success) {
                dispatch(toggleStatusModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during Forgot Password:', err.message);
        }
    };



    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(toggleStatusModal());
        }
    };

    useEffect(() => {
        if (statusModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [statusModal]);

    return (
        <>
            {statusModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div ref={modalRef} className="relative w-auto my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                {resident.status == 'active' ? <FaUserLargeSlash size={30} className="mb-6 text-danger" /> : <FaUserCheck size={30} className="mb-6 " />}
                                <h3 className="text-3xl font-semibold mt-8">Do you want to {resident.status == 'active' ? 'Deactivate' : 'Activate'}  Resident</h3>
                                <p className="font-[500] my-4">Select Carefully as this will affect residents activity. </p>




                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold px-6 py-3 text-sm outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleStatusModal())}
                                    >
                                        No
                                    </button>
                                    <button
                                        className={`text-white w-1/2 rounded-lg ${resident.status == 'active' ? 'bg-danger' : 'bg-primary-blue'}  font-bold  text-sm px-6 py-3    outline-none  mr-1 mb-1`}
                                        type="button"
                                        onClick={handleChangeStatus}
                                    >
                                        Yes
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

export default StatusModal;