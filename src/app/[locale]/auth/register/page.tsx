"use client"
import React, { useState, ChangeEvent } from "react";
// import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import { sendEmail, signUp } from "@/lib/api/auth";
// import { useRouter } from 'next/navigation';
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/Slices/AuthSlice";
import { FiUser } from "react-icons/fi";
import { TfiEmail } from "react-icons/tfi";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/navigation';
import LanguageDropdown from "@/components/language/language";


interface signUpFormState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  login_type: string;

}

const Register: React.FC = () => {

  const pathName = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [passwordLength, setPasswordLength] = useState<number>(0);
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [formState, setFormState] = useState<signUpFormState>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    login_type: 'Email'

  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
    // if (name === 'password') {
    //   setPasswordLength(value.length);
    // }
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
      return "Password and confirm password do not match.";

    }
    setPasswordError("")
    return "";
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    setError('')
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isChecked) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    const errorMessage = validatePassword(formState.password, formState.confirm_password)
    if (errorMessage || errorMessage !== '') {
      setPasswordError(errorMessage)
      return
    }
    setLoading(true)
    try {
      const response = await signUp(formState);
      // Check the success property to determine if the request was successful
      if (response.success) {
        const emailResponse = await sendEmail({ email: formState.email });
        if (emailResponse.success) {
          dispatch(setUserData(response.data.data))
          router.push('/auth/verify-email');
        } else {
          showErrorToast(emailResponse.data.message)
        }

        // setTimeout(() => {
        //   showSuccessToast("Welcome ! Successfully Signed Up")
        // }, 2000);
      } else {
        showErrorToast(response.data.message)
        // if (response.data.message == 'Please verify your email first.') {
        //   router.push('/auth/verify-email');
        //   setTimeout(() => {
        //     showErrorToast(response.data.message)
        //   }, 2000);

        // } else {
        //   showErrorToast(response.data.message)
        // }
      }
    } catch (err: any) {
      console.error('Unexpected error during sign up:', err.message);
    } finally {
      setLoading(false)
    }

  };
  return (

    <div className="rounded-sm min-h-[100vh]  bg-[url('/images/main/aqcess-bg-image.JPG')] bg-center bg-cover bg-no-repeat ">
      <div className="flex flex-wrap py-[61px] ">
        <div className="w-full xl:block lg:w-1/2 text-white">
          <div className="md:px-26 px-10  mt-2 ">
            <div className="flex justify-start items-center gap-5">
              <Link className=" inline-block" href="/">
                <Image
                  className=""
                  src={"/images/main/logo.png"}
                  alt="Logo"
                  height={150}
                  width={150}
                />
              </Link>
              <LanguageDropdown />
            </div>

            <h1 className="text-4xl mt-2 font-bold">{t('SIGNUP.title1')}</h1>
            <h1 className="text-4xl font-bold">{t('SIGNUP.title2')}</h1>
            <p className="text-xl mt-4">
              {t('SIGNUP.title3')}
            </p>
            <div className="flex items-center gap-4 mt-12">
              <div className="bg-blue-700 rounded-full p-1">
                <FaCheck className="" size={15} />
              </div>
              <div>
                <p className="text-lg font-bold">{t('SIGNUP.title4')}</p>
                <p className="text-md">{t('SIGNUP.title5')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="bg-blue-700 rounded-full p-1">
                <FaCheck className="" size={15} />
              </div>
              <div>
                <p className="text-lg font-bold">{t('SIGNUP.title6')}</p>
                <p className="text-md text-[#D0D5DD] ">{t('SIGNUP.title7')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="bg-blue-700 rounded-full p-1">
                <FaCheck className="" size={15} />
              </div>
              <div>
                <p className="text-lg font-bold">{t('SIGNUP.title8')}</p>
                <p className="text-md text-[#D0D5DD]">{t('SIGNUP.title9')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-white  mx-10 md:mx-26 lg:mx-10 xl:mx-26  mt-8 md:rounded-md rounded-xl">
            <div className="w-full p-8 md:p-17.5 lg:p-16">
              <h2 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                {t('SIGNUP.title')}
              </h2>
              <div className="mb-4  ">
                <p>
                  {t('SIGNUP.account')}{" "}
                  <Link href="/auth/login" className="text-[#475467] font-bold">
                    {t('SIGNUP.signIn')}
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap">
                  <div className="mb-4 w-full md:w-1/2 lg:w-full xl:w-1/2">
                    <div className="relative md:me-2 lg:me-0 xl:me-2">
                      <input
                        type="text"
                        name="first_name"
                        value={formState.first_name}
                        onChange={handleInputChange}
                        placeholder={t('SIGNUP.firstName')}
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-6 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                      />

                      <span className="absolute right-4 top-2">
                        <FiUser size={24} className="text-[#C4CBD4]" />
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 w-full md:w-1/2 lg:w-full xl:w-1/2">
                    <div className="relative">
                      <input
                        type="text"
                        name="last_name"
                        value={formState.last_name}
                        onChange={handleInputChange}
                        placeholder={t('SIGNUP.lastName')}
                        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required

                      />

                      <span className="absolute right-4 top-2">
                        <FiUser size={24} className="text-[#C4CBD4]" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder={t('SIGNUP.email')}
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-2">
                      <TfiEmail size={24} className="text-[#C4CBD4]" />
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <input
                      name="password"
                      value={formState.password}
                      onChange={handleInputChange}
                      type={show1 === false ? 'password' : 'text'}
                      placeholder={t('SIGNUP.password')}
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-2">
                      {show1 === true
                        ? <IoMdEyeOff size={24} className="text-[#C4CBD4]" onClick={() => { setShow1(!show1) }} /> :
                        <IoMdEye size={24} className="text-[#C4CBD4]" onClick={() => { setShow1(!show1) }} />}
                    </span>
                  </div>
                </div>
                {/* {passwordLength > 0 && passwordLength <= 8 && (
                  <p className="mb-2">
                    Password must be at least 8 characters long!
                  </p>
                )} */}
                {passwordError && <p className="text-red text-sm font-semibold mb-2">{passwordError}</p>}

                <div className="mb-4">
                  <div className="relative">
                    <input
                      name="confirm_password"
                      value={formState.confirm_password}
                      onChange={handleInputChange}
                      type={show2 === false ? 'password' : 'text'}
                      placeholder={t('SIGNUP.confirmPassword')}
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-2">
                      {show2 === true
                        ? <IoMdEyeOff size={24} className="text-[#C4CBD4]" onClick={() => { setShow2(!show2) }} /> :
                        <IoMdEye size={24} className="text-[#C4CBD4]" onClick={() => { setShow2(!show2) }} />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <input id="default-checkbox" type="checkbox" value="" checked={isChecked}
                    onChange={handleCheckboxChange} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded outline-none  dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{t('SIGNUP.check')}</label>
                </div>
                {error && <p className="text-red text-sm font-semibold mb-2">{error}</p>}

                <div className="mb-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center cursor-pointer rounded-lg font-bold bg-[#1D2C3E] px-4 py-2.5 text-white transition hover:bg-opacity-90"
                  >
                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SIGNUP.title')}`}
                  </button>
                </div>


                {/* <button className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray px-4 py-2.5 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
                  <span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_191_13499)">
                        <path
                          d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_191_13499">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Sign up with Google
                </button> */}


              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
