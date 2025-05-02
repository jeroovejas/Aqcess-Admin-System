import React, { useState, ChangeEvent, useEffect } from "react";
import { toggleEditModal, toggleViewModal, toggleIsUpdated } from "@/store/Slices/SurveySlice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DatePickerOne from "../DataPicker/DatePickerOne/DatePickerOne";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { editSurvey } from "@/lib/api/survey";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { parseDefaultDate } from "@/lib/common.modules";
import { useLocale, useTranslations } from 'next-intl';
import Select from 'react-select';
import { getAllResidentsArray } from "@/lib/api/resident";


// Define types for survey form state
interface SurveyFormState {
    title: string;
    description: string;
    deadline: string;
    questions: {
        question_title: string;
        question_choice: 'Multiple Choice';
        options: string[];
    }[];
    residents: any;
    file: File | null;
    fileType: string | null;
    fileName: string | null;
    imagePreview?: string | null;
}

const EditCommunication: React.FC = () => {
    const t = useTranslations();
    const editModal = useAppSelector((state) => state.survey.editModal);
    const [loading, setLoading] = useState(false);
    const surveyData = useAppSelector((state) => state.survey.surveyData);
    const token = useAppSelector((state) => state.auth.token);
    const user = useAppSelector((state) => state.auth.userData);
    const dispatch = useAppDispatch();

    // Initialize state with default values
    const [formState, setFormState] = useState<SurveyFormState>({
        title: '',
        description: '',
        deadline: '',
        questions: [{
            question_title: '',
            question_choice: 'Multiple Choice',
            options: ['']
        }],
        residents: [],
        file: null,
        fileType: null,
        fileName: null,
        imagePreview: null,
    }
    );
    const [residents, setResidents] = useState<any>([]);

    const fetchResidents = async () => {
        try {
            let params = { token: token, id: user.id }
            const response = await getAllResidentsArray(params);
            if (response.success) {
                const data = response.data.data
                console.log("residents Array", data)
                const transformedData = data.map((item: any) => ({
                    label: item.name,
                    value: item.id
                }));
                setResidents(transformedData)
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during residents Fetch:', err.message);
        }
    }

    useEffect(() => {
        fetchResidents()
    }, []);


    // const selectedResidents = residents.filter((resident: any) =>
    //     formState.residents.includes(resident.value)
    // );

    // Handle input changes for survey title and description
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleResidentChange = (selectedOptions: any) => {
        const selectedResidents = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setFormState((prevState: any) => ({
            ...prevState,
            residents: selectedResidents,
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;

        if (file) {
            const fileType = file.type;
            const fileName = file.name;

            if (fileType === "application/pdf") {
                // const reader = new FileReader();
                // reader.onloadend = () => {
                setFormState(prev => ({
                    ...prev,
                    file,
                    fileType,
                    fileName,
                    imagePreview: null,
                }));
                // }
                // reader.readAsDataURL(file);
            } else if (fileType.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormState(prev => ({
                        ...prev,
                        file,
                        fileType,
                        fileName,
                        imagePreview: reader.result as string,
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormState(prev => ({
                ...prev,
                file: null,
                fileType: null,
                fileName: null,
                imagePreview: null,
            }));
        }
    };

    const deleteImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setFormState((prevValues) => ({
            ...prevValues,
            file: null,
            imagePreview: null // Set the image preview URL
        }));
    }

    // Handle change for question inputs(question title and type)
    const handleQuestionChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions[index] = {
                ...updatedQuestions[index],
                [name]: value
            };
            return { ...prevState, questions: updatedQuestions };
        });
    };

    // Handle change for question options
    const handleOptionChange = (questionIndex: number, optionIndex: number, e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormState(prevState => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions[questionIndex].options[optionIndex] = value;
            return { ...prevState, questions: updatedQuestions };
        });
    };

    // Add a new question
    const handleAddQuestion = () => {
        setFormState(prevState => ({
            ...prevState,
            questions: [
                ...prevState.questions,
                { question_title: '', question_choice: 'Multiple Choice', options: [''] }
            ]
        }));
    };

    // Remove a question
    const handleRemoveQuestion = (index: number) => {
        setFormState(prevState => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions.splice(index, 1);
            return { ...prevState, questions: updatedQuestions };   //updating questions with updatedQuestions
        });
    };

    // Add a new option to a question
    const handleAddOption = (questionIndex: number) => {
        setFormState(prevState => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions[questionIndex].options.push('');
            return { ...prevState, questions: updatedQuestions };
        });
    };


    // Remove an option from a question
    const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
        setFormState(prevState => {
            const updatedQuestions = [...prevState.questions];
            updatedQuestions[questionIndex].options.splice(optionIndex, 1);
            return { ...prevState, questions: updatedQuestions };
        });

    };

    // Handle date change
    const handleDateChange = (date: string) => {
        setFormState(prevState => ({
            ...prevState,
            deadline: date
        }));
    };

    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setLoading(true)
            // const body = {
            //     ...formState,
            //     questions: JSON.stringify(formState.questions),
            //     token: token,
            //     survey_id: surveyData.id
            // };
            const body = new FormData();

            // Append all properties of formState to FormData
            for (const [key, value] of Object.entries(formState)) {
                if (Array.isArray(value)) {
                    body.append(key, JSON.stringify(value));
                } else if (value instanceof File) {
                    body.append(key, value);
                } else {
                    body.append(key, value === null ? '' : value.toString());
                }
            }

            // Append additional properties
            body.append('status', "open");
            body.append('token', token);
            body.append('survey_id', surveyData.id);

            const response = await editSurvey(body);
            if (response.success) {
                dispatch(toggleEditModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during creating survey :', err.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (surveyData) {
            setFormState(prevState => ({
                ...prevState,
                title: surveyData.title,
                description: surveyData.description,
                deadline: parseDefaultDate(surveyData.deadline),
                questions: surveyData.questions.map((question: any) => ({
                    question_title: question.questionTitle,
                    question_choice: question.questionChoice,
                    options: question.options.map((option: any) => option.title)
                })),
                residents: surveyData.assignSurveys.map((option: any) => option.residentId)
            }));
        }
    }, [surveyData]);

    const filterData = residents.filter((option: any) => formState.residents.map((r: any) => r.value).includes(option.value));

    return (
        <>
            {editModal ? (
                <DefaultLayout>
                    <form onSubmit={handleEdit}>
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row items-start md:items-center justify-between">
                            <div>
                                <p className="text-black font-bold">Surveys / <span className="text-slate-400">Edit</span></p>
                                <h2 className="text-4xl font-bold text-black dark:text-white">
                                    {surveyData.title}
                                </h2>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2"
                                    onClick={() => dispatch(toggleEditModal())}>
                                    {t('SURVEY.button1Modal.button1')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="text-white bg-primary-blue  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2"
                                >
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SURVEY.button1Modal.button5')}`}
                                </button>
                            </div>
                        </div>
                        <div className="mx-auto">
                            <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center mr-4">
                                    {t('SURVEY.button1Modal.title4')}
                                </button>
                                <div className="mt-1 text-lg font-bold">
                                    <button onClick={() => {
                                        dispatch(toggleEditModal())
                                        dispatch(toggleViewModal())
                                    }
                                    }>{t('SURVEY.button1Modal.button4')}</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/4 p-2">
                                <div>
                                    <p className="text-black font-bold">{t('SURVEY.info')}</p>
                                    <p className="mt-2">{t('SURVEY.desc')}</p>
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                                <div>
                                    <div className="w-full mb-8">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="title">
                                            {t('SURVEY.button1Modal.title1')}
                                        </label>
                                        <input
                                            name="title"
                                            value={formState.title}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            placeholder={t('SURVEY.button1Modal.lable1')}
                                            required
                                        />
                                    </div>
                                    <div className="w-full mb-8">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="description">
                                            {t('SURVEY.button1Modal.title2')}
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formState.description}
                                            onChange={handleInputChange}
                                            className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg text-black py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            placeholder={t('SURVEY.button1Modal.lable2')}
                                            rows={5}
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-wrap md:flex-nowrap  gap-5 mb-4">
                                        <div className="w-1/2 mb-8">
                                            <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2">
                                                {t('SURVEY.button1Modal.title3')}
                                            </label>
                                            <DatePickerOne defaultDate={formState.deadline} onChange={handleDateChange} />
                                        </div>
                                        <div className="w-1/2 mb-8">
                                            <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor='month'>
                                                Select Residents
                                            </label>
                                            <div className="flex justify-between gap-x-4">
                                                <Select
                                                    options={residents}
                                                    name="month"
                                                    value={residents.filter((option: any) =>
                                                        formState.residents.includes(option.value)
                                                      )}
                                                    styles={{
                                                        control: (provided: any) => ({
                                                            ...provided,
                                                            paddingTop: '6px',
                                                            paddingBottom: '5px',
                                                        }),
                                                    }}
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg text-black mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    onChange={handleResidentChange} // Update state on selection change
                                                    placeholder="Select residents"
                                                    isMulti
                                                    isClearable
                                                // required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <label className="block uppercase text-black  tracking-wide text-[14px] font-bold mb-2" htmlFor="file">
                                            Attachment
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="file"
                                                className="flex flex-col items-center justify-center w-full h-75 border-gray-300 border border-[#DDDDDD] rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                            >
                                                {formState.fileType === "application/pdf" ? (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg
                                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 20 16"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                            />
                                                        </svg>
                                                        <p className="text-xl text-gray-500 dark:text-gray-400">
                                                            PDF Selected: {formState.fileName}
                                                        </p>
                                                    </div>
                                                ) : formState.imagePreview ? (
                                                    <div className="relative w-full h-full">
                                                        <img
                                                            src={formState.imagePreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                        <button onClick={deleteImage} className="absolute right-2 top-2 bg-[#D0D5DD] rounded-[8px] text-slate-950 p-2">
                                                            <RiDeleteBin6Line size={15} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg
                                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 20 16"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                            />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                            {t('AREA.button1Modal.label5')}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {t('AREA.button1Modal.label7')}
                                                        </p>
                                                    </div>
                                                )}
                                                <input
                                                    id="file"
                                                    type="file"
                                                    name="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                // required
                                                />
                                            </label>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap my-8">
                            <div className="w-full md:w-1/4 p-2">
                                <div>
                                    <p className="text-black font-bold">{t('SURVEY.info2')}</p>
                                    <p className="mt-2">{t('SURVEY.desc2')}</p>
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                                {formState?.questions?.map((question, questionIndex) => (
                                    <div key={questionIndex} className="mb-8">
                                        <div className="flex flex-wrap md:flex-nowrap gap-5 mb-4">
                                            <div className="w-full md:w-3/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`question-${questionIndex}`}>
                                                    {t('SURVEY.button1Modal.title4')} {questionIndex + 1}
                                                </label>
                                                <input
                                                    name="question_title"
                                                    value={question?.question_title}
                                                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    type="text"
                                                    placeholder={t('SURVEY.button1Modal.lable4')}
                                                // required
                                                />
                                            </div>
                                            <div className="relative w-full  md:w-2/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`type-${questionIndex}`}>
                                                    {t('SURVEY.button1Modal.title5')}
                                                </label>
                                                <select
                                                    name="question_choice"
                                                    value={question?.question_choice}
                                                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                                                    className="block appearance-none w-full rounded-lg border border-[#DDDDDD] text-black font-bold py-2.5 px-4 pr-8 focus:outline-none focus:bg-white focus:border-gray-500"
                                                >
                                                    <option value="Multiple Choice">Multiple Choice</option>
                                                    {/* <option value="Simple">Simple</option> */}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                        {question?.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="w-full mb-4">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`option-${questionIndex}-${optionIndex}`}>
                                                    {t('SURVEY.button1Modal.title6')} {optionIndex + 1}
                                                </label>
                                                <div className="flex justify-between gap-x-4">
                                                    <input
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg text-black py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                        type="text"
                                                        placeholder={t('SURVEY.lable6')}
                                                    // required
                                                    />
                                                    <button type="button" onClick={() => handleRemoveOption(questionIndex, optionIndex)} className="text-black  border  border-[#DDDDDD] font-medium rounded-lg text-[16px] px-4 py-2 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mb-2">
                                                        <RiDeleteBin6Line className="" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between">
                                            <button type="button" onClick={() => handleAddOption(questionIndex)} className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center  mb-2">
                                                <IoMdAdd className="mr-2" /> {t('SURVEY.button1Modal.addButton')}
                                            </button>
                                            <button type="button" onClick={() => handleRemoveQuestion(questionIndex)} className="text-white bg-danger  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center d mb-2">
                                                <RiDeleteBin6Line className="mr-2" /> {t('SURVEY.button1Modal.deleteButton')}
                                            </button>

                                        </div>
                                    </div>
                                ))}

                            </div>

                        </div>
                        <div className="flex flex-wrap my-8">
                            <div className="w-full md:w-1/4 p-2"> </div>
                            <div className="w-full md:w-3/4  py-4 rounded-xl">

                                <button type="button" onClick={handleAddQuestion} className=" text-white bg-primary-blue border-2  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center  mb-2">
                                    <IoMdAdd className="mr-2" /> {t('SURVEY.button1Modal.addButton2')}
                                </button>
                            </div>
                        </div>
                    </form>
                </DefaultLayout>
            ) : null}
        </>
    );
};

export default EditCommunication;




