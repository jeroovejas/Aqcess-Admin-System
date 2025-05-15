import React, { useState, ChangeEvent, useEffect } from "react";
import { toggleEditModal, toggleIsUpdated } from "@/store/Slices/PlaceSlice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RiDeleteBin6Line } from "react-icons/ri";
import { editPlace } from "@/lib/api/place";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTranslations } from 'next-intl';
interface PlaceFormState {
    name: string;
    description: string;
    file: File | null;
    imagePreview?: string | null;
    address: string;
    contact_email: string;
    phone: string;
    whatsapp: string;
    website: string;
    timings: {
        day: string;
        startTime: string;
        endTime: string;
        status: string;
    }[];
}


const EditPlace: React.FC = () => {
    const t = useTranslations();
    const editModal = useAppSelector((state) => state.place.editModal);
    const [loading, setLoading] = useState(false);
    const placeData = useAppSelector((state) => state.place.placeData);
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const [formState, setFormState] = useState<PlaceFormState>({
        name: '',
        description: '',
        file: null,
        imagePreview: null,
        address: '',
        contact_email: '',
        phone: '',
        whatsapp: '',
        website: '',
        timings: [
            {
                day: "Saturday",
                startTime: "",
                endTime: "",
                status: "",
            },
            {
                day: "Sunday",
                startTime: "",
                endTime: "",
                status: "",
            },
            {
                day: "Monday",
                startTime: "",
                endTime: "",
                status: "",
            },
            {
                day: "Tuesday",
                startTime: "",
                endTime: "",
                status: "",
            },
            {
                day: "Wednesday",
                startTime: "",
                endTime: "",
                status: "",
            },
            {
                day: "Thursday",
                startTime: "",
                endTime: "",
                status: "",
            },
            {
                day: "Friday",
                startTime: "",
                endTime: "",
                status: "",
            }
        ]
    }
    );
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle change for question inputs(question title and type)
    const handleTimingChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => {
            const updatedTimings = [...prevState.timings];
            updatedTimings[index] = {
                ...updatedTimings[index],
                [name]: value
            };
            return { ...prevState, timings: updatedTimings };
        });
    };

    const handleStatusChange = (dayIndex: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const updatedTimings = formState.timings.map((timing, index) => {
            if (index === dayIndex) {
                const updatedTiming = { 
                    ...timing, 
                    status: e.target.value,
                    startTime: e.target.value === 'close' ? '' : timing.startTime,
                    endTime: e.target.value === 'close' ? '' : timing.endTime,
                };
                return updatedTiming;
            }
            return timing;
        });
    
        setFormState({
            ...formState,
            timings: updatedTimings,
        });
    };
    

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState((prevValues) => ({
                    ...prevValues,
                    file,
                    imagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormState((prevValues) => ({
                ...prevValues,
                file: null,
                imagePreview: null
            }));
        }
    };    

    const deleteImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setFormState((prevValues) => ({
            ...prevValues,
            file: null,
            imagePreview: null
        }));
    }

    const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            setLoading(true)
            const formData = new FormData();
            formData.append('place_id', placeData.id);
            formData.append('name', formState.name);
            formData.append('description', formState.description);
            formData.append('address', formState.address);
            formData.append('contact_email', formState.contact_email);
            formData.append('phone', formState.phone);
            formData.append('whatsapp', formState.whatsapp);
            formData.append('website', formState.website);
            if (formState.file) {
                formData.append('image', formState.file);
            }
            formData.append('timings', JSON.stringify(formState.timings.map(timing => {
                const { status, ...rest } = timing;
                return rest;
            })));
            formData.append('token', token);
            const response = await editPlace(formData);
            if (response.success) {
                dispatch(toggleEditModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during creating place :', err.message);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (placeData && Array.isArray(placeData.timings)) {
            setFormState(prevState => ({
                ...prevState,
                name: placeData.name,
                description: placeData.description,
                file: null,
                imagePreview: placeData.imageUrl,
                address: placeData.address,
                contact_email: placeData.contact_email,
                phone: placeData.phone,
                whatsapp: placeData.whatsapp,
                website: placeData.website,
                timings: placeData.timings.map((item:any) => ({
                    day: item.day,
                    startTime: item.start_time !== '00:00:00' ? item.start_time : '',
                    endTime: item.end_time !== '00:00:00' ? item.end_time : '',
                    status: item.status,
                }))
            }));
        }
    }, [placeData]);
    
    return (
        <>
            {editModal ? (
                <DefaultLayout>
                    <form onSubmit={handleEdit}>
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row items-start md:items-center justify-between">
                            <div>
                                <p className="text-black font-bold">{t('PLACE.modal.title')}  / <span className="text-slate-400">{t('PLACE.modal.editTitle')}</span></p>
                                <h2 className="text-4xl font-bold text-black dark:text-white">
                                    {placeData.name}
                                </h2>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2"
                                    onClick={() => dispatch(toggleEditModal())}>
                                      {t('PLACE.modal.backButton')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="text-white bg-primary-blue  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2"
                                >
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PLACE.modal.editButton')}`}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap">
                            <div className="w-full md:w-1/4 p-2">
                                <div>
                                    <p className="text-black font-bold">{t('PLACE.modal.head1')}</p>
                                    <p className="mt-2">
                                    {t('PLACE.modal.detail1')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                                <div className="flex flex-wrap md:flex-nowrap gap-5 mb-4">
                                    {/* First Row: Name and Contact Email */}
                                    <div className="w-full md:w-1/2">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="name">
                                        {t('PLACE.modal.label1')}
                                        </label>
                                        <input
                                            name="name"
                                            value={formState.name}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            placeholder={t('PLACE.modal.placeHolder1')}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="contact_email">
                                        {t('PLACE.modal.label2')}
                                        </label>
                                        <input
                                            name="contact_email"
                                            value={formState.contact_email}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            placeholder={t('PLACE.modal.placeHolder2')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap md:flex-nowrap gap-5 mb-4">
                                    {/* Second Row: Phone and Whatsapp */}
                                    <div className="w-full md:w-1/2">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="phone">
                                        {t('PLACE.modal.label3')}
                                        </label>
                                        <input
                                            name="phone"
                                            value={formState.phone}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            placeholder={t('PLACE.modal.placeHolder3')}
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="whatsapp">
                                        {t('PLACE.modal.label4')}
                                        </label>
                                        <input
                                            name="whatsapp"
                                            value={formState.whatsapp}
                                            onChange={handleInputChange}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            placeholder={t('PLACE.modal.placeHolder4')}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="website">
                                    {t('PLACE.modal.label5')}
                                    </label>
                                    <input
                                        name="website"
                                        value={formState.website}
                                        onChange={handleInputChange}
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        placeholder={t('PLACE.modal.placeHolder5')}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="description">
                                    {t('PLACE.modal.label6')}
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formState.description}
                                        onChange={handleInputChange}
                                        className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg text-black py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        placeholder={t('PLACE.modal.placeHolder6')}
                                        rows={5}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="address">
                                    {t('PLACE.modal.label7')}
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formState.address}
                                        onChange={handleInputChange}
                                        className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg text-black py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        placeholder={t('PLACE.modal.placeHolder7')}
                                        rows={5}
                                        required
                                    />
                                </div>
                                <div className="w-full my-6">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="file">
                                    {t('PLACE.modal.label8')}
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="file"
                                            className="flex flex-col items-center justify-center w-full h-50 border-gray-300 border border-[#DDDDDD] rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                        >
                                            {formState.imagePreview ? (
                                                <div className="relative w-full h-full">

                                                    <img src={formState.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                                                        <span className="font-semibold">{t('PLACE.modal.placeHolder8')}</span> {t('PLACE.modal.placeHolder9')}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {t('PLACE.modal.placeHolder10')}
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                            id="file"
                                            type="file"
                                            name="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap my-8">
                            <div className="w-full md:w-1/4 p-2">
                                <div>
                                    <p className="text-black font-bold">{t('PLACE.modal.head2')}</p>
                                    <p className="mt-2">{t('PLACE.modal.detail2')}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                                {formState.timings.map((day, dayIndex) => (
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



                                            {/* Start Time */}
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
                                                    disabled={day.status === 'close'} // Disable if status is 'close'
                                                />
                                            </div>

                                            {/* End Time */}
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
                                                    disabled={day.status === 'close'} // Disable if status is 'close'
                                                />
                                            </div>

                                            {/* Open/Close select */}
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
                                                    <option value="open">{t('TIMING.label5')}</option>
                                                    <option value="close">{t('TIMING.label6')}</option>
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

export default EditPlace;




