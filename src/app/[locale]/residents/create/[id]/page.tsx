"use client";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { sendEmail, signUp } from "@/lib/api/auth";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/Slices/AuthSlice";
import { FiUser } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/navigation";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { BsHouseDoor } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";
import { SlLocationPin } from "react-icons/sl";
import { createResident } from "@/lib/api/resident";
import { FaCheckCircle } from "react-icons/fa";


interface FormState {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    property_number: string;
    status: String;
    society_admin_id:number;
}

const CreateResident = ({ params }: { params: { id: string } }) => {
    const t = useTranslations();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const rawId = params.id as string; 
    const base64Id = decodeURIComponent(rawId); 
    const userId = Buffer.from(base64Id, 'base64').toString('utf-8');
    console.log('Decoded ID:', userId);


    const [formState, setFormState] = useState<FormState>({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        property_number: "",
        status: "active",
        society_admin_id: parseInt(userId)
    });

    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [residentCreated, setResidentCreated] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePhoneChange = (value: string | undefined) => {
        setFormState((prevState) => ({
            ...prevState,
            phone_number: value || "",
        }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        setError("");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if (!isValidPhoneNumber(formState.phone_number)) {
        //     showErrorToast("Invalid phone number.");
        //     return;
        // }

        setLoading(true);
        try {
            const response = await createResident(formState);
            if (response.success) {
                setResidentCreated(true);
                showSuccessToast("Resident created successfully")
            } else {
                showErrorToast(response.data.message);
            }
        } catch (err: any) {
            console.error("Unexpected error during account creation:", err.message);
            showErrorToast("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
<div className="min-h-screen bg-[url('/images/main/aqcess-bg-image.JPG')] bg-cover bg-center bg-no-repeat">
        <div className="">
            {/* Logo */}
            <div className="p-4 lg:pl-10">
                <Link href="/">
                    <Image src="/images/main/logo.png" alt="Logo" height={100} width={130} />
                </Link>
            </div>

            {/* Centered Form */}
            <div className="flex justify-center items-center w-full mt-6 lg:mt-0">
                <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl rounded-xl shadow-md p-10">
                    {residentCreated ? (
                        <>
                            <div className="flex flex-col items-center justify-center text-green-600">
                                <FaCheckCircle size={50} />
                                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-black text-center">
                                    Resident Created!
                                </h2>
                                <p className="text-center mt-2 text-gray-600">
                                    Your resident account has been successfully created.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="mb-6 text-xl md:text-3xl flex justify-center items-center gap-2 font-bold text-black text-center">
                                <FaHouse size={35} /> Resident Account
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <InputField
                                            name="first_name"
                                            placeholder={t("SIGNUP.firstName")}
                                            value={formState.first_name}
                                            onChange={handleInputChange}
                                            icon={<FiUser />}
                                        />
                                        <InputField
                                            name="last_name"
                                            placeholder={t("SIGNUP.lastName")}
                                            value={formState.last_name}
                                            onChange={handleInputChange}
                                            icon={<FiUser />}
                                        />
                                    </div>

                                    <InputField
                                        type="email"
                                        name="email"
                                        placeholder={t("SIGNUP.email")}
                                        value={formState.email}
                                        onChange={handleInputChange}
                                        icon={<TfiEmail />}
                                    />

                                    <div className="w-full relative">
                                        <PhoneInput
                                            international
                                            defaultCountry="PK"
                                            value={formState.phone_number}
                                            onChange={handlePhoneChange}
                                            placeholder={t("RESIDENT.button3Modal.lable4")}
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                        />
                                    </div>

                                    <InputField
                                        name="address"
                                        placeholder="Address"
                                        value={formState.address}
                                        onChange={handleInputChange}
                                        icon={<SlLocationPin />}
                                    />

                                    <InputField
                                        name="property_number"
                                        placeholder="Property Number"
                                        value={formState.property_number}
                                        onChange={handleInputChange}
                                        icon={<BsHouseDoor />}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 w-full bg-black text-white font-semibold py-2 rounded-lg"
                                >
                                    {loading ? "Creating..." : "Create Account"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
    );

};

const InputField = (
    { type = "text", name, placeholder, value, onChange, icon,}: 
    { type?: string; name: string; placeholder: string; value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; icon?: React.ReactNode;
    }) => (
    <div className="relative w-full">
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 text-black outline-none focus:border-primary"
            required
        />
        {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                {icon}
            </div>
        )}
    </div>
);


export default CreateResident;
