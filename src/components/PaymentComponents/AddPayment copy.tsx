"use client";
import React, { useState, useEffect } from "react";
import { toggleAddPayment, toggleIsUpdated } from "@/store/Slices/PaymentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import 'react-phone-number-input/style.css';
import { useTranslations } from 'next-intl';
import { getAllResidentsArray } from "@/lib/api/resident";
import { getAllUserProducts } from "@/lib/api/product";
import { createPayment } from "@/lib/api/payment";


interface residentOptions {
    label: string;
    value: number;
}

interface productOptions {
    id: number;
    title: string;
    price: number;
}

interface FormData {
    residentId: number | null
    productId: number | null
    productMonth: string | null
    productYear: string | null
    amount: number | null
    desc: string
    file: File | null;
    imagePreview?: string | null;
}


const initialFormData: FormData = {
    residentId: null,
    productId: null,
    productMonth: null,
    productYear: null,
    amount: null,
    desc: '',
    file: null,
    imagePreview: null,
};

const AddPayment: React.FC<any> = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations();
    const addPayment = useAppSelector((state) => state.payment.addPayment);
    const token = useAppSelector((state) => state.auth.token);
    const user = useAppSelector((state) => state.auth.userData);
    const [residents, setResidents] = useState<residentOptions[]>([]);
    const [products, setProducts] = useState<productOptions[]>([]);
    const [loading, setLoading] = useState(false);
    const [productMonths, setProductMonths] = useState([]);
    const [ProductYear, setProductYear] = useState(null);
    const [productType, setProductType] = useState('');
    const [formData, setFormData] = useState<FormData>(initialFormData);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'productId') {
            const selectedProduct: any = products.find(product => product.id === Number(value));
            const price = selectedProduct ? selectedProduct.price : null;
            // const productMonth = selectedProduct?.productDetails?.map((item:any)=> item.month);
            setProductMonths(selectedProduct?.productDetails);
            setProductYear(selectedProduct?.productDetails[0]?.year);
            setProductType(selectedProduct.type);
            setFormData(prevData => ({
                ...prevData,
                [name]: Number(value),
                amount: price,
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prevValues) => ({
                    ...prevValues,
                    file,
                    imagePreview: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prevValues) => ({
                ...prevValues,
                file: null,
                imagePreview: null
            }));
        }
    }

    const deleteImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setFormData((prevValues) => ({
            ...prevValues,
            file: null,
            imagePreview: null // Set the image preview URL
        }));
    }

    const handleCancel = async () => {
        dispatch(toggleAddPayment());
        setFormData(initialFormData);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        try {
            const body = new FormData();
            body.append('resident_id', formData.residentId === null ? '' : formData.residentId.toString());
            body.append('product_id', formData.productId === null ? '' : formData.productId.toString());
            body.append('amount', formData.amount === null ? '' : formData.amount.toString());
            body.append('desc', formData.desc);
            body.append('token', token);
            body.append('type', productType);
            body.append('month', formData?.productMonth?.toString() || '');
            body.append('year', ProductYear == null ? '' : ProductYear);
            if (formData.file) {
                body.append('attachment', formData.file);
            }

            const response = await createPayment(body);
            if (response.success) {
                dispatch(toggleIsUpdated())
                dispatch(toggleAddPayment());
                showSuccessToast(response.data.message);
                setFormData(initialFormData);
                setProducts([])
            } else {
                showErrorToast(response.data.message);
            }
        } catch (err: any) {
            console.error('Unexpected error during creating payment:', err.message);
        } finally {
            setLoading(false)
        }

    };

    const fetchResidents = async () => {
        try {
            let params = { token: token, id: user.id }
            const response = await getAllResidentsArray(params);
            if (response.success) {
                const data = response.data.data
                const transformedData = data.map((item: any) => ({
                    label: `${item.name} - ${item.propertyNumber}`,
                    value: item.id
                }));
                setResidents(transformedData)
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during residents Fetch:', err.message);
        }
    }
    const fetchProducts = async () => {
        try {
            let params = { token: token, id: formData.residentId }
            const response = await getAllUserProducts(params);
            if (response.success) {
                setProducts(response.data.data)
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during products Fetch:', err.message);
        }
    }

    useEffect(() => {
        fetchResidents()
    }, [])

    useEffect(() => {
        if (formData.residentId) {
            fetchProducts()
        }
    }, [formData.residentId])

    return (
        <>
            {addPayment ? (
                <div className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
                    <div className="flex justify-between items-center mt-8">
                        <h3 className="text-3xl font-semibold">{t('PAYMENT.paymentModal.title')}</h3>
                        <button className="bg-transparent border-0 text-[20px] font-bold text-black"
                            onClick={() => dispatch(toggleAddPayment())}
                        >
                            x
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="w-full my-6">
                            <div className="w-full">
                                <div className="relative">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="residentId">
                                        {t('PAYMENT.paymentModal.label1')}
                                    </label>
                                    <select
                                        id="residentId"
                                        name="residentId"
                                        value={formData.residentId || ''}
                                        onChange={handleChange}
                                        required
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    >
                                        <option value="" disabled>
                                            {t('PAYMENT.paymentModal.placeHolder1')}
                                        </option>
                                        {residents.map((resident, index) => (
                                            <option key={index} value={resident.value}>
                                                {resident.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="relative">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="productId">
                                        {t('PAYMENT.paymentModal.label2')}
                                    </label>
                                    <select
                                        id="productId"
                                        name="productId"
                                        value={formData.productId || ''}
                                        onChange={handleChange}
                                        required
                                        className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    >
                                        <option value="" disabled>
                                            {t('PAYMENT.paymentModal.placeHolder2')}
                                        </option>
                                        {products.map((product, index) => (
                                            <option key={index} value={product.id}>
                                                {product.title}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {
                                productType == "monthly" ?
                                    <div className="flex gap-4">
                                        <div className="w-full">
                                            <div className="relative">
                                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="productMonth">
                                                    Month
                                                </label>
                                                <select
                                                    id="productMonth"
                                                    name="productMonth"
                                                    value={formData.productMonth || ''}
                                                    onChange={handleChange}
                                                    required
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                                >
                                                    <option value="" disabled>
                                                        {t('PAYMENT.paymentModal.placeHolder2')}
                                                    </option>
                                                    {productMonths.map((product: any, index) => (
                                                        <option key={index} value={product.month}>
                                                            {product.month}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="relative">
                                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="productYear">
                                                    Year
                                                </label>
                                                <input
                                                    value={ProductYear || ''}
                                                    readOnly
                                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }


                            <div className="relative">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="price">
                                    {t('PAYMENT.paymentModal.label3')}
                                </label>
                                <input
                                    id="amount"
                                    name="amount"
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="number"
                                    placeholder={t('PAYMENT.paymentModal.placeHolder3')}
                                    value={formData.amount || ''}
                                    readOnly
                                />
                            </div>

                            <div className="relative">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="desc">
                                    {t('PAYMENT.paymentModal.label4')}
                                </label>
                                <input
                                    id="desc"
                                    name="desc"
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    onChange={handleChange}
                                    placeholder={t('PAYMENT.paymentModal.placeHolder4')}
                                    value={formData.desc}
                                />
                            </div>

                            <div className="w-full">
                                <label className="block uppercase text-black  tracking-wide text-[14px] font-bold mb-2" htmlFor="file">
                                    {t('PAYMENT.paymentModal.label5')}
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="file"
                                        className="flex flex-col items-center justify-center w-full h-50 border-gray-300 border border-[#DDDDDD] rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                    >
                                        {formData.imagePreview ? (
                                            <div className="relative w-full h-full">

                                                <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
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
                                                    <span className="font-semibold">{t('AREA.button1Modal.label5')}</span> {t('AREA.button1Modal.label6')}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {t('AREA.button1Modal.label7')}
                                                </p>
                                            </div>
                                        )}
                                        <input
                                            id="file"
                                            type="file"
                                            name="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex mt-4 gap-3 items-center">
                            <button
                                className="text-white flex justify-center items-center rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3 shadow hover:shadow-lg outline-none  mr-1 mb-1"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PAYMENT.paymentModal.button2')}`}

                            </button>
                            <button
                                className=" border rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                type="button"
                                onClick={handleCancel}
                            >
                                {t('PAYMENT.paymentModal.button1')}
                            </button>

                        </div>
                    </form>
                </div>
            ) : null}
        </>
    );
};

export default AddPayment;
