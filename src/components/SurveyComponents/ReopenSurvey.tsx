"use client"
import React, { useState, useRef, useEffect } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { toggleReOpenModal, toggleIsUpdated } from "@/store/Slices/SurveySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DatePickerOne from "../DataPicker/DatePickerOne/DatePickerOne";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { reOpenSurvey } from "@/lib/api/survey";
const ReOpenSurvey: React.FC<any> = () => {
    const [deadline, setDeadline] = useState<string>("");
    const reOpenModal = useAppSelector((state) => state.survey.reOpenModal)
    const surveyData = useAppSelector((state) => state.survey.surveyData)
    const token = useAppSelector((state) => state.auth.token);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()

    const handleDateChange = (date: string) => {
        setDeadline(date)
    };

    const handleReopenSurvey = async () => {
        try {
            const body = {
                deadline: deadline,
                survey_id: surveyData.id,
                token: token
            };
            const response = await reOpenSurvey(body);
            if (response.success) {
                dispatch(toggleIsUpdated());
                dispatch(toggleReOpenModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during duplicating survey :', err.message);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(toggleReOpenModal());
        }
    };

    useEffect(() => {
        if (reOpenModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [reOpenModal]);

    return (
        <>
            {reOpenModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div ref={modalRef} className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                <RxQuestionMarkCircled size={30} className="mb-6 " />
                                <h3 className="text-3xl font-semibold mt-8">Reopen Survey</h3>
                                <p className="font-[500] mt-2">Your resident will be able to leave new responses. Please select new deadline.</p>
                                <div className="w-full my-6">
                                    <DatePickerOne onChange={handleDateChange} defaultDate={deadline} />
                                </div>



                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleReOpenModal())}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="text-white w-1/2 rounded-lg bg-primary-blue font-bold text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={handleReopenSurvey}
                                    >
                                        Reopen Survey
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

export default ReOpenSurvey;