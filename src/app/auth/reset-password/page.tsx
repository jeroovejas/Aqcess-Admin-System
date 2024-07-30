import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Closed Gate Communities | Reset Password",
  description: "Closed Gate Communities Reset Password Page",
  // other metadata
};

const SignUp: React.FC = () => {
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
                Restore password
              </h2>
              <div className="mt-4 mb-6">
                <p>Enter your email address below. and we'll send you a link to reset your password.</p>
              </div>
              <div className="mb-6">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder=" Your email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-3">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              <form>
                <div className="mb-16">
                  <input
                    type="submit"
                    value="Sent reset link"
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

export default SignUp;