import React, { useState, useEffect, useRef } from 'react'
import { toggleEditProduct, toggleIsUpdated } from "@/store/Slices/PaymentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { editProductData } from '@/lib/api/product';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useLocale, useTranslations } from 'next-intl';

const EditProduct: React.FC<any> = () => { 
      const t = useTranslations();
    
    const formRef = useRef<HTMLFormElement>(null);
    const PRICE_OPTIONS = [10, 20, 50, 100, 150];
    const editProduct = useAppSelector((state) => state.payment.editProduct)
    const productData = useAppSelector((state) => state.payment.productData)
    const token = useAppSelector((state) => state.auth.token);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const dispatch = useAppDispatch()


    const [formState, setFormState] = useState({
        title: "",
        description: "",
        price: 10,
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading1(true)
        try {
            const body = {
                ...formState,
                token: token,
                status: "active",
                product_id: productData.id
            };
            const response = await editProductData(body);
            console.log(response)
            if (response.success) {
                dispatch(toggleEditProduct());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during editing product :', err.message);
        } finally {
            setLoading1(false)
        }
    };

    const handleDraft = async () => {
        if (!formRef.current?.reportValidity()) return;
        setLoading2(true)
        try {
            const body = {
                ...formState,
                status: "draft",
                product_id: productData.id,
                token: token
            };
            const response = await editProductData(body);
            console.log(response)
            if (response.success) {
                dispatch(toggleEditProduct());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during editing product :', err.message);
        } finally {
            setLoading2(false)
        }
    };
    useEffect(() => {
        if (productData) {
            setFormState({
                title: productData.title || "",
                description: productData.description || "",
                price: productData.price || 10,
            });
        }
    }, [productData]);

    return (
        <>
            {editProduct ? (
                <>
                    <div className="absolute top-0 right-0 w-full md:w-2/5 h-screen my-0">
                        <div className="border-0 shadow-lg relative text-black w-full h-full bg-white outline-none focus:outline-none  px-8 py-8">
                            <div className="flex justify-between items-center mt-8">


                                <h3 className="text-3xl font-semibold ">{t('PRODUCT.button1Modal.editTitle')}</h3>

                                <button className="bg-transparent border-0 text-[20px] font-bold text-black "
                                    onClick={() => dispatch(toggleEditProduct())}
                                >
                                    x
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} ref={formRef} className="w-full my-6">
                                <div className="w-full my-6">
                                    <div className="w-full  ">
                                        <label className="block uppercase tracking-wide  text-[14px] font-bold mb-2" htmlFor="grid-first-name">
                                        {t('PRODUCT.button1Modal.title1')}
                                        </label>
                                        <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" name='title' placeholder={t('PRODUCT.button1Modal.lable1')} onChange={handleChange} value={formState.title}
                                            required
                                        />

                                    </div>
                                    <div className="w-full   ">
                                        <label className="block uppercase tracking-wide  text-[14px] font-bold mb-2" htmlFor="grid-first-name">
                                        {t('PRODUCT.button1Modal.title2')}
                                        </label>
                                        <textarea value={formState.description} name='description' className="block w-full h-48 bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 overflow-auto resize-none mb-3 leading-tight focus:outline-none focus:bg-white" placeholder={t('PRODUCT.button1Modal.lable2')} onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    <div className="relative">
                                        <label className="block uppercase tracking-wide  text-[14px] font-bold mb-2" htmlFor="grid-state">
                                        {t('PRODUCT.button1Modal.title3')}
                                        </label>
                                        {/* <select value={formState.price} name="price" onChange={handleChange} className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8   focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">

                                            {PRICE_OPTIONS.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select> */}
                                        <input
                                            id="price"
                                            name="price"
                                            className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                            type="number"
                                            placeholder={t('PRODUCT.button1Modal.lable3')}
                                            min={1}
                                            value={formState.price}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>


                                </div>


                                <div className="flex gap-3 items-center ">


                                    <button
                                        className="text-white  rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3   outline-none   mb-1"
                                        type="submit"
                                        disabled={loading1}
                                    >
                                        {loading1 ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PRODUCT.button1Modal.button2')}`}
                                    </button>
                                    <button
                                        className=" border rounded-lg border-[#DDDDDD]  background-transparent font-medium  px-6 py-3 text-sm outline-none   mb-1"
                                        type="button"
                                        onClick={handleDraft}
                                        disabled={loading2}
                                    >
                                        {loading2 ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PRODUCT.button1Modal.button3')}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </>
            ) : null}
        </>
    );
}

export default EditProduct;


