"use client"
import React, { useState, ChangeEvent, useRef } from "react";
import { toggleAddModal, toggleIsUpdated } from "@/store/Slices/SurveySlice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DatePickerOne from "../DataPicker/DatePickerOne/DatePickerOne";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { createSurvey } from "@/lib/api/survey";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';


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
}

const initialFormState: SurveyFormState = {
    title: '',
    description: '',
    deadline: '',
    questions: [{
        question_title: '',
        question_choice: 'Multiple Choice',
        options: ['']
    }]
}

const AddSurvey: React.FC = () => { 
    const t = useTranslations();
    const formRef = useRef<HTMLFormElement>(null);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const addModal = useAppSelector((state) => state.survey.addModal);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();

    // Initialize state with default values
    const [formState, setFormState] = useState<SurveyFormState>(initialFormState);

    // Handle input changes for survey title and description
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

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
        // Here why use return 
        // return { ...prevState, questions: updatedQuestions } creates and returns the new state object with the updated questions array. React uses this returned object to update the component's stat
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setLoading1(true)
            const body = {
                ...formState,
                status: "open",
                questions: JSON.stringify(formState.questions),
                token: token
            };
            const response = await createSurvey(body);
            if (response.success) {
                dispatch(toggleAddModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
                setFormState(initialFormState)
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during creating survey :', err.message);
        } finally {
            setLoading1(false)
        }
    };
    const handleDraft = async () => {
        if (!formRef.current?.reportValidity()) return;
        setLoading2(true)
        try {
            const body = {
                ...formState,
                status: "draft",
                questions: JSON.stringify(formState.questions),
                token: token
            };
            const response = await createSurvey(body);
            if (response.success) {
                dispatch(toggleAddModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
                setFormState(initialFormState)
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during creating survey :', err.message);
        } finally {
            setLoading2(false)
        }
    };
    return (
        <>
            {addModal ? (
                <DefaultLayout>
                    <form onSubmit={handleSubmit} ref={formRef}>
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row items-start md:items-center justify-between">
                            <div>
                                <p className="text-black font-bold">Surveys / <span className="text-slate-400">Create new</span></p>
                                <h2 className="text-4xl font-bold text-black dark:text-white">
                                {t('SURVEY.button1Modal.title')}
                                </h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => dispatch(toggleAddModal())} type="button" className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center   mb-2">
                                {t('SURVEY.button1Modal.button1')}
                                </button>
                                <button onClick={handleDraft} disabled={loading2} type="button" className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center   mb-2">
                                    {loading2 ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SURVEY.button1Modal.button2')}`}
                                </button>
                                <button type="submit" disabled={loading1} className="text-white bg-primary-blue  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center  mb-2">
                                    {loading1 ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SURVEY.button1Modal.button3')}`}
                                </button>
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
                                    {/* <div className="w-full mb-8">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="title">
                                            Survey Title
                                        </label>
                                        <input
                                            name="title"
                                            value={formState.title}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="datetime-local"
                                            placeholder="Enter survey title"
                                            required
                                        />
                                    </div> */}
                                    <div className="w-1/2 mb-8">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2">
                                        {t('SURVEY.button1Modal.title3')}
                                        </label>
                                        <DatePickerOne onChange={handleDateChange} defaultDate={formState.deadline} />
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
                                {formState.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="mb-8">
                                        <div className="flex flex-wrap md:flex-nowrap  gap-5 mb-4">
                                            <div className="w-full md:w-3/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`question-${questionIndex}`}>
                                                {t('SURVEY.button1Modal.title4')} {questionIndex + 1}
                                                </label>
                                                <input
                                                    name="question_title"
                                                    value={question.question_title}
                                                    onChange={(e) => handleQuestionChange(questionIndex, e)}
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    type="text"
                                                    placeholder={t('SURVEY.button1Modal.lable4')}
                                                    required
                                                />
                                            </div>
                                            <div className="relative w-full md:w-2/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`type-${questionIndex}`}>
                                                {t('SURVEY.button1Modal.title5')}
                                                </label>
                                                <select
                                                    name="question_choice"
                                                    value={question.question_choice}
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
                                        {question.options.map((option, optionIndex) => (
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
                                                        placeholder={t('SURVEY.button1Modal.lable6')}
                                                        required
                                                    />
                                                    <button type="button" onClick={() => handleRemoveOption(questionIndex, optionIndex)} className="text-black  border  border-[#DDDDDD] font-medium rounded-lg text-[16px] px-4 py-2 text-center inline-flex items-center  mb-2">
                                                        <RiDeleteBin6Line className="" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between">
                                            <button type="button" onClick={() => handleAddOption(questionIndex)} className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center  mb-2">
                                                <IoMdAdd className="mr-2" /> {t('SURVEY.button1Modal.addButton')}
                                            </button>
                                            <button type="button" onClick={() => handleRemoveQuestion(questionIndex)} className="text-white bg-danger  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center  mb-2">
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

                                <button type="button" onClick={handleAddQuestion} className=" text-white bg-primary-blue  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
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

export default AddSurvey;



