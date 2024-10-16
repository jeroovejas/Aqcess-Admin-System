"use client"
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";


const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.userData);
  const [redirect, setRedirect] = useState(false);

  // const handleRedirect = () => {
  //   setRedirect(true)
  //   router.push('/auth/login')
  // }

  const handleSendEmail = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/email', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        showSuccessToast('Email sent successfully!');
      } else {
        showErrorToast(`Failed to send email: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showErrorToast('An error occurred while sending the email.');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="rounded-sm bg-[url('/images/Authentication/background.jpg')] bg-center bg-no-repeat min-h-[100vh] ">
      <div className="flex flex-wrap py-[61px]">
        <div className="w-full xl:block xl:w-1/2 text-white">
          <div className="px-26 2xsm:px-10 mt-8 2xsm:mb-10 3xsm:px-4 3xsm:mb-10 4xsm:px-6 4xsm:mb-10">
            <Link className=" inline-block" href="/">
              <Image
                className=""
                src={"/images/Authentication/logo.png"}
                alt="Logo"
                height={80}
                width={80}
              />
            </Link>
            <h1 className="text-4xl mt-12 font-bold">Join Our Community</h1>
            <h1 className="text-4xl font-bold">Management App</h1>
            <p className="text-xl mt-4">
              Simplify payment management and stay connected with your residents!
            </p>
            <div className="flex items-center gap-4 mt-12">
              <div className="bg-blue-700 rounded-full p-1">
                <FaCheck className="" size={15} />
              </div>
              <div>
                <p className="text-lg font-bold">Effortless Payment Management</p>
                <p className="text-md ">Manage fees and track payments in one place</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="bg-blue-700 rounded-full p-1">
                <FaCheck className="" size={15} />
              </div>
              <div>
                <p className="text-lg font-bold">Stay Connected</p>
                <p className="text-md text-[#D0D5DD] ">Send important notifications and receive resident’s message</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="bg-blue-700 rounded-full p-1">
                <FaCheck className="" size={15} />
              </div>
              <div>
                <p className="text-lg font-bold">Gather Resident Feedback</p>
                <p className="text-md text-[#D0D5DD]">Create surveys and receive valuable feedback to improve community living</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-1/2 ">
          <div className="bg-white sm:mx-20 mx-28 2xsm:mx-10 3xsm:mx-4 4xsm:mx-6 mt-36 2xsm:mt-6 3xsm:mt-6 4xsm:mt-6  rounded-md">

            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mt-10 mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Verify Your email
              </h2>
              <div className="mt-8 mb-8">
                <p>We have sent a verification email to <span className="font-bold text-black">{user.email}</span> Please check your email for further instructions.</p>
              </div>
              <button
                onClick={handleSendEmail}
                disabled={loading}
                // disabled={redirect}
                className="text-center w-full block cursor-pointer rounded-lg font-bold bg-[#1D2C3E] px-4 py-2.5 text-white transition hover:bg-opacity-90"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default VerifyEmail;
