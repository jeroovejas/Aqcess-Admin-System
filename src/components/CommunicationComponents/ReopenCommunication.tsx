"use client"
import React, { useState, useRef, useEffect } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { toggleReOpenModal, toggleIsUpdated } from "@/store/Slices/SurveySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DatePickerOne from "../DataPicker/DatePickerOne/DatePickerOne";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { reOpenSurvey } from "@/lib/api/survey";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { parseDefaultDate } from "@/lib/common.modules";
import { useLocale, useTranslations } from 'next-intl';


const ReOpenCommunication: React.FC<any> = () => {
    const t = useTranslations();
    const [deadline, setDeadline] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const reOpenModal = useAppSelector((state) => state.survey.reOpenModal)
    const surveyData = useAppSelector((state) => state.survey.surveyData)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()

    const handleDateChange = (date: string) => {
        setDeadline(date)
    };

    useEffect(() => {
        if (surveyData.deadline) {
            setDeadline(parseDefaultDate(surveyData.deadline));
        }
    }, [surveyData]);

    const handleReopenSurvey = async () => {
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    };

    const handleDraftReopen = () => {
        if (surveyData.status === 'draft') {
            const userConfirmed = confirm("Are you sure you want to reopen as this survey will not be available for editing in future ?");
            if (userConfirmed) {
                handleReopenSurvey();
            } else {
                dispatch(toggleReOpenModal())
            }
        } else {
            handleReopenSurvey()
        }
    }

    console.log("surveyData", surveyData)
    return (
        <>
            {reOpenModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                <RxQuestionMarkCircled size={30} className="mb-6 " />
                                <h3 className="text-3xl font-semibold mt-8">{surveyData.status === "draft" ? `${t('SURVEY.open')}` : `${t('SURVEY.reOpen')}`} {t('SURVEY.surveyOpenModal.title1')}</h3>
                                <p className="font-[500] mt-2">{t('SURVEY.surveyOpenModal.lable')} {surveyData.status === "draft" ? "" : "new"} {t('SURVEY.surveyOpenModal.lable1')}{surveyData.status === "draft" ? "" : "new"} {t('SURVEY.surveyOpenModal.lable2')}</p>
                                <div className="w-full my-6">
                                    <DatePickerOne onChange={handleDateChange} defaultDate={deadline} />
                                </div>

                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleReOpenModal())}
                                    >
                                        {t('SURVEY.surveyOpenModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleDraftReopen}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SURVEY.surveyOpenModal.button2')}`}

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

export default ReOpenCommunication;