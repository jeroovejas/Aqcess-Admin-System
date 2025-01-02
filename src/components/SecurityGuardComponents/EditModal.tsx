import React, { useState, useEffect, useRef } from 'react';
import { toggleEditModal, toggleSaveModal, toggleDeleteModal, setSecurityGuardData } from "@/store/Slices/SecurityGuardSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useLocale, useTranslations } from 'next-intl';


const EditModal: React.FC<any> = () => { 
      const t = useTranslations(); 
    
    const STATUS_OPTIONS = ['active', 'deactivated'];
    const editModal = useAppSelector((state) => state.securityGuard.editModal);
    const securityGuardData = useAppSelector((state) => state.securityGuard.securityGuardData);
    const dispatch = useAppDispatch();
    const [pinError, setPinError] = useState('');
    const [formData, setFormData] = useState({
        security_guard_id: 0,
        status: "",
        first_name: "",
        last_name: "",
        address: "",
        email: "",
        password: "",
        internal_notes: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const validatePin = (password: any) => {
        // If the password is empty, return early without running any checks
        if (password === "") {
            setPinError(""); // Optionally reset any existing error if the password is empty
            return "";
        }

        // Check if password contains only digits
        const digitRegex = /^\d+$/; // This checks for only digits (no letters or special characters)
        if (!digitRegex.test(password)) {
            return "Pin must contain only digits.";
        }

        // Check if password has exactly 4 digits
        if (password.length !== 4) {
            return "Pin must be exactly 4 digits long.";
        }

        // If all checks pass, clear any error and return an empty string
        setPinError("");
        return "";
    };

    const saveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errorMessage = validatePin(formData.password)
        if (errorMessage || errorMessage !== '') {
            setPinError(errorMessage)
            return
        }
        dispatch(setSecurityGuardData(formData));
        dispatch(toggleEditModal());
        dispatch(toggleSaveModal());
    };

    const deleteResident = () => {
        // dispatch(toggleEditModal());
        dispatch(toggleDeleteModal());
    };
    useEffect(() => {
        if (securityGuardData) {
            setFormData({
                security_guard_id: securityGuardData.id,
                status: securityGuardData.status || "",
                first_name: securityGuardData.firstName || "",
                last_name: securityGuardData.lastName || "",
                address: securityGuardData.securityGuard?.address || "",
                email: securityGuardData.email || "",
                password: "",
                internal_notes: securityGuardData.securityGuard?.internalNotes || "",
            });
        }
    }, [securityGuardData]);

    function capitalizeFirstLetter(str: any) {
        if (typeof str !== 'string' || str.length === 0) return str; // Check for valid string input
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <>
            {editModal ? (
                <>
                    <div className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
                        <div className="flex justify-between items-center mt-8">
                            <h3 className="text-3xl font-semibold">{t('SECURITY.button2Modal.editTitle')}</h3>
                            <button className="bg-transparent border-0 text-[20px] font-bold text-black" onClick={() => dispatch(toggleEditModal())}>x</button>
                        </div>
                        <form onSubmit={saveChanges}>
                            <div className="w-full my-6">
                                <div className="relative">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-state">{t('SECURITY.button2Modal.status')}</label>
                                    <select value={formData.status} name="status" onChange={handleChange} className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8 focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                        {STATUS_OPTIONS.map(option => (
                                            <option key={option} value={option}>{capitalizeFirstLetter(option)}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-first-name">{t('SECURITY.button2Modal.lable1')}</label>
                                        <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="First Name" name={t('SECURITY.button2Modal.lable1')} value={formData.first_name} onChange={handleChange} required />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-last-name">{t('SECURITY.button2Modal.lable2')}</label>
                                        <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Last Name" name={t('SECURITY.button2Modal.lable2')} value={formData.last_name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-address">{t('SECURITY.button2Modal.lable3')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" name="address" placeholder={t('SECURITY.button2Modal.lable3')} value={formData.address} onChange={handleChange} required />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-address">{t('SECURITY.button2Modal.lable4')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" name="address" placeholder={t('SECURITY.button2Modal.lable4')} value={securityGuardData.phoneNumber} readOnly />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-email">{t('SECURITY.button2Modal.lable5')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="email" name="email" placeholder={t('SECURITY.button2Modal.lable5')} value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-password">{t('SECURITY.button2Modal.lable6')}</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="password" type="password" placeholder={t('SECURITY.button2Modal.lable6')} value={formData.password} onChange={handleChange} />
                                </div>
                                {pinError && <p className="text-red text-sm font-semibold mb-2">{pinError}</p>}
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-notes">{t('SECURITY.button2Modal.lable7')}</label>
                                    <textarea className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="internal_notes" placeholder={t('SECURITY.button2Modal.lable8')} value={formData.internal_notes} onChange={handleChange} rows={5} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <button className="text-white rounded-lg bg-primary-blue font-medium  text-sm px-4 py-2.5  outline-none  mr-1 mb-1" type="submit" >{t('SECURITY.button2Modal.button2')}</button>

                                    <button className="border rounded-lg border-[#DDDDDD] bg-transparent font-medium  px-4 py-2.5 text-sm outline-none  ml-1 mb-1" type="button" onClick={() => dispatch(toggleEditModal())}>{t('SECURITY.button2Modal.button1')}</button>
                                </div>
                                <button type="button" onClick={deleteResident} className="text-gray-900 bg-white border rounded-lg border-[#DDDDDD] font-medium text-sm px-4 py-2.5 mb-2 flex items-center">
                                    <RiDeleteBin6Line className="mr-2" />{t('SECURITY.button2Modal.button3')}
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* </div> */}
                </>
            ) : null}
        </>
    );
}

export default EditModal;



