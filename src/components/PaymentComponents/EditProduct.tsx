"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { toggleEditProduct, toggleIsUpdated } from "@/store/Slices/PaymentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil"
import { editProductData } from "@/lib/api/product"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useTranslations } from "next-intl"
import Select from "react-select"
import moment from "moment"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const monthOptions = months.map((month) => ({
  value: month,
  label: month,
}))

const years = [moment().year(), moment().add(1, "year").year(), moment().add(2, "year").year()]

const EditProduct: React.FC<any> = () => {
  const t = useTranslations()
  const formRef = useRef<HTMLFormElement>(null)
  const editProduct = useAppSelector((state) => state.payment.editProduct)
  const productData = useAppSelector((state) => state.payment.productData)
  const token = useAppSelector((state) => state.auth.token)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const dispatch = useAppDispatch()

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    price: 10,
    year: moment().year(),
    month: [] as string[],
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleMonthChange = (selectedOptions: any) => {
    const selectedMonths = selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    setFormState((prevState) => ({
      ...prevState,
      month: selectedMonths,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading1(true)
    try {
      const body = {
        ...formState,
        month: JSON.stringify(formState.month),
        status: "active",
        token: token,
        product_id: productData.id,
      }
      const response = await editProductData(body)
      console.log(response)
      if (response.success) {
        dispatch(toggleEditProduct())
        dispatch(toggleIsUpdated())
        showSuccessToast(response.data.message)
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error("Unexpected error during editing product :", err.message)
    } finally {
      setLoading1(false)
    }
  }

  const handleDraft = async () => {
    if (!formRef.current?.reportValidity()) return
    setLoading2(true)
    try {
      const body = {
        ...formState,
        month: JSON.stringify(formState.month),
        status: "draft",
        product_id: productData.id,
        token: token,
      }
      const response = await editProductData(body)
      console.log(response)
      if (response.success) {
        dispatch(toggleEditProduct())
        dispatch(toggleIsUpdated())
        showSuccessToast(response.data.message)
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error("Unexpected error during editing product :", err.message)
    } finally {
      setLoading2(false)
    }
  }
  useEffect(() => {
    if (productData) {
      setFormState({
        title: productData.title || "",
        description: productData.description || "",
        price: productData.price || 10,
        year: productData.productDetail?.[0]?.year || moment().year(),
        month: productData.productDetail?.map((item: any) => item.month) || [],
      })
    }
  }, [productData])

  return (
    <>
      {editProduct ? (
        <>
          <div className="border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-2">
            <div className="flex justify-between items-center mt-8">
              <h3 className="text-3xl font-semibold ">{t("PRODUCT.button1Modal.editTitle")}</h3>
              <button
                className="bg-transparent border-0 text-[20px] font-bold text-black "
                onClick={() => dispatch(toggleEditProduct())}
              >
                x
              </button>
            </div>
            <form onSubmit={handleSubmit} ref={formRef} className="w-full my-6">
              <div className="w-full my-6">
                <div className="w-full  ">
                  <label
                    className="block uppercase tracking-wide  text-[14px] font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    {t("PRODUCT.button1Modal.title1")}
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    name="title"
                    placeholder={t("PRODUCT.button1Modal.lable1")}
                    value={formState.title} 
                    onChange={handleChange}
                  />

                </div>
                <div className="w-full   ">
                  <label
                    className="block uppercase tracking-wide  text-[14px] font-bold mb-2"
                    htmlFor="grid-first-name"
                  >
                    {t("PRODUCT.button1Modal.title2")}
                  </label>
                  <textarea
                    value={formState.description}
                    name="description"
                    className="block w-full h-48 bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 overflow-auto resize-none mb-3 leading-tight focus:outline-none focus:bg-white"
                    placeholder={t("PRODUCT.button1Modal.lable2")}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <label className="block uppercase tracking-wide  text-[14px] font-bold mb-2" htmlFor="grid-state">
                    {t("PRODUCT.button1Modal.title3")}
                  </label>
                  <input
                    id="price"
                    name="price"
                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="number"
                    placeholder={t("PRODUCT.button1Modal.lable3")}
                    min={1}
                    value={formState.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full">
                  <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="product-price">
                    {t("PRODUCT.button1Modal.title4")}
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    name="type"
                    readOnly
                    value={productData.type}
                  />
                </div>
                {productData.type === "monthly" && (
                  <>
                    <div className="w-full">
                      <div className="relative">
                        <label
                          className="block uppercase tracking-wide text-[14px] font-bold mb-2"
                          htmlFor="product-price"
                        >
                          {t("PRODUCT.button1Modal.title5")}
                        </label>
                        <select
                          id="year"
                          name="year"
                          value={formState.year}
                          onChange={handleChange}
                          required
                          className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        >
                          {years.map((year, index) => (
                            <option key={index} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="fill-current h-4 w-4 mt-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <label
                        className="block uppercase tracking-wide text-black text-[14px] font-[600] mb-2"
                        htmlFor="month"
                      >
                        {t("PRODUCT.button1Modal.title6")}
                      </label>
                      <div className="flex justify-between gap-x-4">
                        <Select
                          options={monthOptions}
                          name="month"
                          value={monthOptions.filter((option) => formState.month.includes(option.value))}
                          className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg text-black mb-3 leading-tight focus:outline-none focus:bg-white"
                          onChange={handleMonthChange}
                          placeholder="Select Months"
                          isMulti
                          isClearable
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 items-center ">
                <button
                  className="text-white  rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3   outline-none   mb-1"
                  type="submit"
                  disabled={loading1}
                >
                  {loading1 ? (
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  ) : (
                    `${t("PRODUCT.button1Modal.button2")}`
                  )}
                </button>
                <button
                  className=" border rounded-lg border-[#DDDDDD]  background-transparent font-medium  px-6 py-3 text-sm outline-none   mb-1"
                  type="button"
                  onClick={handleDraft}
                  disabled={loading2}
                >
                  {loading2 ? (
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  ) : (
                    `${t("PRODUCT.button1Modal.button3")}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null}
    </>
  )
}

export default EditProduct
