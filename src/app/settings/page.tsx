"use client"
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { toggleBillingModal, resetState } from "@/store/Slices/SettingSlice";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FiUser } from "react-icons/fi";
import PaymentAndBilling from "@/components/SettingsComponents/PaymentAndBilling";
import { changePassword, updateProfile } from "@/lib/api/auth";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { setUserData } from "@/store/Slices/AuthSlice";
import { useRouter } from 'next/navigation';
import Loader from "@/components/common/Loader";

interface SettingsFormState {
  first_name: string;
  last_name: string;
  // email: string;
  profile_image: File | null;
  imagePreview?: string | null;
}
interface PasswordFormState {
  current_password: string;
  new_password: string;
  confirm_password: string;

}

const Settings: React.FC = () => {
  const billingModal = useAppSelector((state) => state.setting.billingModal);
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.userData);
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const [verified, setVerified] = useState<boolean | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [formState, setFormState] = useState<SettingsFormState>({
    first_name: '',
    last_name: '',
    // email: '',
    profile_image: null,
    imagePreview: null,
  });
  const [passwordState, setPasswordState] = useState<PasswordFormState>({
    current_password: '',
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
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPasswordState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prevValues) => ({
          ...prevValues,
          profile_image: file,
          imagePreview: reader.result as string // Set the image preview URL
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormState((prevValues) => ({
        ...prevValues,
        profile_image: null,
        imagePreview: null
      }));
    }
  }
  const handleChangeButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const body = {
        ...passwordState,
        token: token // Add the token here
      };
      const response = await changePassword(body);
      if (response.success) {
        showSuccessToast(response.data.message);
        setPasswordState((prevValues) => ({
          ...prevValues,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
      } else {
        showErrorToast(response.data.message)
      }

    } catch (err: any) {
      console.error('Unexpected error during change password :', err.message);
    }
  };
  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDisabled(true)
    try {
      const formData = new FormData();
      formData.append('first_name', formState.first_name);
      formData.append('last_name', formState.last_name);
      // formData.append('email', formState.email);

      if (formState.profile_image) {
        formData.append('profile_image', formState.profile_image);
      }
      formData.append('token', token);

      const response = await updateProfile(formData);
      if (response.success) {
        showSuccessToast(response.data.message);
        dispatch(setUserData(response.data.data))
        setIsDisabled(false)
      } else {
        showErrorToast(response.data.message)
        setIsDisabled(false)
      }

    } catch (err: any) {
      console.error('Unexpected error during profile update :', err.message);
    }
  };

  useEffect(() => {
    setFormState((prevValues) => ({
      ...prevValues,
      first_name: user.firstName,
      last_name: user.lastName,
      // email: user.email,
      profile_image: null,
      imagePreview: user.profileImage ? user.profileImage : null // Set the image preview URL
    }));
  }, [user])

  console.log(user)

  useEffect(() => {
    dispatch(resetState())
  }, [router])

  useEffect(() => {
    if (isTokenValid) {
      setVerified(true);
    } else {
      router.push('/auth/login');
      // setTimeout(() => {
      //   showErrorToast("Plz Login First");
      // }, 2000);
    }
  }, [isTokenValid, router])



  if (billingModal) {
    return <PaymentAndBilling />
  }
  if (verified === null) {
    return <Loader />
  }
  return (
    <>
      {verified ? (
        <>
          <DefaultLayout>

            <div className="mb-3">

              <h2 className="text-4xl font-bold text-black dark:text-white">
                Settings
              </h2>
            </div>



            <div className="mx-auto">
              <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2   flex items-center mr-4">
                  User Profile
                </button>
                {user.role === 2 ?
                  <div className="mt-1 text-lg font-bold">
                    <button onClick={() => {
                      dispatch(toggleBillingModal())

                    }
                    }>Payment and Billing</button>
                  </div> : null}
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/4 p-2">
                <div>
                  <p className="text-black font-bold">Personal Info</p>
                  <p className="mt-2">Update your photo and personal details.</p>
                </div>
              </div>
              <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                <form onSubmit={handleUpdateProfile}>
                  <div>
                    <div className="w-full flex flex-wrap mb-8 ">
                      <div className="w-full md:w-1/2 md:pe-3 ">

                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="title">
                          First Name
                        </label>
                        <input
                          name="first_name"
                          value={formState.first_name}
                          onChange={handleInputChange}
                          className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          placeholder="Enter First Name"
                          required
                        />
                      </div>
                      <div className="w-full md:w-1/2 md:ps-3 pt-6 md:pt-0">

                        <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="title">
                          Last Name
                        </label>
                        <input
                          name="last_name"
                          value={formState.last_name}
                          onChange={handleInputChange}
                          className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4  leading-tight focus:outline-none focus:bg-white"
                          type="text"
                          placeholder="Enter Last Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="w-full mb-8">
                      <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="description">
                        Email
                      </label>
                      <input
                        name="email"
                        value={user.email}
                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="email"
                        placeholder="Enter Email"
                        readOnly
                      />
                    </div>
                    <div className="w-full mb-8">
                      <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="description">
                        Profile Picture
                      </label>

                      <div className="w-full flex flex-wrap">
                        <div className="w-1/2 md:w-1/6">
                          {formState.imagePreview != null ? (<div className=" ">
                            <img src={formState.imagePreview} alt="Preview" className="w-25 h-25 object-cover rounded-full" />
                          </div>) : (<FiUser size={80} className="bg-[#E2E8F0] rounded-full p-4" />)}
                        </div>

                        <div className="flex items-center w-full mt-4 md:mt-0 md:w-5/6">
                          {formState.imagePreview != null ? (
                            <button onClick={handleChangeButtonClick} type="button" className=" text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
                              Change
                            </button>
                          ) : (
                            <label
                              htmlFor="file"
                              className="flex flex-col items-center justify-center w-full h-50 border-gray-300 border border-[#DDDDDD] rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >

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
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                              </div>

                              <input
                                id="file"
                                type="file"
                                name="profile_image"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </label>
                          )}
                          <input
                            ref={fileInputRef}
                            id="file"
                            type="file"
                            name="profile_image"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-x-4 justify-end">
                      <button type="button" className=" text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
                        Cancel
                      </button>
                      <button disabled={isDisabled} type="submit" className={` text-white bg-primary-blue border-2  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2 ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap my-8">
              <div className="w-full md:w-1/4 p-2">
                <div>
                  <p className="text-black font-bold">Password</p>
                  <p className="mt-2">Change your current password</p>
                </div>
              </div>
              <div className="w-full md:w-3/4 bg-white p-8 rounded-xl">
                <form onSubmit={handleUpdatePassword}>
                  <div className="w-full mb-8">
                    <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="description">
                      Current Password
                    </label>
                    <input
                      name="current_password"
                      value={passwordState.current_password}
                      onChange={handleChange}
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="password"
                      placeholder="Current Password"
                      required
                    />
                  </div>
                  <div className="w-full mb-8">
                    <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="description">
                      New Password
                    </label>
                    <input
                      name="new_password"
                      value={passwordState.new_password}
                      onChange={handleChange}
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4  leading-tight focus:outline-none focus:bg-white"
                      type="password"
                      placeholder="New Password"
                      required
                    />
                    <p className="mb-3 text-[14px]">New password must be at least 8 characters long</p>
                  </div>
                  <div className="w-full mb-8">
                    <label className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2" htmlFor="description">
                      Confirm Password
                    </label>
                    <input
                      name="confirm_password"
                      value={passwordState.confirm_password}
                      onChange={handleChange}
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] text-black rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="password"
                      placeholder=" Confirm Password"
                      required
                    />
                  </div>
                  <div className="flex gap-x-4 justify-end">
                    <button type="button" className=" text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
                      Cancel
                    </button>
                    <button type="submit" className=" text-white bg-primary-blue border-2  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
                      Update Password
                    </button>
                  </div>

                </form>
              </div>

            </div>

          </DefaultLayout >
        </>
      ) : null}
    </>
  );
};

export default Settings;




