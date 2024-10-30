"use client"
import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleStatusModal, setAdminData, toggleDeleteModal } from "@/store/Slices/UserManagementSlice";
import { showErrorToast } from "@/lib/toastUtil";
import { getAllSocietyAdmins } from "@/lib/api/userManagement";
import Loader from "../common/Loader";
import { useRouter } from 'next/navigation';
import { toTitleCase } from "@/lib/common.modules";

const UserManagementTable: React.FC<any> = ({ searchTerm, filterTerm }) => {
  const limit = 10;
  const PAGE_RANGE = 5;
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const token = useAppSelector((state) => state.auth.token)
  const isUpdated = useAppSelector((state) => state.userManagement.isUpdated)
  const [totalPages, setTotalPages] = useState(1);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const handleView = async (admin: any) => {
    window.scrollTo(0, 0);
    router.push(`/user-management/view/${admin.id}`)
  };

  const handleStatusChange = (admin: any) => {
    dispatch(toggleStatusModal())
    dispatch(setAdminData(admin))
  }

  const handleDelete = (admin: any) => {
    dispatch(toggleDeleteModal())
    dispatch(setAdminData(admin))
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
    fetchRSocietyAdmins().finally(() => {
      setLoading(false);
    });
  }, [currentPage, isUpdated, searchTerm, filterTerm])


  const fetchRSocietyAdmins = async () => {
    try {
      let params = { page: currentPage, token: token, limit: limit, searchTerm: searchTerm, filterTerm: filterTerm }
      const response = await getAllSocietyAdmins(params);

      // Check the success property to determine if the request was successful
      if (response.success) {
        setAdmins(response.data.data.allAdmins);
        setTotalPages(response.data.data.pagination.totalPages)
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during Society Admins Fetch:', err.message);
    }
  }
  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold   text-black dark:text-white">
        Society Admin Details
      </h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-auto text-black">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Admin name
                </th>
                <th scope="col" className="px-6 py-3">
                  Admin Email
                </th>
                <th scope="col" className="px-6 py-3 flex items-center space-x-2">
                  Admin Status
                  {/* <FaArrowDown className="ml-2 mt-1" /> */}
                </th>
                <th scope="col" className="px-6 py-3">
                  Last Logged In
                </th>
                <th scope="col" className="px-6 py-3">
                  Login Type
                </th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 ? (
                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan={6} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                    No Data Found
                  </td>
                </tr>
              ) : (
                admins.map((admin, key) => (
                  <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                    <th className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {admin.profileImage !== null ?
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={admin.profileImage} alt="Profile Image" className="w-full h-full object-cover" />
                        </div> : <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src="/images/user/dummy.png" alt="Profile Image" className="w-full h-full object-cover" />
                        </div>}
                      <p className="text-black font-bold dark:text-white mt-2 ml-2">
                        {admin.firstName} {admin.lastName}
                      </p>
                    </th>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.email}
                    </td>
                    <td className={`px-6 py-4 ${admin.status == 'active' ? 'text-meta-3' : 'text-meta-1'} whitespace-nowrap`}>
                      <div className="flex items-center">
                        {toTitleCase(admin.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.lastLoggedIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.loginType}
                    </td>
                    <td className=" relative px-6 group whitespace-nowrap">
                      <BsThreeDotsVertical className="text-black " />
                      <ul className="absolute z-500 bottom-0 mb-0 w-[150px] right-2 text-[14px]  bg-white hidden group-hover:block  text-black border border-gray ">
                        <li className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleView(admin)}>View </li>
                        {/* <li className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleDelete(admin)}>Delete</li> */}
                        <li onClick={() => handleStatusChange(admin)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">
                          {admin.status === 'active' ? 'Deactivate' : 'Activate'}
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

export default UserManagementTable;
