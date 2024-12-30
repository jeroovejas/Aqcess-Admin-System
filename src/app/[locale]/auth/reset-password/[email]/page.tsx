"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
// import Link from "next/link";
import Image from "next/image";
import { resetPassword, verifyPasswordLink } from "@/lib/api/auth";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
// import { useRouter } from 'next/navigation';
import Loader from "@/components/common/Loader";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useParams } from 'next/navigation';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link, usePathname, useRouter } from '@/navigation';

interface newPasswordFormState {

  // email: string;
  new_password: string;
  confirm_password: string;

}



const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const { email }: any = useParams()
  const userEmail = Buffer.from(email, 'base64').toString('ascii')
  const [formState, setFormState] = useState<newPasswordFormState>({
    // email: '',
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

  const validatePassword = (password: any, confirmPassword: any) => {
    // Check for minimum length
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";

    }
    // Check for at least one capital letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";

    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";

    }
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";

    }
    // Check if passwords match
    if (password !== confirmPassword) {
      return "Passwords and confirm password do not match.";

    }
    return "";
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    const errorMessage = validatePassword(formState.new_password, formState.confirm_password)
    if (errorMessage || errorMessage !== '') {
      setPasswordError(errorMessage)
      return
    }
    setLoading(true)
    try {
      const body = {
        ...formState,
        email: userEmail
      };
      const response = await resetPassword(body);
      if (response.success) {
        router.push("/auth/login")
        setTimeout(() => {
          showSuccessToast(response.data.message);
        }, 2000);
      } else {
        showErrorToast(response.data.message)
      }

    } catch (err: any) {
      console.error('Unexpected error during Password reset:', err.message);
    } finally {
      setLoading(false)
    }
  };

  const getVerification = async () => {
    try {
      let body = { email: userEmail }
      const response = await verifyPasswordLink(body);
      if (response.success) {
        showSuccessToast(response.data.message);
      } else {
        router.push("/auth/forgot-password")
        setTimeout(() => {
          showErrorToast(response.data.message)
        }, 2000)

      }

    } catch (err: any) {
      console.error('Unexpected error during password link verification:', err.message);
    }
  };

  useEffect(() => {
    setLoading1(true);
    getVerification().finally(() => {
      setLoading1(false);
    });

  }, [email])
  return (


    loading1 ? (
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
                  {/* <div className="mb-4">
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
                </div> */}
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
                  {passwordError && <p className="text-red text-sm font-semibold mb-2">{passwordError}</p>}

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
                  <div className="mb-5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center cursor-pointer rounded-lg font-bold bg-[#1D2C3E] px-4 py-2.5 text-white transition hover:bg-opacity-90"
                    >
                      {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : "Create new password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ResetPassword;