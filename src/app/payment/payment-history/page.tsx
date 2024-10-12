"use client"
import { useState, useEffect, useRef } from "react";
import PaymentTable from "@/components/Tables/paymentTable";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import ExportModal from "@/components/PaymentComponents/ExportModal";
import { FaChevronRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleExportModal, } from "@/store/Slices/PaymentSlice";
import Link from "next/link";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "@/components/common/Loader";
import { useRouter } from 'next/navigation';
import { IoSearchOutline } from "react-icons/io5";



const PaymentManager = () => {
  const exportModal = useAppSelector((state) => state.payment.exportModal)
  const paymentDetails = useAppSelector((state) => state.payment.paymentDetails)
  console.log(paymentDetails)
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTerm, setFilterTerm] = useState<string>('');
  const dispatch = useAppDispatch()
  const filterRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsStatusOpen(false);
  };

  const closeDropdown = (status: string) => {
    setFilterTerm(status)
    setIsFilterOpen(false);
    setIsStatusOpen(false);
  }

  const toggleStatusDropdown = () => {
    setIsStatusOpen(!isStatusOpen);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the search term
  };

  useEffect(() => {
    if (isTokenValid) {
      setVerified(true);
    } else {
      router.push('/auth/login');
      setTimeout(() => {
        showErrorToast("Plz Login First");
      }, 2000);
    }
  }, [isTokenValid, router])

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
      setIsStatusOpen(false);
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


  if (verified === null) {
    return <Loader />
  }

  return (
    <>
      {verified ? (
        <>
          <DefaultLayout>
            {/* <Breadcrumb pageName="Resident manager" /> */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                Payment Manager
              </h2>
            </div>
            <div className="mx-auto">
              <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center mr-4">
                  Payment history
                </button>
                <div className="mt-1 text-lg font-bold">
                  <Link href="/payment/products">Product</Link>

                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">

              <CardDataStats title="Payments this month" total={`${paymentDetails.paymentThisMonth}$`} rate="">
              </CardDataStats>
              <CardDataStats title="Over payments" total={`${paymentDetails.totalPendingAmount}$`} rate="">
              </CardDataStats>
              <CardDataStats title="Paid in time" total={`${paymentDetails.painInTime}%`} rate="">
              </CardDataStats>

            </div>
            <div className="mb-4 flex flex-wrap justify-between">
              <div className="flex flex-wrap w-full md:w-auto">
                <div className="relative mb-4 w-full md:w-auto">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <IoSearchOutline size={20} />
                  </div>
                  <input type="search" id="default-search" name="searchTerm" onChange={handleChange} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder="Search by resident or invoice ID" required />
                </div>
                <div ref={filterRef} className="flex items-center">
                  <button onClick={toggleFilterDropdown} type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-[#f0efef] font-medium rounded-lg text-sm px-6 py-3 md:ms-4 mb-4 dark:text-white dark:hover:bg-gray-700 flex items-center">
                    <IoFilterSharp className="mr-2" />Filters
                  </button>
                  <div className='w-full'>
                    <div className="relative inline-block">


                      {isFilterOpen && (
                        <div className=" absolute font-bold top-0 right-0 left-[-110px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li onClick={toggleStatusDropdown}>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"

                              >
                                Status
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


                      {isStatusOpen && (
                        <div className=" absolute top-0 font-bold z-10  left-[70px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown("completed")}
                              >
                                Completed
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown("pendingh")}
                              >
                                Pending
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown("")}
                              >
                                Reset
                              </button>
                            </li>

                          </ul>

                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
              <div className="flex flex-wrap w-full md:w-auto">
                <div className="w-full mr-3 md:w-auto mt-2 md:mt-0">
                  <button
                    type="button"
                    onClick={() => dispatch(toggleExportModal())}
                    className="w-full md:w-auto text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-3 ms-0 md:ms-4 mb-2 dark:text-white dark:hover:bg-gray-700 flex items-center justify-center md:justify-start"
                  >
                    <TfiExport className="mr-2 text-base" />
                    Export list
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <PaymentTable filterTerm={filterTerm} searchTerm={searchTerm} />
            </div>
            {(exportModal) && <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50">
            </div>}
            <ExportModal />
          </DefaultLayout>
        </>
      ) : null}
    </>
  );
};

export default PaymentManager;
