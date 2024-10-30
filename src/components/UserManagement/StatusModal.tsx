"use cient"
import { useRef, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import { FaUserLargeSlash } from "react-icons/fa6";
import { toggleStatusModal, toggleIsUpdated } from "@/store/Slices/UserManagementSlice"
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeSocietyAdminStatus } from "@/lib/api/userManagement";
const StatusModal: React.FC<any> = () => {
    const statusModal = useAppSelector((state) => state.userManagement.statusModal)
    const admin = useAppSelector((state) => state.userManagement.adminData)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()

    const handleChangeStatus = async () => {
        try {
            const body = {
                admin_id: admin.id,
                status: admin.status == "active" ? "deactivated" : "active",
                token: token
            };
            const response = await changeSocietyAdminStatus(body);
            if (response.success) {
                dispatch(toggleStatusModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during admin status change', err.message);
        }
    };


    return (
        <>
            {statusModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                {admin.status == 'active' ? <FaUserLargeSlash size={30} className="mb-6 text-danger" /> : <FaUserCheck size={30} className="mb-6 " />}
                                <h3 className="text-3xl font-semibold mt-8">Do you want to {admin.status == 'active' ? 'Deactivate' : 'Activate'}  Society Admin</h3>
                                <p className="font-[500] my-4">Select Carefully as this will affect admins activity. </p>




                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold px-6 py-3 text-sm outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleStatusModal())}
                                    >
                                        No
                                    </button>
                                    <button
                                        className={`text-white w-1/2 rounded-lg ${admin.status == 'active' ? 'bg-danger' : 'bg-primary-blue'}  font-bold  text-sm px-6 py-3    outline-none  mr-1 mb-1`}
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