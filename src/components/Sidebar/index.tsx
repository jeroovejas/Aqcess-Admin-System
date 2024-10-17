"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { RxDashboard } from "react-icons/rx";
import { LuUsers2 } from "react-icons/lu";
import { FaRegQuestionCircle } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { MdDeck } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { MdSubscriptions } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { clearToken, clearUser, toggleIsTokenValid } from "@/store/Slices/AuthSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useRouter } from 'next/navigation';


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
          RxDashboard
        ),
        label: "Dashboard",
        route: "/",
      },
      {
        icon: (
          LuUsers2
        ),
        label: "Residents",
        route: "/residents",
      },
      {
        icon: (
          FaRegQuestionCircle
        ),
        label: "Survey",
        route: "/survey",
      },
      {
        icon: (
          IoWalletOutline
        ),
        label: "Payments",
        route: "#",
        children: [
          { label: "Payment History", route: "/payment/payment-history" },
          { label: "Products", route: "/payment/products" },
        ],
      },
      {
        icon: (
          MdDeck
        ),
        label: "Common Areas",
        route: "/common-areas",
      },
      {
        icon: (
          FaKey
        ),
        label: "Access History",
        route: "/access-history",
      },
      {
        icon: (
          MdManageAccounts
        ),
        label: "User Management",
        route: "/user-management",
      },
      {
        icon: (
          MdSubscriptions
        ),
        label: "Subscriptions",
        route: "/subscriptions",
      },
      {
        icon: (
          LiaFileInvoiceSolid
        ),
        label: "Invoices",
        route: "/invoices",
      },
    ],
  },

];


const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.userData);
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const dispatch = useAppDispatch()

  const logout = () => {
    router.push('/auth/login');
    setTimeout(() => {
      dispatch(clearToken())
      dispatch(clearUser())
      dispatch(toggleIsTokenValid())
    }, 3000)
  }

  const getFilteredMenuItems = () => {
    if (user.role === 1) {
      return menuGroups[0].menuItems.filter(item => ["User Management", "Subscriptions", "Invoices"].includes(item.label));
    } else if (user.role === 2) {
      // Return only the "Super Six" items
      return menuGroups[0].menuItems.filter(item => ["Dashboard", "Residents", "Survey", "Payments", "Common Areas", "Access History"].includes(item.label));
    }
    return []; // Default case
  };

  const filteredMenuItems = getFilteredMenuItems();


  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col bg-black duration-300 ease-linear dark:bg-boxdark  lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col justify-between h-[100vh]">
          <div>


            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
              <Link href="/">
                <Image
                  width={50}
                  height={50}
                  src={"/images/Authentication/logo.png"}
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
              <nav className="mt-5 px-4 py-4 ">
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
            <li className="border-b pb-6 border-[#344054]">
              <Link
                href="/settings"
                className={` group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 mx-3`}
              >
                <IoSettingsOutline className={``} />
                Settings

              </Link>
            </li>

            <div className="flex items-center  mx-3 my-2 py-2">
              <Link className=" inline-block" href="/settings">
                {user.profileImage !== null ?
                  <div className="flex-shrink-0">
                    <img src={user.profileImage} alt="Profile Image" width={35} height={35} />
                  </div> : <div className="flex-shrink-0">
                    <img src="/images/user/dummy.png" alt="Profile Image" width={35} height={35} />
                  </div>}
              </Link>
              <div className="ms-5 me-8">
                <p className="text-[14px] font-[600] text-white leading-4">{user.firstName} {user.lastName}</p>
                <p className="text-[14px] font-[400] leading-4">{user.email}</p>
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
