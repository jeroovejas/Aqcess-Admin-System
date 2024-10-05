"use client"
import React, { useState, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { resetPassword } from "@/lib/api/auth";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useRouter } from 'next/navigation';
import { TfiEmail } from "react-icons/tfi";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

interface newPasswordFormState {

  email: string;
  new_password: string;
  confirm_password: string;

}



const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [formState, setFormState] = useState<newPasswordFormState>({
    email: '',
    new_password: '',
    confirm_password: '',

  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await resetPassword(formState);
      if (response.success) {
        router.push("/auth/signin")
        setTimeout(() => {
          showSuccessToast(response.data.message);
        }, 2000);
      } else {
        showErrorToast(response.data.message)
      }

    } catch (err: any) {
      console.error('Unexpected error during Password reset:', err.message);
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
                Set up new password
              </h2>
              <div className="mt-4 mb-6">
                <p>Welcome back! Let secure your account by setting up a new password.</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder=" Your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-3">
                      <TfiEmail size={24} className="text-[#C4CBD4]" />
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={show1 === false ? 'password' : 'text'}
                      name="new_password"
                      value={formState.new_password}
                      onChange={handleInputChange}
                      placeholder="New Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-3 cursor-pointer">
                      {show1 === true
                        ? <IoMdEyeOff size={24} className="text-[#C4CBD4]" onClick={() => { setShow1(!show1) }} /> :
                        <IoMdEye size={24} className="text-[#C4CBD4]" onClick={() => { setShow1(!show1) }} />}
                    </span>
                  </div>
                </div>

                {/* <div className="mb-4">
                <p>Password must be at least 8 characters long</p>
              </div> */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type={show2 === false ? 'password' : 'text'}
                      name="confirm_password"
                      value={formState.confirm_password}
                      onChange={handleInputChange}
                      placeholder="Confirm new Password"
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-3 cursor-pointer">
                      {show2 === true
                        ? <IoMdEyeOff size={24} className="text-[#C4CBD4]" onClick={() => { setShow2(!show2) }} /> :
                        <IoMdEye size={24} className="text-[#C4CBD4]" onClick={() => { setShow2(!show2) }} />}
                    </span>
                  </div>
                </div>

                <div className="mb-16">
                  <input
                    type="submit"
                    value="Create new password"
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

export default ResetPassword;