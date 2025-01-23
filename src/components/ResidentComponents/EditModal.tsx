import React, { useState, useEffect, ChangeEvent } from 'react';
import { toggleEditModal, toggleSaveModal, toggleDeleteModal, setResidentData } from "@/store/Slices/ResidentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { useLocale, useTranslations } from 'next-intl';
import Select from 'react-select';



interface FormData {
    resident_id: number,
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
}

const EditModal: React.FC<any> = () => {
    const t = useTranslations();

    const STATUS_OPTIONS = [`${t('COMMON.status')}`, `${t('COMMON.status2')}`];
    const editModal = useAppSelector((state) => state.resident.editModal);
    const resident = useAppSelector((state) => state.resident.residentData);
    const petOptions = useAppSelector((state) => state.resident.PetTypeData);
    const dispatch = useAppDispatch();
    const [pinError, setPinError] = useState('');
    const [formData, setFormData] = useState<FormData>({
        resident_id: 0,
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
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
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

        if (password === "") {
            setPinError("");
            return "";
        }

        const digitRegex = /^\d+$/;
        if (!digitRegex.test(password)) {
            return "Pin must contain only digits.";
        }

        if (password.length !== 4) {
            return "Pin must be exactly 4 digits long.";
        }

        setPinError("");
        return "";
    };

    const saveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // const errorMessage = validatePin(formData.password)
        // if (errorMessage || errorMessage !== '') {
        //     setPinError(errorMessage)
        //     return
        // }
        dispatch(setResidentData(formData));
        dispatch(toggleEditModal());
        dispatch(toggleSaveModal());
    };

    const deleteResident = () => {
        // dispatch(toggleEditModal());
        dispatch(toggleDeleteModal());
    };
    useEffect(() => {
        if (resident) {
            setFormData({
                resident_id: resident.id,
                status: resident.status || "",
                first_name: resident.firstName || "",
                last_name: resident.lastName || "",
                address: resident.resident?.address || "",
                email: resident.email || "",
                property_number: resident.resident?.propertyNumber || "",
                // password: "",
                internal_notes: resident.resident?.internalNotes || "",
                pets: resident.resident?.pets || [],
                vehicles: resident.resident?.vehicles || [],
            });
        }
    }, [resident]);

    console.log("edit formdata", formData)

    function capitalizeFirstLetter(str: any) {
        if (typeof str !== 'string' || str.length === 0) return str; // Check for valid string input
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <>
            {editModal ? (
                <>
                    <div className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
                        <div className="flex justify-between items-center mt-8">
                            <h3 className="text-3xl font-semibold">{t('RESIDENT.button3Modal.editTitle')}</h3>
                            <button className="bg-transparent border-0 text-[20px] font-bold text-black" onClick={() => dispatch(toggleEditModal())}>x</button>
                        </div>
                        <form onSubmit={saveChanges}>
                            <div className="w-full my-6">
                                <div className="relative">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-state">{t('COMMON.type')}</label>
                                    <select value={formData.status} name="status" onChange={handleChange} className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8 focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                        {STATUS_OPTIONS.map(option => (
                                            <option key={option} value={option}>{capitalizeFirstLetter(option)}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-first-name">{t('RESIDENT.button3Modal.lable1')}</label>
                                        <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="First Name" name={t('RESIDENT.button3Modal.lable1')} value={formData.first_name} onChange={handleChange} required />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-last-name">{t('RESIDENT.button3Modal.lable2')}</label>
                                        <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Last Name" name={t('RESIDENT.button3Modal.lable2')} value={formData.last_name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-address">{t('RESIDENT.button3Modal.lable3')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" name="address" placeholder={t('RESIDENT.button3Modal.lable3')} value={formData.address} onChange={handleChange} required />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-address">{t('RESIDENT.button3Modal.lable4')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" name="address" placeholder={t('RESIDENT.button3Modal.lable4')} value={resident.phoneNumber} readOnly />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-email">{t('RESIDENT.button3Modal.lable5')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="email" name="email" placeholder={t('RESIDENT.button3Modal.lable5')} value={formData.email} onChange={handleChange} required />
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
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-password">{t('RESIDENT.button3Modal.lable6')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="password" type="password" placeholder={t('RESIDENT.button3Modal.lable6')} value={formData.password} onChange={handleChange} />
                                </div>
                                {pinError && <p className="text-red text-sm font-semibold mb-2">{pinError}</p>} */}
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-notes">{t('RESIDENT.button3Modal.lable7')}</label>
                                    <textarea className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="internal_notes" placeholder={t('RESIDENT.button3Modal.lable8')} value={formData.internal_notes} onChange={handleChange} rows={5} />
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
                                                onChange={(selectedOption) => handlePetTypeChange(petIndex, selectedOption)}
                                                placeholder={t('RESIDENT.button3Modal.lable9')}
                                                isClearable
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
                                            <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`question-${vehicleIndex}-make`}>
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
                                            <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`question-${vehicleIndex}-color`}>
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
                                                <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor={`question-${vehicleIndex}-plates`}>
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
                            <div className="flex items-center mt-4 justify-between">
                                <div>
                                    <button className="text-white rounded-lg bg-primary-blue font-medium  text-sm px-4 py-2.5  outline-none  mr-1 mb-1" type="submit" >{t('RESIDENT.button3Modal.button2')}</button>

                                    <button className="border rounded-lg border-[#DDDDDD] bg-transparent font-medium  px-4 py-2.5 text-sm outline-none  ml-1 mb-1" type="button" onClick={() => dispatch(toggleEditModal())}>{t('RESIDENT.button3Modal.button1')}</button>
                                </div>
                                <button type="button" onClick={deleteResident} className="text-gray-900 bg-white border rounded-lg border-[#DDDDDD] font-medium text-sm px-4 py-2.5 mb-2 flex items-center">
                                    <RiDeleteBin6Line className="mr-2" />{t('RESIDENT.button3Modal.button3')}
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* </div> */}
                </>
            ) : null}
        </>
    );
}

export default EditModal;



