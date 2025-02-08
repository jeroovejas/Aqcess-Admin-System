"use client"
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { toggleEditModal, toggleAssignModal, setPlaceData } from "@/store/Slices/PlaceSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllPlaces } from "@/lib/api/place";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "../common/Loader";
import { toTitleCase } from "@/lib/common.modules";
import * as Select from '@radix-ui/react-select';
import { useLocale, useTranslations } from 'next-intl';


const PlaceTable: React.FC<any> = ({ searchTerm }) => {
  const t = useTranslations();
  const limit = 10;
  const PAGE_RANGE = 5;
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1);
  const token = useAppSelector((state) => state.auth.token)
  const isUpdated = useAppSelector((state) => state.place.isUpdated)
  const [totalPages, setTotalPages] = useState(1);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);
  const handleUserSelection = (selected: any) => {
    setSelectedPlaces(selected);
  };

  const handleAssignPlaces = () => {
    if (selectedPlaces.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    const selectedPlaceIds = selectedPlaces.map((place: any) => place.id);
  };

  const handleEditPlace = (place: any) => {
    dispatch(toggleEditModal())
    dispatch(setPlaceData(place))
  }

  const handleAssignPlace = (place: any) => {
    dispatch(toggleAssignModal())
    dispatch(setPlaceData(place))
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
  }, [currentPage, isUpdated, searchTerm])


  const fetchResidents = async () => {
    try {

      let params = { page: currentPage, token: token, limit: limit, searchTerm: searchTerm }
      const response = await getAllPlaces(params);

      // Check the success property to determine if the request was successful
      if (response.success) {
        setPlaces(response.data.data.allPlaces);
        setTotalPages(response.data.data.pagination.totalPages)
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during Places Fetch:', err.message);
    }
  }
  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold   text-black dark:text-white">
        {t('PLACE.table.title')}
      </h4>
      {loading ? (
        <Loader />
      ) : (
        <div className="relative overflow-x-auto text-black">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t('PLACE.table.col1')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PLACE.table.col2')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PLACE.table.col3')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PLACE.table.col4')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PLACE.table.col5')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PLACE.table.col6')}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t('PLACE.table.col7')}
                </th>

                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              {places.length === 0 ? (
                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan={6} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                    {t('COMMON.noDataText')}
                  </td>
                </tr>
              ) : (
                places.map((place, key) => (
                  <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                    <td className="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={place.imageUrl} alt="Place Image" className="w-full h-full object-cover" />
                      </div>
                      <p className=" text-black font-bold dark:text-white ml-2">
                        {place.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.contact_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.whatsapp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {place.website}
                    </td>
                    <td className={`px-4 py-4 flex items-center font-bold  whitespace-nowrap`}>
                      <div className={`flex items-center p-2 rounded-2xl ${place.placeCurrentStatus === 'open' ? 'text-meta-3 bg-[#ECFDED]' : place.placeCurrentStatus === 'closed' ? 'text-meta-1 bg-[#FEF3F2]' : 'bg-yellow-100 text-yellow-700'}`}>
                        {toTitleCase(place.placeCurrentStatus)}
                      </div>
                    </td>
                    <td className="relative group whitespace-nowrap">
                      <button
                        onClick={() => handleAssignPlace(place)}
                        className="bg-primary-blue text-white px-4 py-2 rounded mr-2"
                      >
                        {t('PLACE.table.assignButton')}
                      </button>
                    </td>
                    <td className="relative group whitespace-nowrap">
                      <BsThreeDotsVertical className="text-black" />
                      <ul className="absolute z-20 top-5 w-[150px] right-2 my-4 text-[14px] bg-white hidden group-hover:block  text-black border border-gray ">
                        <li onClick={() => handleEditPlace(place)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">{t('PLACE.table.editButton')}</li>
                      </ul>
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
                {t('COMMON.previous')}
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
                {t('COMMON.next')}
                <FaArrowRight className="ml-1" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div >
  );
};

export default PlaceTable;
