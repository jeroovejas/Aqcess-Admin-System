"use client"
import { useState, useEffect } from "react";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { toggleEditModal, setSecurityGuardData, toggleViewModal, toggleStatusModal, setSecurityGuardDetails } from "@/store/Slices/SecurityGuardSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllSecurityGuards } from "@/lib/api/securityGuard";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";

const SecurityGuardTable: React.FC<any> = ({ searchTerm, filterTerm }) => {
  const limit = 10;
  const PAGE_RANGE = 5;
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const token = useAppSelector((state) => state.auth.token)
  const isUpdated = useAppSelector((state) => state.securityGuard.isUpdated)
  const [totalPages, setTotalPages] = useState(1);
  const [securityGuards, setSecurityGuards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEditSecurityGuard = (guard: any) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For a smooth scrolling effect
    });
    dispatch(setSecurityGuardData(guard))
    dispatch(toggleEditModal())
  }
  const handleViewSecurityGuard = (guard: any) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For a smooth scrolling effect
    });
    dispatch(setSecurityGuardData(guard))
    dispatch(toggleViewModal())
  }
  const handleClick = (guard: any) => {
    dispatch(setSecurityGuardData(guard))
    dispatch(toggleStatusModal())
  }



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
  useEffect(() => {
    setLoading(true);
    fetchSecurityGuards().finally(() => {
      setLoading(false);
    });
  }, [currentPage, isUpdated, searchTerm, filterTerm])


  const fetchSecurityGuards = async () => {
    try {
      let params = { page: currentPage, token: token, limit: limit, searchTerm: searchTerm, filterTerm: filterTerm }
      const response = await getAllSecurityGuards(params);

      // Check the success property to determine if the request was successful
      if (response.success) {
        setSecurityGuards(response.data.data.allSecurityGuards);
        setTotalPages(response.data.data.pagination.totalPages)
        dispatch(setSecurityGuardDetails({
          totalSecurityGuards: response.data.data.totalSecurityGuards,
          activeSecurityGuards: response.data.data.activeSecurityGuards,
        }))
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during security guards Fetch:', err.message);
    }
  }
  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
        Your Security Guards
      </h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-auto  text-black">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Security Guard Name</th>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Address</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {securityGuards.length === 0 ? (
                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan={6} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                    No Data Found
                  </td>
                </tr>
              ) : (
                securityGuards.map((guard, key) => (
                  <tr key={key} className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                    <th className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {guard.profileImage !== null ?
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img src={guard.profileImage} alt="Profile Image" className="w-full h-full object-cover" />
                        </div> : <div className="flex-shrink-0">
                          <img src="/images/user/dummy.png" alt="Profile Image" width={35} height={35} />
                        </div>}
                      <p className="text-black font-bold dark:text-white ml-2">
                        {guard.firstName} {guard.lastName}
                      </p>
                    </th>
                    <td className="px-6 py-4 whitespace-nowrap">{guard.securityGuard.securityGuardCode}</td>
                    <td className="px-6 py-4 font-bold whitespace-nowrap">{guard.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{guard.securityGuard.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center font-bold">
                        <span className={`${guard.status === 'active' ? 'text-meta-3 bg-[#ECFDF3]' : 'text-meta-1 bg-[#FEF3F2]'} flex items-center p-2 rounded-full`}>
                          {/* <GoDotFill className="mr-1" style={{ color: resident.status === 'active' ? '#22C55E' : '#EF4444' }} />  */}
                          {guard.status.charAt(0).toUpperCase() + guard.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="relative group whitespace-nowrap overflow-visible">
                      <BsThreeDotsVertical className="text-black" />
                      <ul className="absolute z-50 bottom-0 mb-0 w-[150px] right-2 text-[14px] bg-white hidden group-hover:block text-black border border-gray shadow-lg">
                        <li onClick={() => handleViewSecurityGuard(guard)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">
                          View
                        </li>
                        <li onClick={() => handleEditSecurityGuard(guard)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">
                          Edit
                        </li>
                        <li onClick={() => handleClick(guard)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">
                          {guard.status === 'active' ? 'Deactivate' : 'Activate'}
                        </li>
                      </ul>
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

export default SecurityGuardTable;
