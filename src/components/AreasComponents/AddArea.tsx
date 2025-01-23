
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { toggleAddModal, toggleIsUpdated } from "@/store/Slices/AreaSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { createCommonArea } from "@/lib/api/commonArea";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';
import DefaultLayout from "@/components/Layouts/DefaultLayout";


interface FormValues {
    title: string;
    description: string;
    occupancy: number;
    file: File | null;
    imagePreview?: string | null;
    timings: {
        day: string;
        startTime: string;
        endTime: string;
        status: string;
    }[];
}

const initialFormState: FormValues = {
    title: '',
    description: '',
    occupancy: 1,
    file: null,
    imagePreview: null,
    timings: [
        {
            day: "Saturday",
            startTime: "10:00",
            endTime: "17:00",
            status: "open",
        },
        {
            day: "Sunday",
            startTime: "",
            endTime: "",
            status: "close",
        },
        {
            day: "Monday",
            startTime: "10:00",
            endTime: "17:00",
            status: "open",
        },
        {
            day: "Tuesday",
            startTime: "10:00",
            endTime: "17:00",
            status: "open",
        },
        {
            day: "Wednesday",
            startTime: "10:00",
            endTime: "17:00",
            status: "open",
        },
        {
            day: "Thursday",
            startTime: "10:00",
            endTime: "17:00",
            status: "open",
        },
        {
            day: "Friday",
            startTime: "10:00",
            endTime: "17:00",
            status: "open",
        }
    ]
}


