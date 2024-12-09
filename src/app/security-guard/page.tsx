"use client"
import { useState, useRef, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SecurityGuardTable from "@/components/Tables/securityGuardTable";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import { IoIosAdd } from "react-icons/io";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import { toggleExportModal, toggleAddModal, resetState } from "@/store/Slices/SecurityGuardSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AddModal from "@/components/SecurityGuardComponents/AddModal";
import SaveChangesModal from "@/components/SecurityGuardComponents/SaveChangesModal";
import DeleteModal from "@/components/SecurityGuardComponents/DeleteModal";
import EditModal from "@/components/SecurityGuardComponents/EditModal";
import ViewModal from "@/components/SecurityGuardComponents/ViewModal";
import ExportModal from "@/components/SecurityGuardComponents/exportModal";
import StatusModal from "@/components/SecurityGuardComponents/StatusModal";
import { FaChevronRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "@/components/common/Loader";
import { IoSearchOutline } from "react-icons/io5";



const SecurityGuard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.userData);
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const [verified, setVerified] = useState<boolean | null>(null);
  const exportModal = useAppSelector((state) => state.securityGuard.exportModal)
  const saveModal = useAppSelector((state) => state.securityGuard.saveModal)
  const deleteModal = useAppSelector((state) => state.securityGuard.deleteModal)
  const viewModal = useAppSelector((state) => state.securityGuard.viewModal)
  const addModal = useAppSelector((state) => state.securityGuard.addModal)
  const editModal = useAppSelector((state) => state.securityGuard.editModal)
  const statusModal = useAppSelector((state) => state.securityGuard.statusModal)
  const securityGuardDetails = useAppSelector((state) => state.securityGuard.securityGuardDetails)
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
    if (addModal || exportModal || viewModal || editModal || statusModal || saveModal || deleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [addModal, exportModal, deleteModal, editModal, viewModal, statusModal, saveModal]);

  const handleAddResident = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For a smooth scrolling effect
    });
    dispatch(toggleAddModal())
  };

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
          <DefaultLayout >
            <Breadcrumb pageName="Security guard manager" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-5">
              <CardDataStats title="Total security guards" total={`${securityGuardDetails.totalSecurityGuards}`} rate="">
              </CardDataStats>
              <CardDataStats title="Active security guards" total={`${securityGuardDetails.activeSecurityGuards}`} rate="">
              </CardDataStats>
            </div>
            <div className="mb-4 flex flex-wrap justify-between">
              <div className="flex flex-wrap w-full md:w-auto">
                <div className="relative mb-4 w-full md:w-auto">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <IoSearchOutline size={20} />
                  </div>
                  <input
                    type="search"
                    name="searchTerm"
                    onChange={handleChange}
                    value={searchTerm}
                    id="default-search"
                    className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none"
                    placeholder="Search by security guard name or ID"
                    required
                  />
                </div>
                <div ref={filterRef} className="flex items-center">
                  <button
                    onClick={toggleFilterDropdown}
                    type="button"
                    className=" text-gray-900 bg-white border border-gray-300 hover:bg-[#f0efef] font-medium rounded-lg text-sm px-6 py-3 ms-0 md:ms-4 mb-4 dark:text-white dark:hover:bg-gray-700 flex items-center justify-center "
                  >
                    <IoFilterSharp className="mr-2" />
                    Filters
                  </button>
                  <div className="w-full">
                    <div className="relative inline-block">
                      {isFilterOpen && (
                        <div className="absolute font-bold top-0 right-0 left-[-110px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 ">
                          <ul
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
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
                  <div className="w-full">
                    <div className="relative inline-block">
                      {isStatusOpen && (
                        <div className="absolute top-0 font-bold left-[70px] mt-4 w-32 md:w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                          <ul
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
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
                                onClick={() => closeDropdown("active")}
                              >
                                Active
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown("deactivated")}
                              >
                                Deactivated
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
                <div className="w-full md:mr-3 md:w-auto md:mt-0">
                  <button
                    type="button"
                    onClick={() => dispatch(toggleExportModal())}
                    className="w-full md:w-auto text-gray-900 bg-white border border-gray-300 font-medium rounded-lg text-sm px-6 py-3 ms-0 md:ms-1 mb-2  flex items-center justify-center md:justify-start"
                  >
                    <TfiExport className="mr-2 text-base" />
                    Export list
                  </button>
                </div>
                <div className="w-full md:w-auto mt-2 md:mt-0">
                  <button
                    type="button"
                    onClick={handleAddResident}
                    className="w-full md:w-auto text-white bg-primary-blue font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center justify-center md:justify-start "
                  >
                    <IoIosAdd className="mr-2 text-white text-2xl" />
                    Add Security Guard
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <SecurityGuardTable searchTerm={searchTerm} filterTerm={filterTerm} />
            </div>
            {(exportModal || saveModal || deleteModal || statusModal || viewModal || addModal || editModal) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
            </div>}
            <ExportModal />
            <SaveChangesModal />
            <AddModal />
            <EditModal />
            <ViewModal />
            <StatusModal />
            <DeleteModal />
          </DefaultLayout>
        </>
      ) : null}
    </>
  );
};

export default SecurityGuard;