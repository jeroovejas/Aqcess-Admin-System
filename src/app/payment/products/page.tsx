import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductTable from "@/components/Tables/ProductTable";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";
import { IoFilterSharp } from "react-icons/io5";
import { TfiExport } from "react-icons/tfi";
import { IoIosAdd } from "react-icons/io";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CardDataStats from "@/components/CardDataStats";
import ExportPaymentModal from "@/components/ExportComponents/ExportPaymentModal";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Products = () => {
  return (
    <>
      <DefaultLayout>
        {/* <Breadcrumb pageName="Resident manager" /> */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
           Payment Manager
          </h2>
        </div>
        <div className="mx-auto">
          <div className="w-full bg-slate-200 rounded-2xl mb-4 bo p-1 flex">
            <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-2 dark:text-white dark:hover:bg-gray-700 flex items-center mr-4">
              Payment history
            </button>
            <div className="mt-1 text-lg font-bold">
              <p>Product</p>
            </div>
          </div>
        </div>
        <div className="mb-4 flex justify-between">
          <div className="flex">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 mb-2 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </div>
              <input type="search" id="default-search" className="block w-80 p-3 ps-10 text-sm text-gray-900 border border-gray-200 rounded-lg  dark:placeholder-gray-400 dark:text-white" placeholder="Search for product" required />
            </div>
            <div className="flex items-center">
              <button type="button" className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-6 py-3 ms-4 mb-2 dark:text-white dark:hover:bg-gray-700 flex items-center">
                <IoFilterSharp className="mr-2" />Filters
              </button>
            </div>
          </div>
          <div className="flex">
          <div className="">
              <button type="button" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-6 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mb-2">
                <IoIosAdd className="mr-2 text-white text-xl" />Create new
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <ProductTable />
          {/* <TableTwo />
          <TableThree /> */}
        </div>
       
      </DefaultLayout>
    </>
  );
};

export default Products;
