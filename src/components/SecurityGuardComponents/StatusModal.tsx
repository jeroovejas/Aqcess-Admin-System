"use cient"
import { useRef, useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import { FaUserLargeSlash } from "react-icons/fa6";
import { toggleStatusModal, toggleIsUpdated } from "@/store/Slices/SecurityGuardSlice"
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeSecurityGuardStatus } from "@/lib/api/securityGuard";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const StatusModal: React.FC<any> = () => {
    const statusModal = useAppSelector((state) => state.securityGuard.statusModal)
    const securityGuard = useAppSelector((state) => state.securityGuard.securityGuardData)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);

    const handleChangeStatus = async () => {
        setLoading(true)
        try {
            const body = {
                security_guard_id: securityGuard.id,
                status: securityGuard.status == "active" ? "deactivated" : "active",
                token: token
            };
            const response = await changeSecurityGuardStatus(body);
            if (response.success) {
                dispatch(toggleStatusModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during security guard status:', err.message);
        } finally {
            setLoading(false)
        }
    };


    return (
        <>
            {statusModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                {securityGuard.status == 'active' ? <FaUserLargeSlash size={30} className="mb-6 text-danger" /> : <FaUserCheck size={30} className="mb-6 " />}
                                <h3 className="text-xl font-semibold mt-8">{securityGuard.status == 'active' ? 'Deactivate' : 'Activate'}  security guard</h3>
                                <p className="font-[500] my-4">Select carefully as this will affect security guards activity. </p>




                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold px-6 py-3 text-base outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleStatusModal())}
                                    >
                                        No
                                    </button>
                                    <button
                                        className={`text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg ${securityGuard.status == 'active' ? 'bg-danger' : 'bg-primary-blue'}  font-bold  text-base px-6 py-3    outline-none  mr-1 mb-1`}
                                        type="button"
                                        onClick={handleChangeStatus}
                                        disabled={loading}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : "Yes"}

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