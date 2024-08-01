import React from 'react'
import { FaRegArrowAltCircleUp } from "react-icons/fa";


const ExportPaymentModal = () => {
  return (
    <div className="flex justify-statt items-start outline-none focus:outline-none">
      <div className="relative w-auto my-6 max-w-3xl">
        <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

          {/* <FaRegArrowAltCircleUp size={30} className="mb-6 " /> */}
          <FaRegArrowAltCircleUp className='text-2xl' />
          <h3 className="text-xl font-bold mt-8">Export payment history</h3>
          <p className="font-[500] text-base mt-2">Please select the format you would like to use for</p>
          <p className="font-[500]">exporting</p>
          <div className="w-full my-6">
            <div className="relative">
              <select className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8   focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                <option className="rounded-xl py-3 my-5">CSV</option>
                <option>PDF</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              className="text-red-500 border rounded-xl border-[#DDDDDD] w-1/2 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button">
              Cancel
            </button>
            <button
              className="text-white w-1/2 rounded-xl bg-slate-900 font-bold uppercase text-sm px-6 py-3  shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button">
              Export
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ExportPaymentModal