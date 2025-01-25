"use client";
import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { toggleAddModal, toggleIsUpdated } from "@/store/Slices/ResidentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { createResident } from "@/lib/api/resident";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import 'react-phone-number-input/style.css';
import { useLocale, useTranslations } from 'next-intl';
import Select from 'react-select';


interface FormData {
    status: "active" | "inactive";
    first_name: string;
    last_name: string;
    address: string;
    email: string;
    property_number: string;
    // password: string;
    internal_notes: string;
    pets: {
        type: string;
        name: string;
    }[];
    vehicles: {
        make: string;
        color: string;
        plates: string;
    }[];
    token: string;
}


const initialFormData: FormData = {
    status: "active",
    first_name: "",
    last_name: "",
    address: "",
    email: "",
    property_number: "",
    // password: "",
    internal_notes: "",
    pets: [],
    vehicles: [],
    token: ""
};

const AddModal: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations();

    const addModal = useAppSelector((state) => state.resident.addModal);
    const petOptions = useAppSelector((state) => state.resident.PetTypeData);
    const token = useAppSelector((state) => state.auth.token);
    const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [pinError, setPinError] = useState('');
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [error, setError] = useState('');
    const [number, setNumber] = useState<string | undefined>('');

    const handleNumberChange = (value: string | undefined) => {
        setNumber(value); // Update value, which can be undefined or a valid phone number
    };
    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleVehicleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const updatedVehicles = [...prevState.vehicles];
            updatedVehicles[index] = {
                ...updatedVehicles[index],
                [name]: value
            };
            return { ...prevState, vehicles: updatedVehicles };
        });
    };
    const handleAddVehicle = () => {
        setFormData(prevState => ({
            ...prevState,
            vehicles: [
                ...prevState.vehicles,
                { make: '', color: '', plates: '' }
            ]
        }));
    };

    // Remove a question
    const handleRemoveVehicle = (index: number) => {
        setFormData(prevState => {
            const updatedVehicles = [...prevState.vehicles];
            updatedVehicles.splice(index, 1);
            return { ...prevState, vehicles: updatedVehicles };   //updating questions with updatedQuestions
        });
    };

    const addPet = (): void => {
        setFormData((prevState) => ({
            ...prevState,
            pets: [
                ...prevState.pets,
                { type: '', name: '', }
            ]
        }));
    };

    const removePet = (petIndex: number): void => {
        setFormData(prevState => {
            const updatedPets = [...prevState.pets];
            updatedPets.splice(petIndex, 1);
            return { ...prevState, pets: updatedPets };   //updating questions with updatedQuestions
        });
    };

    const handlePetTypeChange = (index: number, selectedOption: any) => {
        setFormData((prevState) => {
            const updatedPets = [...prevState.pets];
            updatedPets[index] = {
                ...updatedPets[index],
                type: selectedOption ? selectedOption.value : "", // Update type
            };
            return { ...prevState, pets: updatedPets };
        });
    };

    // Handle input change for name
    const handlePetNameChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormData((prevState) => {
            const updatedPets = [...prevState.pets];
            updatedPets[index] = {
                ...updatedPets[index],
                name: value, // Update name
            };
            return { ...prevState, pets: updatedPets };
        });
    };


    const validatePin = (password: any) => {
        // Check if password contains only digits
        const digitRegex = /^\d+$/; // This checks for only digits (no letters or special characters)

        if (!digitRegex.test(password)) {
            return "Pin must contain only digits.";
        }

        // Check if password has exactly 4 digits
        if (password.length !== 4) {
            return "Pin must be exactly 4 digits long.";
        }
        setPinError("");
        return "";
    };

    const handleCancel = async () => {
        dispatch(toggleAddModal());
        setFormData(initialFormData);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!(number && isValidPhoneNumber(number))) {
            setError('Plz enter a valid phone number')
            return
        } else {
            setError('')
        }
        // const errorMessage = validatePin(formData.password)
        // if (errorMessage || errorMessage !== '') {
        //     setPinError(errorMessage)
        //     return
        // }
        setLoading(true)
        try {
            setError('');
            const body = {
                ...formData,
                phone_number: number,
                pets: formData.pets.length > 0 ? JSON.stringify(formData.pets) : null,
                vehicles: formData.vehicles.length > 0 ? JSON.stringify(formData.vehicles) : null,
                token: token
            };
            const response = await createResident(body);
            if (response.success) {
                dispatch(toggleAddModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
                setFormData(initialFormData);
                setNumber('')
            } else {
                showErrorToast(response.data.message);
            }
        } catch (err: any) {
            console.error('Unexpected error during creating resident:', err.message);
        } finally {
            setLoading(false)
        }

    };

    // const handleClickOutside = (event: MouseEvent) => {
    //     if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
    //         dispatch(toggleAddModal());
    //     }
    // };

    // useEffect(() => {
    //     if (addModal) {
    //         document.addEventListener("mousedown", handleClickOutside);
    //     }
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [addModal]);

    console.log(formData)

    return (
        <>
            {addModal ? (
                <div ref={modalRef} className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
                    <div className="flex justify-between items-center mt-8">
                        <h3 className="text-3xl font-semibold">{t('RESIDENT.button3Modal.title')}</h3>
                        <button className="bg-transparent border-0 text-[20px] font-bold text-black"
                            onClick={() => dispatch(toggleAddModal())}
                        >
                            x
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="w-full my-6">
                            <div className="relative">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="status">
                                    Status
                                </label>
                                <select
                                    className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8 focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="active">{t('COMMON.status')}</option>
                                    <option value="deactivated">{t('COMMON.status2')}</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="w-1/2">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="firstName">
                                        {t('RESIDENT.button3Modal.lable1')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder={t('RESIDENT.button3Modal.lable1')}
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="lastName">
                                        {t('RESIDENT.button3Modal.lable2')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder={t('RESIDENT.button3Modal.lable2')}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="address">
                                    {t('RESIDENT.button3Modal.lable3')}
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder={t('RESIDENT.button3Modal.lable3')}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="address">
                                    {t('RESIDENT.button3Modal.lable4')}
                                </label>
                                <PhoneInput
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:ring-0 focus:shadow-none focus:bg-white focus:border-none"
                                    international
                                    defaultCountry="PK"  // You can set the default country
                                    value={number}
                                    onChange={handleNumberChange}
                                    placeholder={t('RESIDENT.button3Modal.lable4')}
                                    required
                                />
                            </div>
                            {error && <p className="text-red text-sm font-semibold mb-2">{error}</p>}
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="email">
                                    {t('RESIDENT.button3Modal.lable5')}
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t('RESIDENT.button3Modal.lable5')}
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="property_number">
                                    {t('RESIDENT.button3Modal.lable14')}
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    id="property_number"
                                    name="property_number"
                                    value={formData.property_number}
                                    onChange={handleChange}
                                    placeholder={t('RESIDENT.button3Modal.lable14')}
                                    required
                                />
                            </div>
                            {/* <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="password">
                                    {t('RESIDENT.button3Modal.lable6')}
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={t('RESIDENT.button3Modal.lable6')}
                                    required
                                />
                            </div>
                            {pinError && <p className="text-red text-sm font-semibold mb-2">{pinError}</p>} */}
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="internal_notes">
                                    {t('RESIDENT.button3Modal.lable7')}
                                </label>
                                <textarea
                                    className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="internal_notes"
                                    name="internal_notes"
                                    value={formData.internal_notes}
                                    onChange={handleChange}
                                    placeholder={t('RESIDENT.button3Modal.lable7')}
                                    rows={5}
                                />
                            </div>
                            {formData.pets.length > 0 && formData.pets.map((pet, petIndex) => (
                                <div key={petIndex} className="w-full mb-4">
                                    <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`pet-${petIndex}-name`}>
                                        {t('RESIDENT.button3Modal.title9')}
                                    </label>
                                    <div className="flex justify-between gap-x-4">
                                        <Select
                                            options={petOptions}
                                            name="type"
                                            value={pet.type ? petOptions.find((opt) => opt.value === pet.type) : null}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg text-black  mb-3 leading-tight focus:outline-none focus:bg-white"
                                            onChange={(selectedOption) => handlePetTypeChange(petIndex, selectedOption)} // Update state
                                            placeholder={t('RESIDENT.button3Modal.lable9')}
                                            isClearable
                                            required
                                        />
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <div className="w-full">
                                            <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`pet-${petIndex}-name`}>
                                                {t('RESIDENT.button3Modal.title13')}
                                            </label>
                                            <div className="flex justify-between gap-x-4">
                                                <input
                                                    name="name"
                                                    value={pet.name}
                                                    onChange={(e) => handlePetNameChange(petIndex, e)}
                                                    className="appearance-none block w-4/6 bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    type="text"
                                                    placeholder={t('RESIDENT.button3Modal.lable13')}
                                                    required
                                                />

                                                <button type="button" onClick={() => removePet(petIndex)} className="border flex items-center rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 text-sm outline-none mb-3 ">
                                                    <RiDeleteBin6Line className="mr-2" /> {t('RESIDENT.button3Modal.delButtonPet')}
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            ))}
                            {formData.vehicles.length > 0 && formData.vehicles.map((vehicle, vehicleIndex) => (
                                <div key={vehicleIndex} className="mb-8">
                                    <div className="w-full">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`vehicle-${vehicleIndex}-make`}>
                                            {t('RESIDENT.button3Modal.title10')}
                                        </label>
                                        <input
                                            name="make"
                                            value={vehicle.make}
                                            onChange={(e) => handleVehicleChange(vehicleIndex, e)}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            placeholder={t('RESIDENT.button3Modal.lable10')}
                                            required
                                        />
                                    </div>
                                    <div className="w-full">
                                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`vehicle-${vehicleIndex}-color`}>
                                            {t('RESIDENT.button3Modal.title11')}
                                        </label>
                                        <input
                                            name="color"
                                            value={vehicle.color}
                                            onChange={(e) => handleVehicleChange(vehicleIndex, e)}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            placeholder={t('RESIDENT.button3Modal.lable11')}
                                            required
                                        />
                                    </div>
                                    <div className="w-full flex justify-between items-center">


                                        <div className="w-full">
                                            <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`vehicle-${vehicleIndex}-plates`}>
                                                {t('RESIDENT.button3Modal.title12')}
                                            </label>
                                            <div className="flex justify-between gap-x-4">
                                                <input
                                                    name="plates"
                                                    value={vehicle.plates}
                                                    onChange={(e) => handleVehicleChange(vehicleIndex, e)}
                                                    className="appearance-none block w-4/6 bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                    type="text"
                                                    placeholder={t('RESIDENT.button3Modal.lable12')}
                                                    required
                                                />

                                                <button type="button" onClick={() => handleRemoveVehicle(vehicleIndex)} className="border flex items-center rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 text-sm outline-none mb-3 ">
                                                    <RiDeleteBin6Line className="mr-2" /> {t('RESIDENT.button3Modal.delButton')}
                                                </button>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <button type="button" onClick={handleAddVehicle} className="border flex items-center rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none  mr-1 mb-1">
                                <IoMdAdd className="mr-2" /> {t('RESIDENT.button3Modal.addButton')}
                            </button>
                            <button type="button" onClick={addPet} className=" border flex items-center rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none  mr-1 mb-1">
                                <IoMdAdd className="mr-2" /> {t('RESIDENT.button3Modal.addButton2')}
                            </button>
                        </div>
                        <div className="flex mt-4 gap-3 items-center">
                            <button
                                className="text-white flex justify-center items-center rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3 shadow hover:shadow-lg outline-none  mr-1 mb-1"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('RESIDENT.button3Modal.button4')}`}

                            </button>
                            <button
                                className=" border rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                type="button"
                                onClick={handleCancel}
                            >
                                {t('RESIDENT.button3Modal.button1')}
                            </button>

                        </div>
                    </form>
                </div>
            ) : null}
        </>
    );
};

export default AddModal;
