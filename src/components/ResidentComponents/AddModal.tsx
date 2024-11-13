"use client";
import React, { useEffect, useState, useRef } from "react";
import { toggleAddModal, toggleIsUpdated } from "@/store/Slices/ResidentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { createResident } from "@/lib/api/resident";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';


const initialFormData = {
    status: "active",
    first_name: "",
    last_name: "",
    address: "",
    email: "",
    password: "",
    internal_notes: "",
    token: ""
};

const AddModal: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const addModal = useAppSelector((state) => state.resident.addModal);
    const token = useAppSelector((state) => state.auth.token);
    const modalRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [pinError, setPinError] = useState('');

    // State to hold form data
    const [formData, setFormData] = useState(initialFormData);
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
        const errorMessage = validatePin(formData.password)
        if (errorMessage || errorMessage !== '') {
            setPinError(errorMessage)
            return
        }
        setLoading(true)
        try {
            setError('');
            const body = {
                ...formData,
                phone_number: number,
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

    return (
        <>
            {addModal ? (
                <div ref={modalRef} className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
                    <div className="flex justify-between items-center mt-8">
                        <h3 className="text-3xl font-semibold">Add new resident</h3>
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
                                    <option value="active">Active</option>
                                    <option value="deactivated">Deactivated</option>
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
                                        First Name
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="lastName">
                                        Last Name
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="address">
                                    Address
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Address"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="address">
                                    Phone Number
                                </label>
                                <PhoneInput
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:ring-0 focus:shadow-none focus:bg-white focus:border-none"
                                    international
                                    defaultCountry="PK"  // You can set the default country
                                    value={number}
                                    onChange={handleNumberChange}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {error && <p className="text-red text-sm font-semibold mb-2">{error}</p>}
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="password">
                                    Pin
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Pin"
                                    required
                                />
                            </div>
                            {pinError && <p className="text-red text-sm font-semibold mb-2">{pinError}</p>}
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="internal_notes">
                                    Internal Notes
                                </label>
                                <textarea
                                    className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="internal_notes"
                                    name="internal_notes"
                                    value={formData.internal_notes}
                                    onChange={handleChange}
                                    placeholder="Add notes about residents"
                                    rows={5}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <button
                                className="text-white flex justify-center items-center rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3 shadow hover:shadow-lg outline-none  mr-1 mb-1"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : "Add Resident"}

                            </button>
                            <button
                                className="text-red-500 border rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </>
    );
};

export default AddModal;
