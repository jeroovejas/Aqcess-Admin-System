"use client"
import { useRef,useEffect,useState } from "react";
import { IoDuplicate } from "react-icons/io5";
import { toggleDuplicateModal, toggleIsUpdated } from "@/store/Slices/SurveySlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { duplicateSurvey } from "@/lib/api/survey";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const DuplicateModal: React.FC<any> = () => { 
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(false);
    const duplicateModal = useAppSelector((state) => state.survey.duplicateModal)
    const surveyData = useAppSelector((state) => state.survey.surveyData)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch()

    const handleDuplication = async () => {
        setLoading(true)
        try {
            const body = {
                survey_id: surveyData.id,
                token: token
            };
            const response = await duplicateSurvey(body);
            if (response.success) {
                dispatch(toggleIsUpdated());
                dispatch(toggleDuplicateModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during duplicating survey :', err.message);
        }finally{
            setLoading(false)
        }
    };


    return (
        <>
            {duplicateModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 max-w-3xl ">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                <IoDuplicate size={30} className="mb-6 " />
                                <h3 className="text-3xl font-semibold mt-8">{t('SURVEY.duplicateModal.title')}</h3>
                                <p className="font-[500] my-4">{t('SURVEY.duplicateModal.lable')} </p>




                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleDuplicateModal())}
                                    >
                                        {t('SURVEY.duplicateModal.button1')}
                                    </button>
                                    <button
                                        className={`text-white w-1/2 flex items-center justify-center cursor-pointer  rounded-lg bg-primary-blue  font-bold  text-sm px-6 py-3   outline-none  mr-1 mb-1`}
                                        type="button"
                                        disabled={loading}
                                        onClick={handleDuplication}
                                    >
                                         {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SURVEY.duplicateModal.button2')}`}
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

export default DuplicateModal;