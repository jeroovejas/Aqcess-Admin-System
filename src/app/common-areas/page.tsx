"use client"
import { useState, useEffect } from "react";
import CommonAreaTable from "@/components/Tables/commonAreaTable";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import AddArea from "@/components/AreasComponents/AddArea";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleAddModal, resetState } from "@/store/Slices/AreaSlice";
import DeleteArea from "@/components/AreasComponents/DeleteArea";
import StatusModal from "@/components/AreasComponents/StatusModal";
import EditArea from "@/components/AreasComponents/EditArea";
import ViewDetails from "@/components/AreasComponents/ViewDetails";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "@/components/common/Loader";
import { useRouter } from 'next/navigation';
import { IoSearchOutline } from "react-icons/io5";

const CommonAreas = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [verified, setVerified] = useState<boolean | null>(null);
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const addModal = useAppSelector((state) => state.area.addModal)
    const viewModal = useAppSelector((state) => state.area.viewModal)
    const deleteModal = useAppSelector((state) => state.area.deleteModal)
    const bookingModal = useAppSelector((state) => state.area.bookingModal)
    const statusModal = useAppSelector((state) => state.area.statusModal)
    const editModal = useAppSelector((state) => state.area.editModal)
    const areaDetails = useAppSelector((state) => state.area.areaDetails)
    const dispatch = useAppDispatch()
    const router = useRouter();


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Update the search term
    };
    const handleAddCommonArea = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // For a smooth scrolling effect
        });
        dispatch(toggleAddModal())
    };

    useEffect(() => {
        if (addModal || deleteModal || statusModal || editModal || bookingModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [addModal, deleteModal, statusModal, editModal, bookingModal]);

    useEffect(() => {
        if (isTokenValid) {
            setVerified(true);
        } else {
            router.push('/auth/login');
            // setTimeout(() => {
            //     showErrorToast("Plz Login First");
            // }, 2000);
        }
    }, [isTokenValid, router])

    useEffect(() => {
        dispatch(resetState())
    }, [router])



    if (verified === null) {
        return <Loader />
    }

    if (viewModal) {
        return <ViewDetails />
    }
    return (
        <>
            {verified ? (
                <>
                    <DefaultLayout >
                        {/* <Breadcrumb pageName="Resident manager" /> */}

                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                                Common Areas
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-5">

                            <CardDataStats title="Active Bookings" total={`${areaDetails.totalActiveBookings}`} rate="">
                            </CardDataStats>
                            <CardDataStats title="Unique Bookers" total={`${areaDetails.uniqueBookers}`} rate="">
                            </CardDataStats>
                            <CardDataStats title="Booked for next day" total={`${areaDetails.percentageBookedForNextDay}%`} rate="">
                            </CardDataStats>
                            <CardDataStats title="Booked for next 7 day" total={`${areaDetails.percentageBookedForNext7Days}%`} rate="">
                            </CardDataStats>

                        </div>
                        <div className="mb-4 flex flex-wrap justify-between">
                            <div className="flex flex-wrap w-full md:w-auto">
                                <div className="relative mb-4 w-full md:w-auto">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <IoSearchOutline size={20} />
                                    </div>
                                    <input type="search" id="default-search" name="searchTerm" onChange={handleChange} value={searchTerm} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder="Search by area name" required />
                                </div>

                            </div>
                            <div className="flex flex-wrap w-full md:w-auto">
                                <div className="w-full md:w-auto mt-2 md:mt-0">
                                    <button onClick={handleAddCommonArea} type="button" className="w-full md:w-auto justify-center text-white bg-primary-blue  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center  mb-2">
                                        <IoIosAdd className="mr-2 text-white text-2xl" />Add common area
                                    </button>

                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10">
                            <CommonAreaTable searchTerm={searchTerm} />
                        </div>
                        {(addModal || deleteModal || statusModal || editModal) && <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50">
                        </div>}
                        <AddArea />
                        <DeleteArea />
                        <StatusModal />
                        <EditArea />
                    </DefaultLayout>
                </>
            ) : null}
        </>
    );
};

export default CommonAreas;
