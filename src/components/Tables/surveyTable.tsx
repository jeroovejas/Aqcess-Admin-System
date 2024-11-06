"use client"
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa";
import { toggleReOpenModal, toggleEditModal, setSurveyData, toggleViewModal, toggleDuplicateModal, toggleCloseModal, setSurveysDetails } from "@/store/Slices/SurveySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllSurveys } from "@/lib/api/survey";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { toTitleCase } from "@/lib/common.modules";

const SurveyTable: React.FC<any> = ({ searchTerm, filterTerm }) => {
  const limit = 10;
  const PAGE_RANGE = 5;
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const token = useAppSelector((state) => state.auth.token)
  const isUpdated = useAppSelector((state) => state.survey.isUpdated)
  const [totalPages, setTotalPages] = useState(1);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEidt = (survey: any) => {
    dispatch(toggleEditModal())
    dispatch(setSurveyData(survey))
  }

  const handleView = (survey: any) => {
    dispatch(toggleViewModal())
    dispatch(setSurveyData(survey))
  }

  const handleDuplicateSurvey = (survey: any) => {
    dispatch(toggleDuplicateModal())
    dispatch(setSurveyData(survey))
  }

  const handleCloseSurvey = (survey: any) => {
    dispatch(toggleCloseModal())
    dispatch(setSurveyData(survey))
  }

  const handleReOpenSurvey = (survey: any) => {
    dispatch(toggleReOpenModal())
    dispatch(setSurveyData(survey))
  }

  const getSurveyDetails = (survey: any) => {
    dispatch(toggleViewModal())
    dispatch(setSurveyData(survey))
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
    fetchResidents().finally(() => {
      setLoading(false);
    });
  }, [currentPage, isUpdated, searchTerm, filterTerm])

  const fetchResidents = async () => {
    try {

      let params = { page: currentPage, token: token, limit: limit, searchTerm: searchTerm, filterTerm: filterTerm }
      const response = await getAllSurveys(params);

      // Check the success property to determine if the request was successful
      if (response.success) {
        setSurveys(response.data.data.allSurveys);
        setTotalPages(response.data.data.pagination.totalPages)
        dispatch(setSurveysDetails({
          totalSurveys: response.data.data.totalSurveys,
          openedSurveys: response.data.data.openedSurveys,
          averageResponse: response.data.data.averageResponse
        }))
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during Surveys Fetch:', err.message);
    }
  }
  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold   text-black dark:text-white">
        Your Surveys
      </h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-auto text-black">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Survey name
                </th>
                <th scope="col" className="px-6 py-3">
                  Survey opened
                </th>
                <th scope="col" className="px-6 py-3">
                  Deadline
                </th>
                <th scope="col" className="px-6 py-3">
                  Responses
                </th>
                <th scope="col" className="px-6 py-3 flex items-center space-x-2">
                  Status
                  <FaArrowDown className="ml-2 mt-1" />
                </th>
                <th>
                </th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              {surveys.length === 0 ? (
                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan={6} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                    No Data Found
                  </td>
                </tr>
              ) : (
                surveys.map((survey, key) => (
                  <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                    <td scope="row" className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <p className=" text-black font-bold dark:text-white  mt-2">
                        {survey.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {survey.surveyOpened}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {survey.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {survey.surveyResponses}
                    </td>
                    <td className={`px-6 py-4 flex items-center whitespace-nowrap`}>
                      <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium 
                        ${survey.status === 'open' ? 'bg-green-100 text-green-700' :
                          survey.status === 'closed' ? 'bg-danger-light text-danger' : 'bg-yellow-100 text-yellow-700'}`}>
                        {toTitleCase(survey.status)}
                      </div>
                    </td>
                    <td className=" relative group whitespace-nowrap">
                      <BsThreeDotsVertical className="text-black" />
                      <ul className="absolute z-500 bottom-0 mb-0 w-[150px] right-2 text-[14px] bg-white hidden group-hover:block  text-black border border-gray ">
                        {/* <li className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleView(survey)}>View Results</li> */}
                        {survey.status === 'draft' && <li className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleEidt(survey)}>Edit</li>}
                        <li className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]" onClick={() => handleDuplicateSurvey(survey)}>Duplicate</li>
                        {survey.status === 'open' ?
                          <li onClick={() => handleCloseSurvey(survey)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">Close Survey</li>
                          : <li onClick={() => handleReOpenSurvey(survey)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">{survey.status === "draft" ? "Open Survey" : "Reopen Survey"}</li>}
                      </ul>
                    </td>
                    <td>
                      <FaChevronRight onClick={() => getSurveyDetails(survey)}
                        className="text-black mx-4 cursor-pointer" />
                    </td>
                  </tr>
                )
                )
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

export default SurveyTable;
