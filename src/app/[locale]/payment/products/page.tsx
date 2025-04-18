"use client"
import { useState, useEffect, useRef } from "react";
import ProductTable from "@/components/Tables/ProductTable";
import { IoFilterSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FaChevronRight } from "react-icons/fa";
import AddProduct from "@/components/PaymentComponents/AddProduct";
import { toggleAddProduct, resetProductState } from "@/store/Slices/PaymentSlice";
import EditProduct from "@/components/PaymentComponents/EditProduct";
import ToggleStatusModal from "@/components/PaymentComponents/ToggleStatusModal";
import DuplicateModal from "@/components/PaymentComponents/DuplicateModal";
import Loader from "@/components/common/Loader";
import { Link, useRouter } from '@/navigation';
import { IoSearchOutline } from "react-icons/io5";
import { useTranslations } from 'next-intl';

const Products = () => {
  const t = useTranslations();
  const addProduct = useAppSelector((state) => state.payment.addProduct)
  const editProduct = useAppSelector((state) => state.payment.editProduct)
  const statusModal = useAppSelector((state) => state.payment.statusModal)
  const duplicateModal = useAppSelector((state) => state.payment.duplicateModal)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTerm, setFilterTerm] = useState<string>('');
  const filterRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch()
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

  const handleAddProduct = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For a smooth scrolling effect
    });
    dispatch(toggleAddProduct())
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
    dispatch(resetProductState())
  }, [router])

  useEffect(() => {
    if (addProduct || editProduct || statusModal || duplicateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [addProduct, editProduct, statusModal, duplicateModal]);

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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                {t('PRODUCT.title')}
              </h2>
            </div>
            <div className="mx-auto">
              <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
                <div className="text-sm font-semibold ms-3 my-2 me-3">
                  <Link href="/payment/accounting">{t('PAYMENT.tab4')}</Link>
                </div>
                <div className="text-sm font-semibold my-2 me-3">
                  <Link href="/payment/payment-history">{t('PAYMENT.tab1')}</Link>
                </div>
                <div className="text-sm font-semibold my-2 me-3">
                  <Link href="/payment/expenses">{t('PAYMENT.tab3')}</Link>
                </div>
                <div className="text-sm font-semibold my-2 me-3">
                  <Link href="/payment/payment-tracker">{t('PAYMENT.tab5')}</Link>
                </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-semibold rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center me-3">
                  {t('PAYMENT.tab2')}
                </button>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap justify-between">
              <div className="flex flex-wrap w-full md:w-auto">
                <div className="relative mb-4 w-full md:w-auto">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <IoSearchOutline size={20} />
                  </div>
                  <input type="search" id="default-search" name="searchTerm" onChange={handleChange} value={searchTerm} className="block w-full md:w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg outline-none" placeholder={t('PRODUCT.search')} required />
                </div>
                <div ref={filterRef} className="flex items-center">
                  <button onClick={toggleFilterDropdown} type="button" className="text-white bg-black border border-gray-300  font-medium rounded-lg text-sm px-6 py-3 md:ms-4 mb-4 dark:text-white dark:hover:bg-gray-700 flex items-center">
                    <IoFilterSharp className="mr-2" />{t('PRODUCT.filterButton')}
                  </button>
                  <div className='w-full'>
                    <div className="relative inline-block">
                      {isFilterOpen && (
                        <div className=" absolute font-bold top-0 right-0 left-[-110px] mt-4 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <li onClick={toggleStatusDropdown}>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left">
                                {t('COMMON.type')}
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
                                onClick={() => closeDropdown('')}>
                                {t('COMMON.type2')}
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown('draft')}>
                                {t('COMMON.lable6')}
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown('active')}>
                                {t('COMMON.lable7')}
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                onClick={() => closeDropdown('inactive')}>
                                {t('COMMON.lable8')}
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
                    onClick={handleAddProduct}
                    type="button"
                    className="w-full justify-center text-white bg-primary-blue font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center">
                    <IoIosAdd className="mr-2 text-white text-xl" />{t('PRODUCT.button1')}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <ProductTable searchTerm={searchTerm} filterTerm={filterTerm} />
            </div>
            {(addProduct || editProduct || statusModal || duplicateModal) && <div className=" min-h-[100vh] absolute top-0 left-0 w-full h-full bg-black opacity-50">
            </div>}
            <AddProduct />
            <EditProduct />
            <ToggleStatusModal />
            <DuplicateModal />
          </DefaultLayout>
        </>
      ) : null}
    </>
  );
};

export default Products;