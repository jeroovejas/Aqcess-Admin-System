"use client"
import { useRef, useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { toggleCloseModal, toggleIsUpdated } from "@/store/Slices/SurveySlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { closeSurveyApi } from "@/lib/api/survey";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const CloseSurvey: React.FC<any> = () => { 
    const t = useTranslations();
    const closeSurvey = useAppSelector((state) => state.survey.closeSurvey)
    const [loading, setLoading] = useState<boolean>(false);
    const surveyData = useAppSelector((state) => state.survey.surveyData)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()

    const handleCloseSurvey = async () => {
        setLoading(true)
        try {
            const body = {
                survey_id: surveyData.id,
                token: token
            };
            const response = await closeSurveyApi(body);
            if (response.success) {
                dispatch(toggleIsUpdated());
                dispatch(toggleCloseModal());
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


    return (
        <>
            {closeSurvey ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <IoMdCloseCircle size={45} className="mb-6 text-danger bg-danger-light rounded-full p-2" />

                                <h3 className="text-3xl font-semibold mt-8">{t('SURVEY.surveyCloseModal.title')}</h3>
                                <p className="font-[500] mt-2 mb-6">{t('SURVEY.surveyCloseModal.lable')}</p>


                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleCloseModal())}
                                    >
                                        {t('SURVEY.surveyCloseModal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer  rounded-lg bg-danger font-bold  text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleCloseSurvey}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SURVEY.surveyCloseModal.button2')}`}
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

export default CloseSurvey;