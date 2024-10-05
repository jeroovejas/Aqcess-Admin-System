"use client"
import React, { useState, useRef, useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { toggleBookingModal, toggleIsUpdated } from "@/store/Slices/AreaSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { cancelAreaBooking } from "@/lib/api/commonArea";
const DeleteBooking: React.FC<any> = () => {
    const bookingModal = useAppSelector((state) => state.area.bookingModal)
    const bookingId = useAppSelector((state) => state.area.bookingId)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()
    const modalRef = useRef<HTMLDivElement>(null);

    const handleBookingCancel = async () => {
        try {
            const body = {
                booking_id: bookingId,
                token: token
            };
            const response = await cancelAreaBooking(body);
            if (response.success) {
                dispatch(toggleIsUpdated());
                dispatch(toggleBookingModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during cancel booking :', err.message);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(toggleBookingModal());
        }
    };

    useEffect(() => {
        if (bookingModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [bookingModal]);

    return (
        <>
            {bookingModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div ref={modalRef} className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">
                                <MdErrorOutline size={45} className="mb-6 text-danger bg-[#FEE4E2] rounded-full p-2" />
                                <h3 className="text-3xl font-semibold mt-8">Cancel Booking</h3>
                                <p className="font-[500] mt-2 mb-6"> Are you sure you want to cancel this resident booking ?</p>
                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold px-6 py-3 text-sm outline-none mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleBookingModal())}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-lg bg-danger font-bold  text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleBookingCancel}
                                    >
                                        Cancel Booking
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

export default DeleteBooking;