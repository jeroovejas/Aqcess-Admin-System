"use client"
import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Loader from "../common/Loader";
import { toggleEditProduct, setProductData, toggleStatusModal, toggleDuplicateModal } from "@/store/Slices/PaymentSlice";
import { getAllProducts } from "@/lib/api/product";
import { showErrorToast } from "@/lib/toastUtil";
import { toTitleCase } from "@/lib/common.modules";
import { useLocale, useTranslations } from 'next-intl';


const ProductTable: React.FC<any> = ({ searchTerm, filterTerm }) => {
      const t = useTranslations();
    
    const limit = 10;
    const PAGE_RANGE = 5;
    const dispatch = useAppDispatch()
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const isUpdated = useAppSelector((state) => state.payment.isUpdated)
    const token = useAppSelector((state) => state.auth.token);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleEditProduct = (product: any) => {
        dispatch(setProductData(product))
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // For a smooth scrolling effect
        });
        dispatch(toggleEditProduct())
    }

    const handleDuplicateProduct = (product: any) => {
        dispatch(setProductData(product))
        dispatch(toggleDuplicateModal())
    }

    const handleClick = (product: any) => {
        dispatch(setProductData(product))
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
        fetchProducts().finally(() => {
            setLoading(false);
        });
    }, [currentPage, isUpdated, searchTerm, filterTerm])

    const fetchProducts = async () => {
        try {

            let params = { page: currentPage, token: token, limit: limit, searchTerm: searchTerm, filterTerm: filterTerm }
            const response = await getAllProducts(params);

            // Check the success property to determine if the request was successful
            if (response.success) {
                setProducts(response.data.data.allProduct);
                setTotalPages(response.data.data.pagination.totalPages)
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during Products Fetch:', err.message);
        }
    }
    return (

        <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
            <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
            {t('PRODUCT.table.title')}
            </h4>
            {loading ? (
                <Loader />
            ) : (
                <div className="relative overflow-x-auto text-black">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                {t('PRODUCT.table.column1')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                {t('PRODUCT.table.column2')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                {t('PRODUCT.table.column3')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                {t('PRODUCT.table.column5')}
                                </th>
                                <th scope="col" className="px-6 py-3">
                                {t('PRODUCT.table.column4')}
                                </th>
                                <th>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                                    <td colSpan={6} className="px-6 py-4 text-center font-bold text-gray-500 dark:text-gray-400">
                                        No Data Found
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, key) => (
                                    <tr key={key} className="bg-white border-b font-medium border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-bold whitespace-nowrap">
                                            {product.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            ${product.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.type}
                                        </td>
                                        <td className={`px-4 py-4 flex items-center font-bold  whitespace-nowrap`}>
                                            <div className={`flex items-center p-2 rounded-2xl ${product.status === 'active' ? 'text-meta-3 bg-[#ECFDED]' : product.status === 'inactive' ? 'text-meta-1 bg-[#FEF3F2]' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {toTitleCase(product.status)}
                                            </div>
                                        </td>
                                        <td className="relative py-4  group whitespace-nowrap">
                                            <BsThreeDotsVertical className="text-black mt-4 text-xl" />
                                            <ul className="absolute z-500 bottom-0 mb-0 w-[150px] right-2 text-[14px] bg-white hidden group-hover:block  text-black border border-gray ">
                                                <li
                                                    onClick={() => handleEditProduct(product)}
                                                    className="px-8 py-2 font-semibold  cursor-pointer hover:bg-[#f0efef]">Edit</li>
                                                <li className="px-8 py-2 font-semibold  cursor-pointer hover:bg-[#f0efef]" onClick={() => handleDuplicateProduct(product)}  >Duplicate</li>
                                                <li className="px-8 py-2 font-semibold  cursor-pointer hover:bg-[#f0efef]" onClick={() => handleClick(product)}>{product.status === 'active' ? 'Deactivate' : 'Activate'}</li>
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

export default ProductTable;
