"use client"
import { useRef, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import { FaUserLargeSlash } from "react-icons/fa6";
import { toggleStatusModal, toggleIsUpdated } from "@/store/Slices/PaymentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChangeProductStatus } from "@/lib/api/product";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
const ToggleStatusModal: React.FC<any> = () => {
    const statusModal = useAppSelector((state) => state.payment.statusModal)
    const productData = useAppSelector((state) => state.payment.productData)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()

    const handleStatusChange = async () => {
        try {
            const body = {
                product_id: productData.id,
                status: productData.status == 'active' ? 'inactive' : 'active',
                token: token
            };
            const response = await ChangeProductStatus(body);
            if (response.success) {
                dispatch(toggleIsUpdated());
                dispatch(toggleStatusModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during duplicating product :', err.message);
        }
    };

    return (
        <>
            {statusModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                {productData.status == 'active' ? <FaUserLargeSlash size={30} className="mb-6 text-danger" /> : <FaUserCheck size={30} className="mb-6 " />}
                                <h3 className="text-3xl font-semibold mt-8">Do you want to {productData.status == 'active' ? 'Deactivate' : 'Activate'}  Product</h3>
                                <p className="font-[500] my-4">Please select the option carefully as this will affect the availability of products to residents. </p>




                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleStatusModal())}
                                    >
                                        No
                                    </button>
                                    <button
                                        className={`text-white w-1/2 rounded-lg ${productData.status == 'active' ? 'bg-danger' : 'bg-primary-blue'}  font-bold  text-sm px-6 py-3   outline-none  mr-1 mb-1`}
                                        type="button"
                                        onClick={handleStatusChange}
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

export default ToggleStatusModal;