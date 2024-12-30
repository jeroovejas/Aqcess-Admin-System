"use client"
import { useState } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaChevronRight } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";


const Invoices = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const dispatch = useAppDispatch()
    const toggleFilterDropdown = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const closeDropdown = () => {
        setIsFilterOpen(false);
        setIsStatusOpen(false);
    }
    const toggleStatusDropdown = () => {
        setIsStatusOpen(!isStatusOpen);
    };

    return (
        <>
            <DefaultLayout>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-title-md2 font-bold text-black dark:text-white">
                        Invoices
                    </h2>
                    <nav>
                        <div className="">
                            <button type="button" className="text-white bg-primary-blue  font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
                                <IoIosAdd className="mr-2 text-white text-xl" />Create new
                            </button>
                        </div>
                    </nav>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">

                    <CardDataStats title="Total surveys" total="47" rate="">
                    </CardDataStats>
                    <CardDataStats title="Open surveys" total="2" rate="">
                    </CardDataStats>
                    <CardDataStats title="Average response rate" total="78%" rate="">
                    </CardDataStats>
                </div>
                <div className="mb-4 flex justify-between">
                    <div className="flex">
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <IoSearchOutline size={20}/>
                            </div>
                            <input type="search" id="default-search" className="block w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder="Search for survey" required />
                        </div>
                    </div>
                </div>

            </DefaultLayout>

        </>
    );
};

export default Invoices;
