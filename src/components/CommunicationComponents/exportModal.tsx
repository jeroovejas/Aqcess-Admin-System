"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { toggleExportModal } from "@/store/Slices/SurveySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { saveAs } from 'file-saver';
import { exportSurveyResponse } from "@/lib/api/survey";
import { useLocale, useTranslations } from 'next-intl';


const ExportModal: React.FC<any> = () => { 
    const t = useTranslations();
    const [selectedOption, setSelectedOption] = useState<string>("");
    const exportModal = useAppSelector((state) => state.survey.exportModal);
    const surveyId = useAppSelector((state) => state.survey.surveyId);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);


    const handleExport = async () => {
        setLoading(true)
        try {
            let params = { token: token, id: surveyId }
            const response = await exportSurveyResponse(params);
            if (response.success) {
                const csvData = convertToCSV(response.data);
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const fileName = `${response.data.title}.csv`;
                saveAs(blob, fileName);
                dispatch(toggleExportModal())
                showSuccessToast(response.message);
            } else {
                showErrorToast('Failed to download the file. Please try again.');
            }
        } catch (err: any) {
            console.error('Unexpected error during deleting resident:', err.message);
        } finally {
            setLoading(false)
        }
    };

    // const convertToCSV = (data: any): string => {
    //     const csvRows: string[] = [];
    //     // Function to escape and wrap values
    //     const escapeValue = (value: string): string => {
    //         if (typeof value === 'string') {
    //             // Escape double quotes by doubling them and wrap the value in double quotes
    //             return `"${value.replace(/"/g, '""')}"`;
    //         }
    //         return value;
    //     };
    //     const questionTitles = data.questionTitles;
    //     const headers = [
    //         'Sr #', 'Title', 'Start Date', 'Deadline', 'Resident Name',
    //         'Email', 'Comment'
    //     ];
    //     questionTitles.forEach((question: any) => {
    //         headers.push(question); // Adding each question title to headers
    //     });
    //     csvRows.push(headers.join(','));
    //     data.feedbackArray.forEach((feedback: any, index: any) => {
    //         const row = [
    //             escapeValue(index + 1),
    //             escapeValue(data.title),
    //             escapeValue(data.surveyOpened),
    //             escapeValue(data.deadline),
    //             escapeValue(feedback.userName),
    //             escapeValue(feedback.email),
    //             escapeValue(feedback.comment),
    //         ].map(value => ((value !== undefined && value !== null) ? `${value}` : ``)).join(',');
    //         csvRows.push(row);
    //     });
    //     return csvRows.join('\n');
    // }

    const convertToCSV = (data: any): string => {
        const csvRows: string[] = [];

        // Function to escape and wrap values
        const escapeValue = (value: string): string => {
            if (typeof value === 'string') {
                return `"${value.replace(/"/g, '""')}"`; // Escape double quotes by doubling them and wrap the value in double quotes
            }
            return value;
        };

        const questionTitles = data.questionTitles;
        const headers = [
            'Sr #', 'Title', 'Start Date', 'Deadline', 'Resident Name',
            'Email', 'Comment'
        ];

        // Add each question title to the headers
        questionTitles.forEach((question: string) => {
            headers.push(question); // Add each question title as a new header
        });

        csvRows.push(headers.join(',')); // Add the headers to the CSV rows

        // Loop through each feedback entry
        data.feedbackArray.forEach((feedback: any, index: any) => {
            // Default row with the user details
            const row: string[] = [
                escapeValue(index + 1),
                escapeValue(data.title), 
                escapeValue(data.surveyOpened), 
                escapeValue(data.deadline), 
                escapeValue(feedback.userName), 
                escapeValue(feedback.email), 
                escapeValue(feedback.comment) 
            ];

           
            questionTitles.forEach((question: string) => {
                const response = feedback.responses.find((resp: any) => resp.questionTitle === question);
                const selectedOption = response ? response.selectedOptionTitle : ''; 
                row.push(escapeValue(selectedOption)); 
            });

            csvRows.push(row.join(','));
        });

        return csvRows.join('\n'); // Return the CSV as a string
    };


    return (
        <>
            {exportModal ? (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-[calc(100vw-20px)] md:w-auto my-6">
                        <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none px-8 py-8">
                            <FaRegArrowAltCircleUp size={30} className="mb-6 " />
                            <h3 className="text-3xl font-semibold mt-8">{t('SURVEY.exportModal.title')}</h3>
                            <p className="font-[500] mt-2">{t('SURVEY.exportModal.lable')}</p>
                            <div className="w-full my-6">
                                <div className="relative">
                                    <select
                                        value={selectedOption}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8 focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-state"
                                    >
                                        {/* <option value="PDF">PDF</option> */}
                                        <option value="CSV">Excel</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <button
                                    className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleExportModal())}
                                >
                                    {t('SURVEY.exportModal.button1')}
                                </button>
                                <button
                                    className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold text-sm px-6 py-3  outline-none  mr-1 mb-1"
                                    type="button"
                                    disabled={loading}
                                    onClick={handleExport}
                                >
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SURVEY.exportModal.button2')}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default ExportModal;
