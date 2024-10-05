"use client"
import { useState, useRef, useEffect } from "react";
import AccessTable from "@/components/Tables/accessTable";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { DateRangePickerElement } from "@/components/DataPicker";
import { FaChevronRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleExportModal, resetState } from "@/store/Slices/AccessSlice";
import ExportModal from "@/components/AccessComponents/ExportModal";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';


const AccessHistory = () => {
  const dispatch = useAppDispatch()
  const router = useRouter();
  const filterRef = useRef<HTMLDivElement>(null);
  const exportModal = useAppSelector((state) => state.access.exportModal)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsTypeOpen(false);
  };

  const closeDropdown = () => {
    setIsFilterOpen(false);
    setIsTypeOpen(false);
  }
  const toggleTypeDropdown = () => {
    setIsTypeOpen(!isTypeOpen);
  };
  useEffect(() => {
    if (exportModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [exportModal]);

  const handleClickOutside = (event: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
      setIsFilterOpen(false);
      setIsTypeOpen(false);
    }
  };

  useEffect(() => {
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);
  useEffect(() => {
    dispatch(resetState())
  }, [router])
  return (
    <>
      <DefaultLayout>
        <div>
          {/* <Breadcrumb pageName="Access history" /> */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
              Access history
            </h2>
          </div>
          <div className="mb-4 flex flex-wrap justify-between">
            <div className="flex flex-wrap w-full md:w-auto">
              <div className="relative mb-4 w-full md:w-auto">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <IoSearchOutline size={20} />
                </div>
                <input type="search" id="default-search" className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder="Search by resident name or ID" required />
              </div>
              <div ref={filterRef} className="flex items-center me-2 md:me-0">
                <button onClick={toggleFilterDropdown} type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-[#f0efef] font-medium rounded-lg text-sm px-6 py-3 md:ms-4 mb-4 dark:text-white dark:hover:bg-gray-700 flex items-center">
                  <IoFilterSharp className="mr-2" />Filters
                </button>
                <div className='w-full'>
                  <div className="relative inline-block">


                    {isFilterOpen && (
                      <div className=" absolute font-bold top-0 right-0 left-[-110px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <li onClick={toggleTypeDropdown}>
                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"

                            >
                              Type
                            </button>
                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                              <FaChevronRight size={15} />
                            </span>
                          </li>

                        </ul>

                      </div>
                    )}


                  </div>

                </div>
                <div className='w-full'>
                  <div className="relative inline-block">


                    {isTypeOpen && (
                      <div className=" absolute top-0 font-bold z-10  left-[70px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                          <li>
                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                              onClick={closeDropdown}
                            >
                              QR Code
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                              onClick={closeDropdown}
                            >
                              Digital Code
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                              onClick={closeDropdown}
                            >Manual Entry
                            </button>
                          </li>

                        </ul>

                      </div>
                    )}
                  </div>

                </div>
              </div>
              <div className="text-black md:mt-0 md:ml-3">
                <DateRangePickerElement />
              </div>
            </div>
            <div className="flex flex-wrap w-full md:w-auto">
              <div className="w-full md:mr-3 md:w-auto mt-4 md:mt-0">
                <button onClick={() => dispatch(toggleExportModal())} type="button" className="w-full md:w-auto justify-center text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-3 md:ms-4 mb-2 dark:text-white dark:hover:bg-gray-700 flex items-center mr-4">
                  <TfiExport className="mr-2 text-base" />Export list
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <AccessTable />
        </div>
        {(exportModal) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
        </div>}
      </DefaultLayout >
      <ExportModal />
    </>
  );
};

export default AccessHistory;
