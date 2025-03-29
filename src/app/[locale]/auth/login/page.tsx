"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
// import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/lib/api/auth";
// import { useRouter } from 'next/navigation';
import { showErrorToast } from "@/lib/toastUtil";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setToken, toggleEmailModal } from "@/store/Slices/AuthSlice";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { TfiEmail } from "react-icons/tfi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SendEmailModal from "@/components/AuthComponents/sendEmailModal";
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/navigation';
import Loader from "@/components/common/Loader";
import LanguageDropdown from "@/components/language/language";

interface signInFormState {
  email: string;
  password: string;

}

const Login: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [show, setShow] = useState(false);
  const emailModal = useAppSelector((state) => state.auth.emailModal)
  const user = useAppSelector((state) => state.auth.userData)
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch()
  const [formState, setFormState] = useState<signInFormState>({
    email: '',
    password: '',

  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // State to track selected language

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle language change
  const handleLanguageChange = (lang: any) => {
    setSelectedLanguage(lang); // Update the selected language
    setIsOpen(false);  // Close dropdown after selection
    setTimeout(() => {
      let locale: any = lang == "English" ? 'en' : 'es';
      router.replace(pathName, { locale });
    }, 500)
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await signIn(formState);

      // Check the success property to determine if the request was successful
      if (response.success) {
        let token = "Bearer " + response.data.accessToken;
        dispatch(setToken(token))
        if (response.data.data.role === 1) {
          router.push('/user-management');
        } else {
          router.push('/dashboard');
        }
        // setTimeout(() => {
        //   showSuccessToast("Success ! Welcome back")
        // }, 2000);
      } else {
        if (response.data.message === 'Verify you email') {
          dispatch(toggleEmailModal())
          showErrorToast(response.data.message)
        } else {
          showErrorToast(response.data.message)
        }
      }
    } catch (err: any) {
      console.error('Unexpected error during sign in:', err.message);
    }
    finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    const checkLoggoedInUser = async () => {
      if (Object.entries(user).length !== 0 && user.role !== undefined && user.role) {
        if (user.role === 1) {
          router.push('/user-management');
        } else {
          router.push('/dashboard');
        }
      } else {
        setVerified(true)
      }
    }
    checkLoggoedInUser()
  }, [router])

  if (verified === null) {
    return <Loader />
  }
  return (

    <>
      {verified ? (
        <div className="rounded-sm min-h-[100vh] bg-[url('/images/main/aqcess-bg-image.JPG')] bg-center bg-cover bg-no-repeat ">
          <div className="flex flex-wrap">
            <div className="w-full text-white">
              <div className="relative px-5 md:px-10 flex justify-between items-center">
                <Link className="" href="/">
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
            </div>
            <div className="w-full flex justify-center px-5 md:px-10">
              <div className="bg-white md:w-2/3 lg:w-1/2 xl:w-5/12 w-full mt-10 rounded-md">
                <div className="w-full p-12 md:p-17.5">
                  <h2 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    {t('SIGNIN.title')}
                  </h2>
                  <div className="mb-4  ">
                    <p>
                      {t('SIGNIN.account')}{" "}
                      <Link href="/auth/register" className="text-[#475467] font-bold">
                        {t('SIGNIN.signUp')}
                      </Link>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <div className="relative">
                        <input
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          type="email"
                          placeholder={t('SIGNIN.email')}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                        />

                        <span className="absolute right-4 top-2">
                          <TfiEmail size={24} className="text-[#C4CBD4]" />
                        </span>
                      </div>
                    </div>

                    <div className="">
                      <div className="relative">
                        <input
                          name="password"
                          value={formState.password}
                          onChange={handleInputChange}
                          type={show === false ? 'password' : 'text'}
                          placeholder={t('SIGNIN.password')}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          required
                        />


                        <span className="absolute right-4 top-2">
                          {show === true
                            ? <IoMdEyeOff size={24} className="text-[#C4CBD4]" onClick={() => { setShow(!show) }} /> :
                            <IoMdEye size={24} className="text-[#C4CBD4]" onClick={() => { setShow(!show) }} />}
                        </span>
                      </div>
                    </div>
                    {/* <p className="mb-5 block font-medium text-gray-700 dark:text-white mt-1">
                  Password must be at least 8 characters long
                </p> */}

                    <div className="mb-6">
                    </div>
                    <div className="flex items-center mb-5">
                      <Link href={"/auth/forgot-password"} className="text-base font-semibold text-gray-900 dark:text-gray-300">{t('SIGNIN.forget')}</Link>
                    </div>
                    <div className="mb-5">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center cursor-pointer rounded-lg font-bold bg-[#1D2C3E] px-4 py-2.5 text-white transition hover:bg-opacity-90"
                      >
                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('SIGNIN.title')}`}
                      </button>
                    </div>

                    {/* <button className="flex w-full font-semibold items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray px-4 py-2.5 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
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
                  Sign in with Google
                </button> */}


                  </form>
                </div>
              </div>
            </div>
          </div>
          {(emailModal) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
          </div>}
          <SendEmailModal email={formState.email} />
        </div>
      ) : null}
    </>
  );
};

export default Login;
