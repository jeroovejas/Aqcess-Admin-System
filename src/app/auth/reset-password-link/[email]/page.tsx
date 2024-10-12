"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from 'next/navigation';



const ResetPasswordLink: React.FC = () => {
  const { email } = useParams()
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
                Password reset link sent
              </h2>
              <div className="mt-4 mb-6">
                <p>We have just sent a password reset link to the email address associated. Check Your inbox for further instructions.</p>
              </div>

              <div className="mb-16">
                <Link
                  href={`/auth/reset-password/${email}`}
                  className="w-full flex items-center justify-center cursor-pointer rounded-lg font-bold bg-[#1D2C3E] px-4 py-2.5 text-white transition hover:bg-opacity-90"
                >
                  Back
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordLink;