"use client"
import React, { useState, useEffect } from "react";
// import Link from "next/link";
import Image from "next/image";
import { verifyEmail } from "@/lib/api/auth";
import { useParams } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/navigation';
import Loader from "@/components/common/Loader";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";


const ConfirmationPage = () => {
  const router = useRouter();
  const { email }: any = useParams()
  const [loading, setLoading] = useState<boolean | null>(false);
  const [errorMessage, setErroMessge] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const getVerification = async () => {
    try {
      const userEmail = Buffer.from(email, 'base64').toString('ascii')
      let body = { email: userEmail }
      const response = await verifyEmail(body);
      setSuccessMessage('');
      setErroMessge('');
      if (response.success) {
        setSuccessMessage(response.data.message);
      } else {
        setErroMessge(response.data.message)
      }

    } catch (err: any) {
      console.error('Unexpected error during email verification:', err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    getVerification().finally(() => {
      setLoading(false);
    });

  }, [email])

  return (
    loading ? (
      <Loader />
    ) : (

      <div className="rounded-sm min-h-[100vh] bg-[url('/images/main/aqcess-bg-image.JPG')] bg-center bg-cover bg-no-repeat ">
        <div className="flex flex-wrap py-[20px]">
          <div className="w-full xl:block xl:w-1/4 text-white">
            <div className="px-10 mt-3">
              <Link className=" inline-block" href="/">
                <Image
                  className=""
                  src={"/images/main/logo.png"}
                  alt="Logo"
                  height={150}
                  width={150}
                />
              </Link>
            </div>
          </div>
          <div className="w-full  xl:w-1/2 ">
            <div className="bg-white mx-16 md:mx-28 2xsm:mx-10 3xsm:mx-4 4xsm:mx-6 mt-48 rounded-md">

              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <div className="mt-4 mb-6 gap-4 flex flex-wrap w-full items-center justify-center">
                  <div className="">{
                    successMessage ?
                      <IoCheckmarkCircle className="w-full text-green-600" size={50} />
                      :
                      <IoIosCloseCircle className="w-full text-danger" size={50} />
                  }
                  </div>
                  <div className="">
                    <p>{successMessage ? successMessage : errorMessage}</p>
                  </div>
                </div>
                <Link
                  href={"/auth/login"}
                  className="w-full block text-center cursor-pointer rounded-lg font-bold  bg-[#1D2C3E] px-4 py-2.5 text-white transition hover:bg-opacity-90"
                >Back </Link>
              </div>
            </div>
          </div>
        </div>
      </div >

    )
  );
};

export default ConfirmationPage;
