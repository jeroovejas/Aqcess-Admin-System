"use client"
import { useState, useEffect, useRef } from "react";
import SurveyTable from "@/components/Tables/surveyTable";
import { IoFilterSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaChevronRight } from "react-icons/fa";
import ReOpenSurvey from "@/components/SurveyComponents/ReopenSurvey";
import AddSurvey from "@/components/SurveyComponents/AddSurvey";
import { toggleAddModal, resetState } from "@/store/Slices/SurveySlice";
import EditSurvey from "@/components/SurveyComponents/EditSurvey";
import ViewSurvey from "@/components/SurveyComponents/ViewSurvey";
import DuplicateModal from "@/components/SurveyComponents/DuplicateModal";
import CloseSurvey from "@/components/SurveyComponents/CloseSurvey";
import { useRouter } from 'next/navigation';
import Loader from "@/components/common/Loader";
import { showErrorToast } from "@/lib/toastUtil";
import { IoSearchOutline } from "react-icons/io5";

const Surveys = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const [verified, setVerified] = useState<boolean | null>(null);
  const reOpenModal = useAppSelector((state) => state.survey.reOpenModal)
  const addModal = useAppSelector((state) => state.survey.addModal)
  const editModal = useAppSelector((state) => state.survey.editModal)
  const viewModal = useAppSelector((state) => state.survey.viewModal)
  const duplicateModal = useAppSelector((state) => state.survey.duplicateModal)
  const exportModal = useAppSelector((state) => state.survey.exportModal)
  const surveysDetails = useAppSelector((state) => state.survey.surveysDetails)
  const closeSurvey = useAppSelector((state) => state.survey.closeSurvey)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTerm, setFilterTerm] = useState<string>('');
  const filterRef = useRef<HTMLDivElement>(null);
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
      // setTimeout(() => {
      //   showErrorToast("Plz Login First");
      // }, 2000);
    }
  }, [isTokenValid, router])

  useEffect(() => {
    dispatch(resetState())
  }, [router])

  useEffect(() => {
    if (reOpenModal || duplicateModal || closeSurvey || exportModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [reOpenModal, duplicateModal, closeSurvey || exportModal]);

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


  if (addModal) {
    return <AddSurvey />
  }
  if (viewModal) {
    return <ViewSurvey />
  }
  if (editModal) {
    return <EditSurvey />
  }
  if (verified === null) {
    return <Loader />
  }
  return (
    <>
      {verified ? (
        <>
          <DefaultLayout>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-title-md2 font-bold text-black dark:text-white">
                Survey Manager
              </h2>
              <nav>
                <div className="">
                  <button onClick={() => dispatch(toggleAddModal())} type="button" className="text-white bg-primary-blue  font-medium rounded-lg text-[16px] px-6 py-3 text-center inline-flex items-center mb-2">
                    <IoIosAdd className="mr-2 text-white text-xl" />Create new
                  </button>
                </div>
              </nav>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">
              <CardDataStats title="Total surveys" total={`${surveysDetails.totalSurveys}`} rate="">
              </CardDataStats>
              <CardDataStats title="Open surveys" total={`${surveysDetails.openedSurveys}`} rate="">
              </CardDataStats>
              <CardDataStats title="Average response rate" total={`${surveysDetails.averageResponse}%`} rate="">
              </CardDataStats>
            </div>
            <div className="mb-4 flex flex-wrap justify-between">
              <div className="flex flex-wrap w-full md:w-auto">
                <div className="relative mb-4 w-full md:w-auto">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <IoSearchOutline size={20} />
                  </div>
                  <input type="search" id="default-search" onChange={handleChange} value={searchTerm} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder="Search for survey" required />
                </div>
                <div ref={filterRef} className="flex items-center">
                  <button onClick={toggleFilterDropdown} type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-[#f0efef] font-medium rounded-lg text-sm px-6 py-3 md:ms-4 mb-4 dark:text-white dark:hover:bg-gray-700 flex items-center">
                    <IoFilterSharp className="mr-2" />Filters
                  </button>
                  <div className="w-full">
                    <div className="relative inline-block">
                      {isFilterOpen && (
                        <div className="absolute font-bold top-0 right-0 left-[-110px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li onClick={toggleStatusDropdown}>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                              >
                                Status
                                <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                  <FaChevronRight size={15} />
                                </span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="relative inline-block">
                      {isStatusOpen && (
                        <div className="absolute top-0 font-bold left-[70px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                          <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown("")}
                              >
                                All
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown("open")}
                              >
                                Open
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown("closed")}
                              >
                                Closed
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <SurveyTable searchTerm={searchTerm} filterTerm={filterTerm} />
            </div>
            {(reOpenModal || duplicateModal || closeSurvey) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
            </div>}
            <ReOpenSurvey />
            <DuplicateModal />
            <CloseSurvey />
          </DefaultLayout>
        </>
      ) : null}
    </>
  );
};

export default Surveys;
