"use client"
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleViewModal, toggleEditModal, toggleStatusModal, toggleDeleteModal, toggleBookingModal, setBookingId } from "@/store/Slices/AreaSlice";
import DeleteBooking from "./DeleteBooking";
import { GrHide } from "react-icons/gr";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getAreaDetails } from "@/lib/api/commonArea";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { toTitleCase } from "@/lib/common.modules";
import DeleteArea from "@/components/AreasComponents/DeleteArea";
import StatusModal from "@/components/AreasComponents/StatusModal";
import EditArea from "@/components/AreasComponents/EditArea";

const ViewDetails = () => {
    const areaData = useAppSelector((state) => state.area.areaData)
    const [area, setArea] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const bookingModal = useAppSelector((state) => state.area.bookingModal)
    const deleteModal = useAppSelector((state) => state.area.deleteModal)
    const statusModal = useAppSelector((state) => state.area.statusModal)
    const editModal = useAppSelector((state) => state.area.editModal)
    const viewModal = useAppSelector((state) => state.area.viewModal)
    const isUpdated = useAppSelector((state) => state.area.isUpdated)
    const token = useAppSelector((state) => state.auth.token);

    const dispatch = useAppDispatch()
    const handleEdit = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        dispatch(toggleEditModal())
    };
    const handleChangeStatus = () => {
        dispatch(toggleStatusModal())
    };
    const handleDelete = () => {
        dispatch(toggleDeleteModal())
    };
    const handleBookingDelete = (id: number) => {
        dispatch(setBookingId(id))
        dispatch(toggleBookingModal())
    };

    useEffect(() => {
        setLoading(true);
        fetchAreaDetails().finally(() => {
            setLoading(false);
        });
    }, [isUpdated, viewModal])

    const fetchAreaDetails = async () => {
        try {

            let params = { id: areaData.id, token: token }
            const response = await getAreaDetails(params);


            // Check the success property to determine if the request was successful
            if (response.success) {
                setArea((prevState: any) => ({
                    ...prevState,
                    ...response.data.data // Merge with previous state
                }));
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during area Fetch:', err.message);
        }
    }
    // console.log(area)
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <DefaultLayout >
                    <div className="flex justify-between">
                        <div>
                            <p className="text-[14px] font-[600] text-black my-2">Common Area / <span className="text-body">Details</span></p>
                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                                    {area.title}
                                </h2>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => dispatch(toggleViewModal())} type="button" className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
                                Back
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-5">
                        <CardDataStats title="Active Bookings" total={`${area.areaStats.totalActiveBookings}`} rate="">
                        </CardDataStats>
                        <CardDataStats title="Unique Bookers" total={`${area.areaStats.uniqueBookers}`} rate="">
                        </CardDataStats>
                        <CardDataStats title="Booked for next day" total={`${area.areaStats.percentageBookedForNextDay}%`} rate="">
                        </CardDataStats>
                        <CardDataStats title="Booked for next 7 day" total={`${area.areaStats.percentageBookedForNext7Days}%`} rate="">
                        </CardDataStats>
                    </div>
                    <div className="flex  flex-wrap mt-7">
                        <div className="w-2/6 pe-3">
                            <div className="w-full bg-white border border-stroke rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <div className="w-full h-[250px]">
                                    <img className="rounded-t-lg w-full h-full object-cover" src={area.imageUrl} alt="Area Image" />
                                </div>
                                <div className="p-5">
                                    <span className={` p-2 rounded-2xl  ${area.status == 'available' ? 'text-meta-3 bg-[#ECFDED]' : areaData.status == 'booked' ? 'text-meta-1 bg-[#FEF3F2]' : 'bg-[#F2F4F7] text-[#344054]'}`}>
                                        {toTitleCase(areaData.status)}
                                    </span>
                                    <p className="my-3 font-normal text-gray-700 dark:text-gray-400">{area.description}</p>
                                    <button onClick={handleEdit} type="button" className="w-full font-[600]   border rounded-lg border-[#DDDDDD]  background-transparent    px-6 py-3  inline-flex items-center justify-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mb-2">
                                        <CiEdit className="mr-2  text-2xl" />Edit
                                    </button>
                                    <button onClick={handleChangeStatus} type="button" className="w-full font-[600]   border rounded-lg border-[#DDDDDD]  background-transparent    px-6 py-3  inline-flex items-center justify-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mb-2">
                                        <GrHide className="mr-2  text-2xl" />{area.status === 'hidden' ? "Available" : "Hide"}
                                    </button>
                                    <button onClick={handleDelete} type="button" className="w-full font-[600]   border rounded-lg border-[#DDDDDD]  background-transparent    px-6 py-3  inline-flex items-center justify-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mb-2">
                                        <RiDeleteBin6Line className="mr-2  text-2xl" />Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-4/6 ps-3">
                            <div className="flex w-full">
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <svg className="w-4  h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input type="search" id="default-search" className="block w-full p-3 ps-10 text-sm text-gray-900 border border-stroke rounded-lg  dark:placeholder-gray-400 dark:text-white" placeholder="Search by resident name or address" required />
                                </div>
                            </div>
                            {
                                area.bookings.length === 0
                                    ?
                                    <div className="w-full bg-white my-6 border border-stroke rounded-lg p-4">
                                        <p className="text-center">No Booking Found</p>
                                    </div> :
                                    area.bookings.map((booking: any) => (
                                        <div className="w-full bg-white my-6 border border-stroke rounded-lg p-4" key={booking.date}>
                                            <h4 className="font-[600] text-[18px] text-black my-2">{booking.date}</h4>
                                            {booking.bookings && Array.isArray(booking.bookings) && booking.bookings.map((bookingItem: any, index: number) => (
                                                <div
                                                    className={`flex justify-between items-center p-4 ${index < booking.bookings.length - 1 ? 'border-b border-[#E4E7EC]' : ''}`}
                                                    key={index}
                                                >
                                                    <p className="text-black text-[14px] font-[600]">
                                                        {bookingItem.bookingTime} - {bookingItem.endTime}
                                                    </p>
                                                    <p className="text-[14px] font-[500]">{bookingItem.duration}</p>
                                                    <div>
                                                        <button onClick={() => handleBookingDelete(bookingItem.id)}>
                                                            <RiDeleteBin6Line className="text-2xl" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                            {/* <div className="w-full bg-white my-6  border border-stroke rounded-lg p-4">
                            <h4 className="font-[600] text-[18px] text-black my-2">Jul 16th, 2024</h4>

                            <div className="flex justify-between items-center p-4 border-b border-[#E4E7EC]">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-[#E4E7EC]">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-[#E4E7EC]">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-[#E4E7EC]">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-[#E4E7EC]">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-[#E4E7EC]">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 border-b border-[#E4E7EC]">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-4 ">
                                <div className="flex gap-x-4 ">
                                    <p className="text-black text-[14px] font-[600]">10:00 - 12:00</p>
                                    <p className=" text-[14px] font-[500]">John Smith, 123 Marple street 9</p>

                                </div>
                                <div>
                                    <RiDeleteBin6Line className=" text-2xl" />
                                </div>
                            </div>
                        </div> */}
                        </div>

                    </div>
                    {(bookingModal || deleteModal || statusModal || editModal) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
                    </div>}
                    <DeleteBooking />
                    <DeleteArea />
                    <StatusModal />
                    <EditArea />
                </DefaultLayout>
            )}
        </>
    );
};

export default ViewDetails;