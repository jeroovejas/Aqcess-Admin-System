"use client"
import React, { useState, useRef, useEffect } from "react";
import { toggleAddMethodModal, toggleIsUpdated } from "@/store/Slices/SettingSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { addAdminCard } from "@/lib/api/payment";

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

const AddMethodModal: React.FC<any> = () => {
  const addMethod = useAppSelector((state) => state.setting.addMethod);
  const token = useAppSelector((state) => state.auth.token);
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
    event.preventDefault(); // Prevent default form submission
    try {
      const body = {
        ...formState,
        token: token // Add the token here
      };
      const response = await addAdminCard(body);
      if (response.success) {
        dispatch(toggleAddMethodModal());
        dispatch(toggleIsUpdated());
        showSuccessToast(response.data.message);
        setFormState(initialFormState);
      } else {
        showErrorToast(response.data.message);
      }
    } catch (err: any) {
      console.error('Unexpected error during creating new card:', err.message);
    }
  };

  return (
    <>
      {addMethod ? (
        <>
          <div className='border-0 absolute top-0 right-0 z-999 bg-white text-black w-full md:w-3/5 lg:w-2/5 h-screen overflow-y-scroll my-scrollbar outline-none focus:outline-none px-8 py-8'>
            <div className="flex justify-between items-center mt-8">
              <h3 className="text-3xl font-semibold">Add Payment Method</h3>
              <button
                className="bg-transparent border-0 text-[20px] font-bold text-black"
                onClick={() => dispatch(toggleAddMethodModal())}
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
                      Name on card
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="card_holder_name"
                      name="card_holder_name"
                      placeholder="Name on card"
                      value={formState.card_holder_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex gap-x-4">
                  <div className="w-1/2">
                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="cardName">
                      Expiry Month
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="expiry_month"
                      name="expiry_month"
                      placeholder="Expiry Month (mm)"
                      value={formState.expiry_month}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="expiry">
                      Expiry Year
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="expiry_year"
                      name="expiry_year"
                      placeholder="Expiry Year (yy)"
                      value={formState.expiry_year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex gap-x-4">
                  <div className="w-3/4">
                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="card_number"
                      name="card_number"
                      placeholder="Card Number"
                      value={formState.card_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-1/4">
                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="cvv">
                      CVV
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="cvc"
                      name="cvc"
                      placeholder="cvc number"
                      value={formState.cvc}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="invoicingEmail">
                    Invoicing Email
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="email"
                    id="invoicing_email"
                    name="invoicing_email"
                    placeholder="Email"
                    value={formState.invoicing_email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full">
                  <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="invoicingAddress">
                    Invoicing Address
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    id="invoicing_address"
                    name="invoicing_address"
                    placeholder="Address"
                    value={formState.invoicing_address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full flex gap-x-4">
                  <div className="w-1/2">
                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="city">
                      City
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="city"
                      name="city"
                      placeholder="City"
                      value={formState.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="postCode">
                      PostCode
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="postcode"
                      name="postcode"
                      placeholder="postcode"
                      value={formState.postcode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex gap-x-4">
                  <div className="w-1/2">
                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="stateOrProvince">
                      State/Province
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      type="text"
                      id="state"
                      name="state"
                      placeholder="State/Province"
                      value={formState.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="relative">
                      <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="country">
                        Country
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
                  className="text-white rounded-lg bg-primary-blue font-medium  text-sm px-6 py-3  outline-none  mr-1 mb-1"
                  type="submit"

                >
                  Add Payment Method
                </button>
                <button
                  className="text-red-500 border rounded-lg border-[#DDDDDD] background-transparent font-medium  px-6 py-3 text-sm outline-none  mr-1 mb-1"
                  type="button"
                  onClick={() => dispatch(toggleAddMethodModal())}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      ) : null
      }
    </>
  );
};

export default AddMethodModal;