const AddArea: React.FC = () => {
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(false)
    const addModal = useAppSelector((state) => state.area.addModal);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();

    const [formValues, setFormValues] = useState<FormValues>(initialFormState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    file,
                    imagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormValues((prevValues) => ({
                ...prevValues,
                file: null,
                imagePreview: null
            }));
        }
    }

    const handleTimingChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues(prevState => {
            const updatedTimings = [...prevState.timings];
            updatedTimings[index] = {
                ...updatedTimings[index],
                [name]: value
            };
            return { ...prevState, timings: updatedTimings };
        });
    };

    const handleStatusChange = (dayIndex: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedTimings = [...formValues.timings];
        updatedTimings[dayIndex].status = e.target.value;

        if (e.target.value === 'close') {
            updatedTimings[dayIndex].startTime = '';
            updatedTimings[dayIndex].endTime = '';
        }

        setFormValues({
            ...formValues,
            timings: updatedTimings,
        });
    };
    const deleteImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setFormValues((prevValues) => ({
            ...prevValues,
            file: null,
            imagePreview: null // Set the image preview URL
        }));
    }
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('title', formValues.title);
            formData.append('description', formValues.description); +

                formData.append("occupancy", String(formValues.occupancy));

            if (formValues.file) {
                formData.append('image', formValues.file);
            }
            formData.append('timings', JSON.stringify(formValues.timings.map(timing => {
                const { status, ...rest } = timing;
                return rest;
            })));
            formData.append('token', token);
            const response = await createCommonArea(formData);
            console.log(response)
            if (response.success) {
                dispatch(toggleAddModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
                setFormValues(initialFormState);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during creating common area :', err.message);
        } finally {
            setLoading(false)
        }
    };
    return (
        <>
            {addModal ? (
                <DefaultLayout>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row items-start md:items-center justify-between">
                            <div>
                                <p className="text-black font-bold"> {t('AREA.title')} / <span className="text-slate-400">{t('AREA.button1Modal.addTitle')}</span></p>
                                <h2 className="text-4xl font-bold text-black dark:text-white">
                                    {t('AREA.button1Modal.title')}
                                </h2>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => dispatch(toggleAddModal())} type="button" className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center   mb-2">
                                    {t('AREA.button1Modal.button1')}
                                </button>
                                <button type="submit" disabled={loading} className="text-white bg-primary-blue  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center  mb-2">
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('AREA.button1Modal.button2')}`}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/4 p-2">
                                <div>
                                    <p className="text-black font-bold">{t('AREA.button1Modal.head1')}</p>
                                    <p className="mt-2">
                                        {t('AREA.button1Modal.detail1')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-black  text-[14px] font-bold mb-2" htmlFor="name">
                                        {t('AREA.button1Modal.label1')}

                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="title"
                                        type="text"
                                        id="title"
                                        placeholder={t('AREA.button1Modal.label1')}
                                        value={formValues.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-black  text-[14px] font-bold mb-2" htmlFor="description">
                                        {t('AREA.button1Modal.label2')}
                                    </label>
                                    <textarea
                                        className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        placeholder={t('AREA.button1Modal.label2')}
                                        rows={5}
                                        name="description"
                                        id="description"
                                        value={formValues.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="w-full ">
                                    <label className="block uppercase text-black  tracking-wide text-[14px] font-bold mb-2" htmlFor="occupancy">
                                        {t('AREA.button1Modal.label3')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="occupancy"
                                        type="number"
                                        id="occupancy"
                                        placeholder={t('AREA.button1Modal.label3')}
                                        value={formValues.occupancy}
                                        onChange={handleChange}
                                        min={1}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase text-black  tracking-wide text-[14px] font-bold mb-2" htmlFor="file">
                                        {t('AREA.button1Modal.label4')}
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="file"
                                            className="flex flex-col items-center justify-center w-full h-50 border-gray-300 border border-[#DDDDDD] rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                        >
                                            {formValues.imagePreview ? (
                                                <div className="relative w-full h-full">

                                                    <img src={formValues.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                                                        <span className="font-semibold">{t('AREA.button1Modal.label5')}</span> {t('AREA.button1Modal.label6')}
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
                                                required
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap my-8">
                            <div className="w-full md:w-1/4 p-2">
                                <div>
                                    <p className="text-black font-bold">{t('AREA.button1Modal.head2')}</p>
                                    <p className="mt-2">{t('AREA.button1Modal.detail2')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                                {formValues.timings.map((day, dayIndex) => (

                                    <div key={dayIndex} className="mb-8">
                                        <div className="flex flex-wrap md:flex-nowrap gap-5 mb-4">
                                            <div className="w-full md:w-2/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`day-${dayIndex}`}>
                                                    {t('TIMING.label1')}
                                                </label>
                                                <input
                                                    id={`day-${dayIndex}`}
                                                    name="day"
                                                    value={day.day}
                                                    onChange={(e) => handleTimingChange(dayIndex, e)}
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    type="text"
                                                    placeholder="Enter Day"
                                                    required
                                                    disabled
                                                />
                                            </div>
                                            <div className="w-full md:w-3/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`startTime-${dayIndex}`}>
                                                    {t('TIMING.label2')}
                                                </label>
                                                <input
                                                    id={`startTime-${dayIndex}`}
                                                    name="startTime"
                                                    value={day.startTime}
                                                    onChange={(e) => handleTimingChange(dayIndex, e)}
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    type="time"
                                                    required
                                                    disabled={day.status === 'close'}
                                                />
                                            </div>
                                            <div className="w-full md:w-2/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`endTime-${dayIndex}`}>
                                                    {t('TIMING.label3')}
                                                </label>
                                                <input
                                                    id={`endTime-${dayIndex}`}
                                                    name="endTime"
                                                    value={day.endTime}
                                                    onChange={(e) => handleTimingChange(dayIndex, e)}
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    type="time"
                                                    required
                                                    disabled={day.status === 'close'}
                                                />
                                            </div>
                                            <div className="w-full md:w-2/5">
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`status-${dayIndex}`}>
                                                    {t('TIMING.label4')}
                                                </label>
                                                <select
                                                    id={`status-${dayIndex}`}
                                                    name="status"
                                                    value={day.status}
                                                    onChange={(e) => handleStatusChange(dayIndex, e)}
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                >
                                                    <option value="open"> {t('TIMING.label5')}</option>
                                                    <option value="close"> {t('TIMING.label6')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </form>
                </DefaultLayout>
            ) : null}
        </>
    );
};

export default AddArea;
