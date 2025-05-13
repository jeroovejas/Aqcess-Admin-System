"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
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
import { RiCommunityFill } from "react-icons/ri";
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter, usePathname } from '@/navigation';
import { useSearchParams } from "next/navigation";
import LanguageDropdown from "@/components/language/language";
import { getPackageDetail } from "@/lib/api/package";
import { RiDeleteBin6Line } from "react-icons/ri";
import StripeModal from "@/components/Stripe/checkoutForm";
import { Ellipsis } from "lucide-react";


interface signUpFormState {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  login_type: string;
  package_id: number
  community_name: string
  community_logo: File | null
}

interface Package {
  id: number,
  type: string,
  price: number,
  createdAt: string
}

const Register: React.FC = () => {

  const pathName = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [isChecked, setIsChecked] = useState(false);
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const premiumPackageId = searchParams.get('id');
  const [formState, setFormState] = useState<signUpFormState>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    login_type: 'Email',
    package_id: 1,
    community_name: '',
    community_logo: null,
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const deleteImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setFormState((prevValues) => ({
      ...prevValues,
      community_logo: null,
    }));
    setImagePreview(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prevValues) => ({
          ...prevValues,
          community_logo: file,
        }));
        setImagePreview(reader.result as string)
      };
      reader.readAsDataURL(file);
    } else {
      setFormState((prevValues) => ({
        ...prevValues,
        community_logo: null,
      }));
      setImagePreview(null)
    }
  }

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
    handleRegister();
  };

  const handleRegister = async () => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('first_name', formState.first_name);
      formData.append('last_name', formState.last_name);
      formData.append('email', formState.email);
      formData.append('password', formState.password);
      formData.append('confirm_password', formState.confirm_password);
      formData.append('login_type', formState.login_type);
      formData.append('community_name', formState.community_name);
      formData.append("package_id", String(1));
      // formData.append("package_id", String(formState.package_id));
      if (formState.community_logo) {
        formData.append('community_logo', formState.community_logo);
      }
      const response = await signUp(formData);
      // Check the success property to determine if the request was successful
      if (response.success) {
        const emailResponse = await sendEmail({ email: formState.email });
        if (emailResponse.success) {
          dispatch(setUserData(response.data.data));

          if (premiumPackageId) {
            console.log("Premium Package Id not found");

            const base64Id = decodeURIComponent(premiumPackageId);
            const packageId = Buffer.from(base64Id, 'base64').toString('utf-8');
            console.log("Decode The packageId");
            console.log(packageId);
            
            if (parseInt(packageId) != 1) {
            console.log("Invalid Package Id");

              const res = await fetch(`/${locale}/api/create-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formState.email }),
              });
              const data = await res.json();
              window.location.href = data.url;
            } else {
              router.push('/auth/verify-email');
            }
          } else {
            router.push('/auth/verify-email');
          }
        } else {
          showErrorToast(emailResponse.data.message)
        }
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during sign up:', err.message);
    } finally {
      setLoading(false)
    }
  }

  const fetchPackageDetail = async (id: number) => {
    try {
      let params = { id: id }
      const response = await getPackageDetail(params);

      if (response.success) {
        setPackageData(response.data.data)
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during security guards Fetch:', err.message);
    }
  }

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setFormState(prevState => ({
        ...prevState,
        package_id: parseInt(id as string)
      }));
      if (id == '2') {
        fetchPackageDetail(parseInt(id as string))
      }
    }

  }, [searchParams]);
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

                <div className="mb-4">
                  <div className="relative">
                    <input
                      name="community_name"
                      value={formState.community_name}
                      onChange={handleInputChange}
                      type="text"
                      placeholder={t('SIGNUP.communityName')}
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-2">
                      <RiCommunityFill size={24} className="text-[#C4CBD4]" />
                    </span>
                  </div>
                </div>

                <div className="w-full mb-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="community_logo"
                      className="flex flex-col items-center justify-center w-full h-40 border-gray-300 border border-stroke rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-full">

                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                          <button onClick={deleteImage} className="absolute right-2 top-2 bg-[#D0D5DD] rounded-[8px] text-slate-950 p-2">
                            <RiDeleteBin6Line size={15} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">{t('SIGNUP.label5')}</span> {t('AREA.button1Modal.label6')}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('AREA.button1Modal.label7')}
                          </p>
                        </div>
                      )}
                      <input
                        id="community_logo"
                        type="file"
                        name="community_logo"
                        className="hidden"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
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
              </form>
            </div>
          </div>
        </div>


      </div>


    </div>
  );
};

export default Register;
