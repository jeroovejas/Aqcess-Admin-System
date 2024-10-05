import React, { useState, useRef, useEffect } from "react";
import { toggleAddProduct, toggleIsUpdated } from "@/store/Slices/PaymentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createProduct } from "@/lib/api/product";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";

const AddProduct: React.FC<any> = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const addProduct = useAppSelector((state) => state.payment.addProduct);
    const token = useAppSelector((state) => state.auth.token);
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();

    // State for all form inputs in a single object
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
        try {
            const body = {
                ...formState,
                status: "active",
                token: token
            };
            const response = await createProduct(body);
            console.log(response)
            if (response.success) {
                dispatch(toggleAddProduct());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
                setFormState({
                    title: "",
                    description: "",
                    price: 10,
                });
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during creating product :', err.message);
        }
    };
    const handleDraft = async () => {
        if (!formRef.current?.reportValidity()) return;
        try {
            const body = {
                ...formState,
                status: "draft",
                token: token
            };
            const response = await createProduct(body);
            console.log(response)
            if (response.success) {
                dispatch(toggleAddProduct());
                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
                setFormState({
                    title: "",
                    description: "",
                    price: 10,
                });
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during creating product :', err.message);
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(toggleAddProduct());
        }
    };

    useEffect(() => {
        if (addProduct) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [addProduct]);

    return (
        <>
            {addProduct ? (
                <div className="absolute top-0 right-0 w-full md:w-3/5 lg:w-2/5 h-screen">
                    <div ref={modalRef} className="border-0 shadow-lg relative text-black w-full h-full bg-white outline-none focus:outline-none px-8 py-8">
                        <div className="flex justify-between items-center mt-8">
                            <h3 className="text-3xl font-semibold">Add New Product</h3>
                            <button
                                className="bg-transparent border-0 text-[20px] font-bold text-black"
                                onClick={() => dispatch(toggleAddProduct())}
                            >
                                x
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} ref={formRef} className="w-full my-6">
                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="product-name">
                                    Product Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    type="text"
                                    placeholder="Enter Product Title"
                                    value={formState.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="w-full">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="product-description">
                                    Product Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    placeholder="Add description about product"
                                    rows={8}
                                    value={formState.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="product-price">
                                    Price
                                </label>
                                <select
                                    id="price"
                                    name="price"
                                    className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8 mb-3 focus:outline-none focus:bg-white focus:border-gray-500"
                                    value={formState.price}
                                    onChange={handleChange}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value={150}>150</option>
                                </select>
                            </div>

                            <div className="flex gap-3 items-center">
                                <button
                                    className="text-white rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3  outline-none mr-1 mb-1"
                                    type="submit"
                                >
                                    Publish
                                </button>
                                <button
                                    className=" border rounded-lg border-[#DDDDDD] background-transparent font-medium px-6 py-3 text-sm outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={handleDraft}
                                >
                                    Save as Draft
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default AddProduct;
