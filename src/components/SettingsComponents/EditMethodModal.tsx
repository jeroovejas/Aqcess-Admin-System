"use client"
import React, { useState, useEffect, useRef } from "react";
import { toggleEditMethodModal, toggleIsUpdated } from "@/store/Slices/SettingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { editAdminCard, getCardDetail } from "@/lib/api/payment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

interface FormState {
    card_holder_name: string;
    expiry_month: string;
    expiry_year: string;
    card_number: string;
    cvc: string;
    invoicing_email: string;
    invoicing_address: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
}

const initialFormState = {
    card_holder_name: "",
    expiry_month: "",
    expiry_year: "",
    card_number: "",
    cvc: "",
    invoicing_email: "",
    invoicing_address: "",
    city: "",
    postcode: "",
    state: "",
    country: "Estonia",
};

const EditMethodModal: React.FC<any> = () => { 
          const t = useTranslations();
    
    const editMethod = useAppSelector((state) => state.setting.editMethod);
    const cardData = useAppSelector((state) => state.setting.cardData);
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch();

    // Initial form state
    const [formState, setFormState] = useState<FormState>(initialFormState);

    // Generic onChange handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault(); // Prevent default form submission
        try {
            const body = {
                ...formState,
                card_id: cardData.id,
                token: token
            };
            const response = await editAdminCard(body);
            if (response.success) {
                dispatch(toggleEditMethodModal());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
                setFormState(initialFormState);
            } else {
                showErrorToast(response.data.message);
            }
        } catch (err: any) {
            console.error('Unexpected error during editing card:', err.message);
        } finally {
            setLoading(false)
        }
    };



    useEffect(() => {
        if (cardData) {
            fetchCardDetail()
        }
    }, [cardData]);

    const fetchCardDetail = async () => {
        const params = { id: cardData.id, token: token }
        const response = await getCardDetail(params);

        // Check the success property to determine if the request was successful
        if (response.success) {
            setFormState({
                card_holder_name: response.data.data.cardHolderName || "",
                card_number: response.data.data.cardNumber || "",
                expiry_year: JSON.stringify(response.data.data.expiryYear) || "",
                expiry_month: JSON.stringify(response.data.data.expiryMonth) || "",
                cvc: JSON.stringify(response.data.data.cvc) || "",
                invoicing_email: response.data.data.invoicingEmail || "",
                invoicing_address: response.data.data.invoicingAddress || "",
                city: response.data.data.city || "",
                postcode: response.data.data.postcode || "",
                state: response.data.data.state || "",
                country: response.data.data.country || "Estonia",
            });
        }
    }
    return (
        <>
            {editMethod ? (
                <>
                    <div className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
                        <div className="flex justify-between items-center mt-8">
                            <h3 className="text-3xl font-semibold">{t('PAYMENTBILLING.editTitle')}</h3>
                            <button
                                className="bg-transparent border-0 text-[20px] font-bold text-black"
                                onClick={() => dispatch(toggleEditMethodModal())}
                            >
                                x
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="w-full my-6">
                                {/* <div className="relative">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="paymentMethod">
                                    Payment Method
                                </label>
                                <select
                                    className="block appearance-none w-full rounded-lg border border-[#DDDDDD] text-black py-3 px-4 pr-8 mb-3 focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formState.paymentMethod}
                                    onChange={handleChange}
                                >
                                    <option value="Card/Debit Card">Card/Debit Card</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div> */}

                                <div className="w-full flex gap-x-4">
                                    <div className="w-full">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="cardName">
                                        {t('PAYMENTBILLING.title1')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="card_holder_name"
                                            name="card_holder_name"
                                            placeholder={t('PAYMENTBILLING.lable1')}
                                            value={formState.card_holder_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-x-4">
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="cardName">
                                        {t('PAYMENTBILLING.title2')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="expiry_month"
                                            name="expiry_month"
                                            placeholder={t('PAYMENTBILLING.lable2')}
                                            value={formState.expiry_month}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="expiry">
                                        {t('PAYMENTBILLING.title3')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="expiry_year"
                                            name="expiry_year"
                                            placeholder={t('PAYMENTBILLING.lable3')}
                                            value={formState.expiry_year}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-x-4">
                                    <div className="w-3/4">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="cardNumber">
                                        {t('PAYMENTBILLING.title4')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="card_number"
                                            name="card_number"
                                            placeholder={t('PAYMENTBILLING.lable4')}
                                            value={formState.card_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-1/4">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="cvv">
                                        {t('PAYMENTBILLING.title5')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="cvc"
                                            name="cvc"
                                            placeholder={t('PAYMENTBILLING.lable5')}
                                            value={formState.cvc}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="invoicingEmail">
                                    {t('PAYMENTBILLING.title6')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="email"
                                        id="invoicing_email"
                                        name="invoicing_email"
                                        placeholder={t('PAYMENTBILLING.lable6')}
                                        value={formState.invoicing_email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="invoicingAddress">
                                    {t('PAYMENTBILLING.title7')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                        type="text"
                                        id="invoicing_address"
                                        name="invoicing_address"
                                        placeholder={t('PAYMENTBILLING.lable7')}
                                        value={formState.invoicing_address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="w-full flex gap-x-4">
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="city">
                                        {t('PAYMENTBILLING.title8')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="city"
                                            name="city"
                                            placeholder={t('PAYMENTBILLING.lable8')}
                                            value={formState.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="postCode">
                                        {t('PAYMENTBILLING.title9')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="postcode"
                                            name="postcode"
                                            placeholder={t('PAYMENTBILLING.lable9')}
                                            value={formState.postcode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-x-4">
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="stateOrProvince">
                                        {t('PAYMENTBILLING.title10')}
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="text"
                                            id="state"
                                            name="state"
                                            placeholder={t('PAYMENTBILLING.lable10')}
                                            value={formState.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <div className="relative">
                                            <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="country">
                                            {t('PAYMENTBILLING.title11')}
                                            </label>
                                            <select
                                                className="block appearance-none w-full rounded-lg border border-[#DDDDDD] text-black py-2.5 px-4 pr-8 mb-3 focus:outline-none focus:bg-white focus:border-gray-500"
                                                id="country"
                                                name="country"
                                                value={formState.country}
                                                onChange={handleChange}
                                            >
                                                <option value="Estonia">Estonia</option>
                                                <option value="USA">USA</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 items-center">
                                <button
                                    className="text-white rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3  outline-none mr-1 mb-1"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PAYMENTBILLING.button3')}`}

                                </button>
                                <button
                                    className=" border rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleEditMethodModal())}
                                >
                                    {t('PAYMENTBILLING.button1')}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default EditMethodModal;
