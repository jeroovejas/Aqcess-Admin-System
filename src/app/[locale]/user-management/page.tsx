"use client"
import { useState, useEffect, useRef } from "react";
import { IoFilterSharp } from "react-icons/io5";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FaChevronRight } from "react-icons/fa";
import UserManagementTable from "@/components/Tables/userManagementTable";
import StatusModal from "@/components/UserManagement/StatusModal";
import DeleteModal from "@/components/UserManagement/DeleteModal";
import { IoSearchOutline } from "react-icons/io5";
// import { useRouter } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/navigation';
import { resetState } from "@/store/Slices/UserManagementSlice";
import { showErrorToast } from "@/lib/toastUtil";
import Loader from "@/components/common/Loader";
import { toggleIsTokenValid, setUserData, clearToken, clearUser } from "@/store/Slices/AuthSlice";
import { verifyToken } from "@/lib/api/auth";
import { showSuccessToast } from "@/lib/toastUtil";
import { useTranslations } from 'next-intl';

const UserManagement = () => {
    const t = useTranslations();
    const router = useRouter();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterTerm, setFilterTerm] = useState<string>('');
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const [verified, setVerified] = useState<boolean | null>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const statusModal = useAppSelector((state) => state.userManagement.statusModal)
    const deleteModal = useAppSelector((state) => state.userManagement.deleteModal)
    const token = useAppSelector((state) => state.auth.token)
    const dispatch = useAppDispatch()
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
        const checkUser = async () => {
            const response = await verifyToken({ token: token });
            if (response.success) {
                if (response.data.data.role === 3) {
                    router.push('/auth/login');
                    setTimeout(() => {
                        showErrorToast("Permission denied!");
                    }, 2000);
                } else {
                    setVerified(true);
                    dispatch(setUserData(response.data.data))
                    if (!isTokenValid) {
                        dispatch(toggleIsTokenValid())
                        showSuccessToast(`Welcome  ${response.data.data.firstName} ${response.data.data.lastName}`)
                    }
                }
            } else {
                router.push('/auth/login');
                if (isTokenValid) {
                    dispatch(toggleIsTokenValid())
                }
                dispatch(clearToken())
                dispatch(clearUser())
            }
        };
        checkUser()
    }, [token, router, dispatch])

    useEffect(() => {
        dispatch(resetState())
    }, [router])

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

    useEffect(() => {
        if (statusModal || deleteModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [statusModal, deleteModal]);

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
                                {t('USERMANAGEMENT.main.title')}
                            </h2>
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
                                        placeholder={t('USERMANAGEMENT.main.searchTitle')}
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
                                        {t('COMMON.filter')}
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
                                                                {t('COMMON.type2')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                type="button"
                                                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                                                onClick={() => closeDropdown("active")}
                                                            >
                                                                {t('COMMON.status')}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                type="button"
                                                                className="block w-full px-4 py-2 text-[16px] text-gray-700 hover:bg-[#f0efef] text-left"
                                                                onClick={() => closeDropdown("deactivated")}
                                                            >
                                                                {t('COMMON.status2')}
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
                            <UserManagementTable searchTerm={searchTerm} filterTerm={filterTerm} />
                        </div>
                        {(statusModal || deleteModal) && <div className="absolute top-0 left-0  w-full min-h-[100vh]  h-full bg-black opacity-50">
                        </div>}
                        <StatusModal />
                        <DeleteModal />
                    </DefaultLayout>
                </>
            ) : null}
        </>
    );
};

export default UserManagement;