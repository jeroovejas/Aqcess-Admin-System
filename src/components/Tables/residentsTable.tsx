
import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";


const residentData: any[] = [
  {
    logo: "/images/brand/brand-01.svg",
    name: "John Smith",
    ID: 1569,
    Email: "john.smith@example.com",
    Address: "123 Maple street, 9",
    Status: "Active",
  },
  {
    logo: "/images/brand/brand-02.svg",
    name: "Michael Brown",
    ID: 1567,
    Email: "michael.brown@example.com",
    Address: "123 Maple Street, 15",
    Status: "Active",
  },
  {
    logo: "/images/brand/brand-03.svg",
    name: "Emma Johnson",
    ID: 3479,
    Email: "emma.johnson@example.com",
    Address: "123 Maple Street, 11",
    Status: "Active",
  },
  {
    logo: "/images/brand/brand-04.svg",
    name: "William Taylor",
    ID: 4986,
    Email: "william.taylor@exmple.com",
    Address: "123 Maple Street, 7",
    Status: "Active",
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Sophia Davis",
    ID: 1153,
    Email: "sophia.davis@example.com",
    Address: "123 Maple Street, 20",
    Status: "Deactivated",
  },
];

const ResidentTable = () => {
  return (
    <div className="rounded-sm text-[14px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Your residents
      </h4>
      <div className="relative overflow-x-auto text-black">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-base text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Resident Name
              </th>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {residentData.map((resident, key) => (
              <tr key={key} className="bg-white dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex-shrink-0">
                    <Image src={resident.logo} alt="Brand" width={35} height={35} />
                  </div>
                  <p className="hidden text-black font-bold dark:text-white sm:block mt-2 ml-2">
                    {resident.name}
                  </p>
                </th>
                <td className="px-6 py-4">
                  {resident.ID}
                </td>
                <td className="px-6 py-4 font-bold">
                  {resident.Email}
                </td>
                <td className="px-6 py-4">
                  {resident.Address}
                </td>
                <td className={`px-6 py-4 flex items-center  ${resident.Status == 'Active' ? 'text-meta-3' : 'text-meta-1'}`}>
                  <div className="flex items-center">
                    <GoDotFill className="mt-1 mr-2" />
                    {resident.Status}
                  </div>
                </td>
                <td>
                  <BsThreeDotsVertical className="text-black" />
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
                Previous</a>
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
                Next
                <FaArrowRight className="ml-1" />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div >
  );
};

export default ResidentTable;
