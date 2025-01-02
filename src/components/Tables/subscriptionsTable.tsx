import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { toggleEditModal, setResidentData, toggleViewModal,toggleStatusModal } from "@/store/Slices/ResidentSlice"
import { useAppDispatch } from "@/store/hooks";
import { useLocale, useTranslations } from 'next-intl';



const SubscriptionData: any[] = [
  {
    plane: "Basic",
    startdate: "2024-01-15",
    enddate: "2024-12-15",
    amount: "$10/month",
    status: "Active",
  },
  {
    plane: "Standard",
    startdate: "2024-02-01",
    enddate: "2025-01-31",
    amount: "$20/month",
    status: "Active",
  },
  {
    plane: "Premium",
    startdate: "2024-03-10",
    enddate: "2025-03-09",
    amount: "$30/month",
    status: "Active",
  },
  {
    plane: "Enterprise",
    startdate: "2024-04-20",
    enddate: "2025-04-19",
    amount: "$50/month",
    status: "Active",
  },
 
];

const SubscriptionTable: React.FC<any> = () => {
  const t = useTranslations();

  const dispatch = useAppDispatch()
  const handleEditResident = (resident: any) => {
    dispatch(setResidentData(resident))
    dispatch(toggleEditModal())
  }
  const handleViewResident = (resident: any) => {
    dispatch(setResidentData(resident))
    dispatch(toggleViewModal())
  }
  const handleClick=(status:any)=>{
    dispatch(toggleStatusModal())

}
  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
        Subscription Details
      </h4>
      <div className="relative overflow-x-auto text-black">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
              Subscription Plan
              </th>
              <th scope="col" className="px-6 py-3">
              Start Date
              </th>
              <th scope="col" className="px-6 py-3">
              End Date
              </th>
              <th scope="col" className="px-6 py-3">
              Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th>

              </th>
            </tr>
          </thead>
          <tbody>
            {SubscriptionData.map((Subscription, key) => (
              <tr key={key} className="bg-white border-b border-slate-300 dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <p className=" text-black font-bold dark:text-white  mt-2 ml-2">
                    {Subscription.plane}
                  </p>
                </th>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Subscription.startdate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Subscription.enddate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Subscription.amount}
                </td>
                <td className={`px-6 py-4 flex items-center  ${Subscription.status == 'Active' ? 'text-meta-3' : 'text-meta-1'} whitespace-nowrap`}>
                  <div className="flex items-center ">
                    <GoDotFill className="mt-1 mr-2" />
                    {Subscription.status}
                  </div>

                </td>
                <td className="relative group whitespace-nowrap">
                  <BsThreeDotsVertical className="text-black" />
                  <ul className="absolute z-20 top-5 w-[150px] right-2 my-4 text-[14px] bg-white hidden group-hover:block  text-black border border-gray ">
                    <li onClick={() => handleViewResident(Subscription)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">View</li>
                    <li onClick={() => handleEditResident(Subscription)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">Edit</li>
                    <li onClick={()=>handleClick(Subscription.status)} className="px-8 py-2 font-semibold cursor-pointer hover:bg-[#f0efef]">{Subscription.status === 'Active' ? 'Cancel' : 'Activate'}</li>
                  </ul>
                </td>

              </tr>
            )
            )}

          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-3 mb-5">
        <nav aria-label="Page navigation example">
          <ul className="inline-flex -space-x-px text-lg">
            <li>
              <a href="#" className="flex items-center justify-center text-black font-bold px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <FaArrowLeft className="mr-1" />
                {t('COMMON.previous')}</a>
            </li>
            <li>
              <a href="#" className="flex items-center justify-center text-black px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
            </li>
            <li>
              <a href="#" className="flex items-center justify-center text-black  px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
            </li>
            <li>
              <a href="#" aria-current="page" className="flex items-center text-black  justify-center px-3 h-8 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
            </li>
            <li>
              <a href="#" className="flex items-center justify-center text-black  px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
            </li>
            <li>
              <a href="#" className="flex items-center justify-center text-black  px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
            </li>
            <li>
              <a href="#" className="flex items-center justify-center text-black font-bold px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              {t('COMMON.next')}
                <FaArrowRight className="ml-1" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div >
  );
};

export default SubscriptionTable;
