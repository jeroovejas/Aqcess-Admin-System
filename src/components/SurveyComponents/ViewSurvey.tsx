"use client"
import { useState, useEffect } from "react";
import { toggleViewModal, toggleEditModal, toggleExportModal, setSurveyId } from "@/store/Slices/SurveySlice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import CardDataStats from "../CardDataStats";
import { getSurvey } from "@/lib/api/survey";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { TfiExport } from "react-icons/tfi";
import ExportModal from "./exportModal";
import { useLocale, useTranslations } from 'next-intl';


const ViewSurvey: React.FC<any> = () => { 
    const t = useTranslations();
    const maxSize = 4;
    const [survey, setSurvey] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const viewModal = useAppSelector((state) => state.survey.viewModal);
    const exportModal = useAppSelector((state) => state.survey.exportModal);
    const surveyData = useAppSelector((state) => state.survey.surveyData);
    const token = useAppSelector((state) => state.auth.token);
    const isUpdated = useAppSelector((state) => state.survey.isUpdated);
    const dispatch = useAppDispatch();

    const handleOpenExportModal = (id: any) => {
        dispatch(setSurveyId(id))
        dispatch(toggleExportModal())
    }

    useEffect(() => {
        setLoading(true);
        fetchSurveyDetails().finally(() => {
            setLoading(false);
        });
    }, [isUpdated, viewModal, searchTerm])

    const fetchSurveyDetails = async () => {
        try {
            let params = { id: surveyData.id, token: token, searchTerm: searchTerm }
            const response = await getSurvey(params);


            // Check the success property to determine if the request was successful
            if (response.success) {
                setSurvey((prevState: any) => ({
                    ...prevState,
                    ...response.data.data // Merge with previous state
                }));
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during area Fetch:', err.message);
        }
    }

    // console.log("survey",survey)
    // console.log("surveyData",surveyData)
    return (
        <>
            {viewModal ? (
                <DefaultLayout>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row items-start md:items-center justify-between">
                        <div>
                            <p className="text-black font-bold">Surveys / <span className="text-slate-400">Survey Results</span></p>
                            <h2 className="text-4xl font-bold text-black dark:text-white">
                                {surveyData.title}
                            </h2>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2"
                                onClick={() => dispatch(toggleViewModal())}>
                                {t('SURVEY.button1Modal.button1')}
                            </button>
                        </div>
                    </div>
                    <div className="mx-auto">
                        <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                            <div className="mt-1 text-lg font-bold px-2">
                                <button onClick={() => {
                                    dispatch(toggleViewModal())
                                    dispatch(toggleEditModal())
                                }
                                }>{t('SURVEY.button1Modal.title4')}</button>
                            </div>
                            <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center mr-4">
                            {t('SURVEY.button1Modal.button4')}
                            </button>

                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">
                        <CardDataStats title={t('SURVEY.viewModal.card1')} total={surveyData.surveyResponses} rate="">
                        </CardDataStats>
                        <CardDataStats title={t('SURVEY.viewModal.card2')} total={`${surveyData.responseRate}%`} rate="">
                        </CardDataStats>
                        <CardDataStats title={t('SURVEY.viewModal.card3')} total={surveyData.deadline.split(' ')[0]} rate="">
                        </CardDataStats>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <div>
                            <div className="relative">
                                <div className="absolute top-4 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 mb-2 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" value={searchTerm}
                                    onChange={(event) => { setSearchTerm(event.target.value) }} className="block w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg  dark:placeholder-gray-400 dark:text-white" placeholder="Search for survey" required />
                            </div>
                        </div>
                        <div className="w-full md:mr-3 md:w-auto md:mt-0">
                            <button
                                type="button"
                                onClick={() => handleOpenExportModal(surveyData.id)}
                                className="w-full md:w-auto text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-6 py-3 ms-0 md:ms-1 mb-2  flex items-center justify-center md:justify-start"
                            >
                                <TfiExport className="mr-2 text-base" />
                                {t('SURVEY.exportButton')}
                            </button>
                        </div>
                    </div>
                    {/* {
                        loading ? <Loader /> :
                            {
                                surveyData.questions.length === 0 ? (
                                    <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white mt-[22px] py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                                        <p className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                                            No Question Found
                                        </p>
                                    </div>
                                ) : (

                                    surveyData.questions.map((question: any, key: number) => {
                                        return (
                                            <div key={key} className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white mt-[22px] py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                                                <div className="flex justify-between border-b border-[#DDDDDD]">
                                                    <h4 className="pb-4 text-xl font-semibold text-black">
                                                        {question.questionTitle}
                                                    </h4>
                                                    <div>
                                                        <p className="text-[#344054] bg-[#F2F4F7] rounded-[16px] px-[16px] py-[4px] font-[600]">{surveyData.surveyResponses} responses</p>
                                                    </div>
                                                </div>
                                                {question.options.map((option: any, index: number) => {
                                                    return (
                                                        <div key={index} className="flex items-center gap-3 mt-3">
                                                            <p className="text-black text-[20px] font-[600]">
                                                                {option.percentage}%
                                                            </p>
                                                            <div className="w-full">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-black text-[14px] font-[600] ">{option.title} ({option.totalResponse} responses)</p>

                                                                    <div className="flex flex-wrap items-center">
                                                                        {Array.from({ length: option.totalResponse > maxSize ? maxSize : option.totalResponse }).map((_, imgIndex) => (
                                                                            <img
                                                                                key={imgIndex}
                                                                                src={`/images/surveys/avatar1.png`}
                                                                                alt={`Image ${imgIndex + 1}`}
                                                                                className={`w-[40px] h-[40px] rounded-full ${option.totalResponse > 1 ? "mx-[-5px]" : ""}`}
                                                                            />
                                                                        ))}
                                                                        {option.totalResponse - maxSize > 0 && (
                                                                            <div className="w-[40px] h-[40px] mx-[-5px] rounded-full bg-slate-300 flex items-center justify-center text-blsck font-bold">
                                                                                +{option.totalResponse - maxSize}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="bg-gray rounded-full h-2.5 mb-4 dark:bg-gray-700 mt-2">
                                                                    <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: `${option.percentage}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })
                                )
                            }
                    } */}
                    {
                        loading ? (
                            <Loader />
                        ) : (
                            survey.questions.length === 0 ? (
                                <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white mt-[22px] py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                                    <p className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                                        No Question Found
                                    </p>
                                </div>
                            ) : (
                                survey.questions.map((question: any, key: number) => {
                                    return (
                                        <div key={key} className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white mt-[22px] py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                                            <div className="flex justify-between border-b border-[#DDDDDD]">
                                                <h4 className="pb-4 text-xl font-semibold text-black">
                                                    {question.questionTitle}
                                                </h4>
                                                {/* <div>
                                                    <p className="text-[#344054] bg-[#F2F4F7] rounded-[16px] px-[16px] py-[4px] font-[600]">
                                                        {surveyData.surveyResponses} responses
                                                    </p>
                                                </div> */}
                                            </div>
                                            {question.options.map((option: any, index: number) => {
                                                return (
                                                    <div key={index} className="flex items-center gap-3 mt-3">
                                                        <p className="text-black text-[20px] font-[600]">
                                                            {option.percentage}%
                                                        </p>
                                                        <div className="w-full">
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-black text-[14px] font-[600] ">
                                                                    {option.title} ({option.totalResponse} responses)
                                                                </p>
                                                                <div className="flex flex-wrap items-center">
                                                                    {Array.from({ length: option.totalResponse > maxSize ? maxSize : option.totalResponse }).map((_, imgIndex) => (
                                                                        <img
                                                                            key={imgIndex}
                                                                            src={`/images/surveys/avatar1.png`}
                                                                            alt={`Image ${imgIndex + 1}`}
                                                                            className={`w-[40px] h-[40px] rounded-full ${option.totalResponse > 1 ? "mx-[-5px]" : ""}`}
                                                                        />
                                                                    ))}
                                                                    {option.totalResponse - maxSize > 0 && (
                                                                        <div className="w-[40px] h-[40px] mx-[-5px] rounded-full bg-slate-300 flex items-center justify-center text-blsck font-bold">
                                                                            +{option.totalResponse - maxSize}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="bg-gray rounded-full h-2.5 mb-4 dark:bg-gray-700 mt-2">
                                                                <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: `${option.percentage}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })
                            )
                        )
                    }
                    < div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white mt-[22px] py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
                        <div className="flex justify-between">
                            <h4 className=" pb-4 text-xl  font-semibold text-black dark:text-white">
                            {t('SURVEY.viewModal.title')}
                            </h4>
                            <div className="">
                                <p className="text-[#344054] bg-[#F2F4F7] rounded-[16px] px-[16px] py-[4px] font-[600]"> {surveyData.surveyResponses} responses</p>
                            </div>
                        </div>
                        <div className="  py-3 border-t border-[#DDDDDD]">
                            {surveyData.feedbackArray.map((feedback: any, key: any) => {
                                return <div key={key} className="flex  gap-3 my-4">
                                    {feedback.profileImage !== null ?
                                        <div className="flex-shrink-0">
                                            <img src={feedback.profileImage} alt="Profile Image" width={35} height={35} />
                                        </div> : <div className="flex-shrink-0">
                                            <img src="/images/user/dummy.png" alt="Profile Image" width={35} height={35} />
                                        </div>}

                                    <div className="w-full">
                                        <p className="text-black text-[14px] font-[700] mb-2">{feedback.userName}</p>
                                        <span className="text-black text-[14px] bg-[#F2F4F7] font-[400] rounded-[8px]  p-3 ">{feedback.comment}</span>
                                    </div>
                                </div>
                            })}

                        </div>
                    </div>
                    {(exportModal) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
                    </div>}
                    <ExportModal />
                </DefaultLayout >
            ) : null}:
        </>
    );
};

export default ViewSurvey;
