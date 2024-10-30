"use client"
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDeleteModal, toggleEditModal, setAreaData, toggleStatusModal, toggleViewModal, setAreaDetails } from "@/store/Slices/AreaSlice";
import { getAllAreas } from "@/lib/api/commonArea";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { toTitleCase } from "@/lib/common.modules";

const CommonAreaTable: React.FC<any> = ({ searchTerm }) => {
    const dispatch = useAppDispatch();
    const limit = 10;
    const PAGE_RANGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const isUpdated = useAppSelector((state) => state.area.isUpdated)
    const token = useAppSelector((state) => state.auth.token);
    const [areas, setAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - PAGE_RANGE);
        const endPage = Math.min(totalPages, currentPage + PAGE_RANGE);

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDelete = (area: any) => {
        dispatch(setAreaData(area))
        dispatch(toggleDeleteModal())
    }
    const handleEdit = (area: any) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // For a smooth scrolling effect
        });
        dispatch(setAreaData(area))
        dispatch(toggleEditModal())
    }
    const handleView = (area: any) => {
        dispatch(setAreaData(area))
        dispatch(toggleViewModal())
    }
    const handleStatusChange = (area: any) => {
        dispatch(setAreaData(area))
        dispatch(toggleStatusModal())
    }

    useEffect(() => {
        setLoading(true);
        fetchAreas().finally(() => {
            setLoading(false);
        });
    }, [currentPage, isUpdated, searchTerm])

    const fetchAreas = async () => {
        try {

            let params = { page: currentPage, token: token, limit: limit, searchTerm: searchTerm }
            const response = await getAllAreas(params);

            // Check the success property to determine if the request was successful
            if (response.success) {
                setAreas(response.data.data.allCommonArea);
                setTotalPages(response.data.data.pagination.totalPages)
                dispatch(setAreaDetails({
                    totalActiveBookings: response.data.data.stats.totalActiveBookings,
                    uniqueBookers: response.data.data.stats.uniqueBookers,
                    percentageBookedForNextDay: response.data.data.stats.percentageBookedForNextDay,
                    percentageBookedForNext7Days: response.data.data.stats.percentageBookedForNext7Days,
                }))
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during areas Fetch:', err.message);
        }
    }
    function toUpperCase(status: any): import("react").ReactNode {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
            <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
                Common Areas
            </h4>
            {loading ? (
                <Loader />
            ) : (
                <div className="relative overflow-x-auto text-black">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Area Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date And Time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Occupacy
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Active Booking
                                </th>                                
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.length === 0 ? (
                                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={7} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                                        No Data Found
                                    </td>
                                </tr>
                            ) : (
                                areas.map((area, key) => (
                                    <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                                        <td className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img src={area.imageUrl} alt="Profile Image" className="w-full h-full object-cover" />
                                            </div>
                                            <p className=" text-black font-bold dark:text-white ml-2">
                                                {area.title}
                                            </p>
                                        </td>                                        
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {area.createdAt}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {area.occupancy}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {area.areaStats.totalActiveBookings}
                                        </td>
                                        <td className="px-6 py-4  font-bold whitespace-nowrap">
                                            <span className={` p-2 rounded-2xl ${area.status == 'available' ? 'text-meta-3 bg-[#ECFDED]' : area.status == 'booked' ? 'text-meta-1 bg-[#FEF3F2]' : 'bg-[#F2F4F7] text-[#344054]'}`}>
                                                {toTitleCase(area.status)}
                                            </span>
                                        </td>
                                        <td className=" relative group">
                                            <BsThreeDotsVertical className="text-black" />
                                            <ul className="absolute z-500 bottom-0 mb-0 w-[150px] right-2 text-[14px] bg-white hidden group-hover:block  text-black border border-gray ">
                                                <li className="px-8 py-2  font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleEdit(area)}   >Edit</li>
                                                <li className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleStatusChange(area)} >{area.status === "hidden" ? "Available" : "Hide"}</li>
                                                <li className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleDelete(area)} >Delete</li>
                                            </ul>
                                        </td>
                                        <td>
                                            <button onClick={() => handleView(area)} className="cursor-pointer">
                                                <FaChevronRight
                                                    className="text-black mx-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>)}
            <div className="mb-4 mt-5 flex justify-center">
                <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px text-lg">
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 bg-white px-3 font-bold leading-tight text-black dark:hover:text-white"
                            >
                                <FaArrowLeft className="mr-1" />
                                Previous
                            </button>
                        </li>
                        {getPageNumbers().map((page, index) => (
                            <li key={index}>
                                {page === "..." ? (
                                    <span className="text-gray-500 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center border bg-white px-3 leading-tight text-black dark:hover:text-white">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handlePageChange(page as number)}
                                        className={`text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center border bg-white px-3 leading-tight text-black dark:hover:text-white ${page === currentPage ? "dark:bg-gray-700 border-blue-500 bg-blue-50 text-blue-700 dark:text-white" : ""}`}
                                    >
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-8 items-center justify-center rounded-e-lg border bg-white px-3 font-bold leading-tight text-black dark:hover:text-white"
                            >
                                Next
                                <FaArrowRight className="ml-1" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div >
    );
};

export default CommonAreaTable;
