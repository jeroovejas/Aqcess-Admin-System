"use client";

import React, { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from '@/navigation';
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { MdDeck } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { MdManageAccounts, MdPlace } from "react-icons/md";
import { MdSubscriptions } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { clearToken, clearUser, toggleIsTokenValid } from "@/store/Slices/AuthSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useTranslations } from 'next-intl';
import { MdOutlineSubscriptions } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { AiOutlineDollar } from "react-icons/ai";
import { BsFillExplicitFill } from "react-icons/bs";
import { GrMoney } from "react-icons/gr";
import { RiProductHuntLine } from "react-icons/ri";
import { BsStars } from "react-icons/bs";


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const t = useTranslations();
  const packageId = useAppSelector((state) => state.auth.packageId);
  const [activePackage, setActivePackage] = useState(1)

  const menuGroups = [
    {
      name: "MENU",
      menuItems: [
        {
          icon: (
            RxDashboard
          ),
          label: `${t('SIDEBAR.lable1')}`,
          route: "/dashboard",
        },
        {
          icon: (
            LuUsers
          ),
          label: `${t('SIDEBAR.lable2')}`,
          route: "/residents",
        },
        {
          icon: (
            MdOutlineSecurity
          ),
          label: `${t('SIDEBAR.lable4')}`,
          route: "/security-guard",
        },
        {
          icon: (
            FaRegQuestionCircle
          ),
          label: `${t('SIDEBAR.lable3')}`,
          route: "/communication",
        },
        {
          icon: (
            IoWalletOutline
          ),
          label: `${t('SIDEBAR.lable5')}`,
          route: "#",
          children: [
            { label: `${t('SIDEBAR.lable16')}`, icon: (BsBank), route: "/payment/accounting" },
            // { label: `${t('SIDEBAR.lable6')}`, icon: (AiOutlineDollar), route: "/payment/payment-history" },
            // { label: `${t('SIDEBAR.lable15')}`, icon: (BsFillExplicitFill), route: "/payment/expenses" },
            { label: `${t('SIDEBAR.lable17')}`, icon: (GrMoney), route: "/payment/payment-tracker" },
            { label: `${t('SIDEBAR.lable7')}`, icon: (RiProductHuntLine), route: "/payment/products" },
          ],
        },
        {
          icon: (MdDeck),
          label: `${t('SIDEBAR.lable8')}`,
          route: "/common-areas",
        },
        {
          icon: (
            FaKey
          ),
          label: `${t('SIDEBAR.lable9')}`,
          route: "/access-history",
        },
        {
          icon: (
            MdManageAccounts
          ),
          label: `${t('SIDEBAR.lable11')}`,
          route: "/user-management",
        },
        {
          icon: (
            MdOutlineSubscriptions
          ),
          label: `${t('SIDEBAR.lable12')}`,
          route: "/subscriptions",
        },
        {
          icon: (
            LiaFileInvoiceSolid
          ),
          label: `${t('SIDEBAR.lable13')}`,
          route: "/invoices",
        },
        {
          icon: (
            MdPlace
          ),
          label: `${t('SIDEBAR.lable14')}`,
          route: "/places",
        },
        {
          icon: (
            MdOutlineSubscriptions
          ),
          label: `${t('SIDEBAR.lable18')}`,
          route: "/my-subscriptions",
        },
      ],
    },

  ];

  useEffect(() => {
    setActivePackage(packageId);

  }, [packageId]);

  const router = useRouter();
  const user = useAppSelector((state) => state.auth.userData);
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const dispatch = useAppDispatch();


  const logout = () => {
    router.push('/auth/login');
    dispatch(clearUser())
    setTimeout(() => {
      dispatch(clearToken())
      if (isTokenValid) {
        dispatch(toggleIsTokenValid())
      }
    }, 3000)
  }

  const getFilteredMenuItems = () => {
    if (user.role === 1) {
      return menuGroups[0].menuItems.filter(item => [`${t('SIDEBAR.lable11')}`, `${t('SIDEBAR.lable14')}`, `${t('SIDEBAR.lable12')}`].includes(item.label));
      // return menuGroups[0].menuItems.filter(item => [`${t('SIDEBAR.lable11')}`, `${t('SIDEBAR.lable12')}`, `${t('SIDEBAR.lable13')}`, `${t('SIDEBAR.lable14')}`].includes(item.label));
    } else if (user.role === 2) {

      if (activePackage == 1) {
        return menuGroups[0].menuItems.filter(item => [`${t('SIDEBAR.lable1')}`, `${t('SIDEBAR.lable2')}`, `${t('SIDEBAR.lable4')}`, `${t('SIDEBAR.lable9')}`, `${t('SIDEBAR.lable18')}`].includes(item.label));
      } else if (activePackage != 1) {
        return menuGroups[0].menuItems.filter(item => [`${t('SIDEBAR.lable1')}`, `${t('SIDEBAR.lable2')}`, `${t('SIDEBAR.lable4')}`, `${t('SIDEBAR.lable3')}`, `${t('SIDEBAR.lable5')}`, `${t('SIDEBAR.lable8')}`, `${t('SIDEBAR.lable9')}`, `${t('SIDEBAR.lable18')}`].includes(item.label));
      } else {
        return [];
      }

    }
    return []; // Default case
  };

  const filteredMenuItems = getFilteredMenuItems();


  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen overflow-y-scroll my-scrollbar  w-72.5 flex-col bg-black duration-300 ease-linear dark:bg-boxdark  lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col justify-between h-[100vh]">
          <div>


            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6">
              <Link href={`${user.role === 2 ? '/dashboard' : '/user-management'}`}>
                <Image
                  width={100}
                  height={100}
                  src={"/images/main/logo.png"}
                  alt="Logo"
                  priority
                />
              </Link>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-controls="sidebar"
                className="block lg:hidden"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear ">
              {/* <!-- Sidebar Menu --> */}
              <nav className=" px-4 py-4 ">
                {menuGroups.map((group, groupIndex) => (
                  <div key={groupIndex}>

                    <ul className="mb-0 flex flex-col gap-1.5">
                      {filteredMenuItems.map((menuItem, menuIndex) => (
                        <SidebarItem
                          key={menuIndex}
                          item={menuItem}
                          pageName={pageName}
                          setPageName={setPageName}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
              {/* <!-- Sidebar Menu --> */}
            </div>
          </div>
          <div className="">
            <div className="relative">
              {activePackage == 1 && user.role == 2 && <Link
                href="/my-subscriptions"
                className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out bg-blue-700 mx-3`}
              >
                <BsStars className={``} />
                {t('SIDEBAR.lable19')}
              </Link>}

              <Link
                href="/settings"
                className={` group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark mx-3`}
              >
                <IoSettingsOutline className={``} />
                {t('SIDEBAR.lable10')}

              </Link>
            </div>

            <div className="flex items-center   mx-3 my-2 py-2">
              <Link className=" inline-block" href="/settings">
                {user.profileImage !== null ?
                  <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src={user.profileImage} alt="Profile Image" className="w-full h-full object-cover" />
                  </div> : <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img src="/images/user/dummy.png" alt="Profile Image" className="w-full h-full object-cover" />
                  </div>}
              </Link>
              <div className="ms-5 me-8">
                <p className="text-[14px] font-[600] text-white truncate max-w-[150px] leading-4">{user.firstName} {user.lastName}</p>
                <p className="text-[14px] font-[400] leading-4 truncate max-w-[150px]">{user.email}</p>
              </div>
              <div>
                <MdLogout className="cursor-pointer" onClick={logout} />
              </div>
            </div>
          </div>
        </div>


      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
