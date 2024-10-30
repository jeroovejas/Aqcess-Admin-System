import React, { useState, useEffect, useRef } from 'react';
import { toggleEditModal, toggleSaveModal, toggleDeleteModal, setResidentData } from "@/store/Slices/ResidentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RiDeleteBin6Line } from "react-icons/ri";

const EditModal: React.FC<any> = () => {
    const STATUS_OPTIONS = ['active', 'deactivated'];
    const editModal = useAppSelector((state) => state.resident.editModal);
    const resident = useAppSelector((state) => state.resident.residentData);
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        resident_id: 0,
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

    const saveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setResidentData(formData));
        dispatch(toggleEditModal());
        dispatch(toggleSaveModal());
    };

    const deleteResident = () => {
        // dispatch(toggleEditModal());
        dispatch(toggleDeleteModal());
    };

    useEffect(() => {
        if (resident) {
            setFormData({
                resident_id: resident.id,
                status: resident.status || "",
                first_name: resident.firstName || "",
                last_name: resident.lastName || "",
                address: resident.resident?.address || "",
                email: resident.email || "",
                password: "",
                internal_notes: resident.resident?.internalNotes || "",
            });
        }
    }, [resident]);

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
                            <h3 className="text-3xl font-semibold">Edit Resident</h3>
                            <button className="bg-transparent border-0 text-[20px] font-bold text-black" onClick={() => dispatch(toggleEditModal())}>x</button>
                        </div>
                        <form onSubmit={saveChanges}>
                            <div className="w-full my-6">
                                <div className="relative">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-state">Status</label>
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
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-first-name">First Name</label>
                                        <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-last-name">Last Name</label>
                                        <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-address">Address</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-email">Email</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-password">Password</label>
                                    <input className="appearance-none block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                                </div>
                                <div className="w-full">
                                    <label className="block uppercase tracking-wide text-[14px] font-bold mb-2" htmlFor="grid-notes">Internal Notes</label>
                                    <textarea className="block w-full bg-gray-200 border border-[#DDDDDD] rounded-xl py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" name="internal_notes" placeholder="Add notes about resident" value={formData.internal_notes} onChange={handleChange} rows={5} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <button className="text-white rounded-lg bg-primary-blue font-medium  text-sm px-4 py-2.5  outline-none  mr-1 mb-1" type="submit" >Save Changes</button>

                                    <button className="border rounded-lg border-[#DDDDDD] bg-transparent font-medium  px-4 py-2.5 text-sm outline-none  ml-1 mb-1" type="button" onClick={() => dispatch(toggleEditModal())}>Cancel</button>
                                </div>
                                <button type="button" onClick={deleteResident} className="text-gray-900 bg-white border rounded-lg border-[#DDDDDD] font-medium text-sm px-4 py-2.5 mb-2 flex items-center">
                                    <RiDeleteBin6Line className="mr-2" />Delete Resident
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



