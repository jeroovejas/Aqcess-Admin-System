"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { verifyPasswordOTP } from "@/lib/api/auth";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useRouter } from 'next/navigation';
import { CiBarcode } from "react-icons/ci";

const VerifyPasswordOTP: React.FC = () => {
    const router = useRouter();
    const [otp, setOtp] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(event.target.value); // Update state with the email input value
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        try {
            let params = { otp: otp }
            const response = await verifyPasswordOTP(params);
            if (response.success) {
                router.push("/auth/reset-password")
                setTimeout(() => {
                    showSuccessToast(response.data.message);
                }, 2000);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during Email Verify:', err.message);
        }
    };
    return (

        <div className="rounded-sm h-[100vh] bg-[url('/images/Authentication/background.jpg')] bg-center bg-no-repeat ">
            <div className="flex flex-wrap py-[20px]">
                <div className="w-full xl:block xl:w-1/4 text-white">
                    <div className="px-6 mt-3">
                        <Link className=" inline-block" href="/">
                            <Image
                                className=""
                                src={"/images/Authentication/logo.png"}
                                alt="Logo"
                                height={80}
                                width={80}
                            />
                        </Link>
                    </div>
                </div>
                <div className="w-full xl:w-1/2 ">
                    <div className="bg-white sm:mx-20 mx-28 2xsm:mx-10 3xsm:mx-4 4xsm:mx-6 mt-16 rounded-md">

                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            <h2 className="mt-10 mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                                Verify OTP Code
                            </h2>
                            <div className="mt-4 mb-6">
                                <p>Enter your OTP code to veridy your email</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder=" Your OTP Code"
                                            value={otp}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            required
                                        />

                                        <span className="absolute right-4 top-3">
                                            <CiBarcode size={22} />
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-16">
                                    <input
                                        type="submit"
                                        value="Verify  OTP"
                                        className="w-full cursor-pointer rounded-lg font-bold  bg-[#1D2C3E] px-4 py-2.5 text-white transition hover:bg-opacity-90"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyPasswordOTP;
