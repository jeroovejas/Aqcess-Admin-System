
import React, { useState, useEffect, useRef } from "react";
import { toggleEditModal, toggleIsUpdated } from "@/store/Slices/AreaSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RiDeleteBin6Line } from "react-icons/ri";
import { editCommonArea } from "@/lib/api/commonArea";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';


interface FormValues {
    title: string;
    description: string;
    occupancy: number;
    file: File | null;
    imagePreview?: string | null;
}

const EditArea: React.FC = () => { 
    const t = useTranslations();
    const editModal = useAppSelector((state) => state.area.editModal);
    const areaData = useAppSelector((state) => state.area.areaData);
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch();

    const [formValues, setFormValues] = useState<FormValues>({
        title: '',
        description: '',
        occupancy: 1,
        file: null,
        imagePreview: null
    });

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
                    imagePreview: reader.result as string // Set the image preview URL
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
            console.log("occupancy", formValues.occupancy)
            const formData = new FormData();
            formData.append('area_id', areaData.id);
            formData.append('title', formValues.title);
            formData.append('description', formValues.description);
            formData.append("occupancy", String(formValues.occupancy));

            if (formValues.file) {
                formData.append('image', formValues.file);
            }
            formData.append('token', token);
            const response = await editCommonArea(formData);
            console.log(response)
            if (response.success) {
                dispatch(toggleEditModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during editing common area :', err.message);
        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        if (areaData) {
            setFormValues({
                title: areaData.title || '',
                description: areaData.description || '',
                occupancy: areaData.occupancy || '',
                file: null,
                imagePreview: areaData.imageUrl
            });
        }
        //upper ...prevState functional form of setState of updating state when you want to update some fields of your state
    }, [areaData]);
    return (
        <>
            {editModal && (
                <div className="absolute top-0 right-0 w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar bg-white my-0">
                    <div className="border-0 relative text-black w-full h-full outline-none focus:outline-none px-8 py-8">
                        <div className="flex justify-between items-center mt-8">
                            <h3 className="text-3xl font-semibold">{areaData.title}</h3>
                            <button
                                className="bg-transparent border-0 text-[20px] font-bold text-black"
                                onClick={() => dispatch(toggleEditModal())}
                            >
                                x
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="w-full my-6">
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="name">
                                    {t('AREA.button1Modal.lable1')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="title"
                                        type="text"
                                        id="title"
                                        placeholder={t('AREA.button1Modal.lable1')}
                                        value={formValues.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="description">
                                    {t('AREA.button1Modal.lable2')}
                                    </label>
                                    <textarea
                                        className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        placeholder={t('AREA.button1Modal.lable2')}
                                        rows={5}
                                        name="description"
                                        id="description"
                                        value={formValues.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="occupancy">
                                    {t('AREA.button1Modal.lable3')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        name="occupancy"
                                        type="number"
                                        id="occupancy"
                                        placeholder={t('AREA.button1Modal.lable3')}
                                        value={formValues.occupancy}
                                        onChange={handleChange}
                                        min={1}
                                        required
                                    />
                                </div>
                            </div>


                            <div className="w-full my-6">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="file">
                                {t('AREA.button1Modal.lable4')}
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
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
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
                            <div className="flex gap-3 items-center">
                                <button
                                    disabled={loading}
                                    className={`text-white rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3  outline-none  mr-1 mb-1`}
                                    type="submit"

                                >
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('AREA.button1Modal.button3')}`}

                                </button>
                                <button
                                    className="text-red-500 border rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleEditModal())}
                                >
                                    {t('AREA.button1Modal.button1')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditArea;
