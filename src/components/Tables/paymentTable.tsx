import Image from "next/image";
import { GoDotFill } from "react-icons/go";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";



const paymentData: any[] = [
  {
    invoice: "10013",
    logo: "/images/brand/brand-01.svg",
    name: "John Smith",
    Amount: "$150",
    Product: "May fee",
    Datetime: "21.06.2024 17:48",
    Status: "Paid",
  },
  {
    invoice: "10012",
    logo: "/images/brand/brand-02.svg",
    name: "John Smith",
    Amount: "$150",
    Product: "May fee",
    Datetime: "21.06.2024 17:48",
    Status: "Paid",
  },
  {
    invoice: "10011",
    logo: "/images/brand/brand-03.svg",
    name: "John Smith",
    Amount: "$150",
    Product: "May fee",
    Datetime: "21.06.2024 17:48",
    Status: "overdue",
  },
  {
    invoice: "10010",
    logo: "/images/brand/brand-04.svg",
    name: "John Smith",
    Amount: "$150",
    Product: "May fee",
    Datetime: "21.06.2024 17:48",
    Status: "Paid",
  },
  {
    invoice: "100009",
    logo: "/images/brand/brand-05.svg",
    name: "John Smith",
    Amount: "$150",
    Product: "May fee",
    Datetime: "21.06.2024 17:48",
    Status: "Paid",
  },
];

const PaymentTable = () => {
  return (
    <div className="rounded-xl text-[14px] border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark  xl:pb-1">
      <h4 className="mb-6 pl-6 text-xl font-semibold text-black dark:text-white">
        Recent invoices
      </h4>
      <div className="relative overflow-x-auto text-black">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-base border border-slate-300 bg-slate-200 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Invoice
              </th>
              <th scope="col" className="px-6 py-3">
                Resident
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Date and time
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th>

              </th>
              <th>

              </th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((payment, key) => (
              <tr key={key} className="bg-white border-b border-b-slate-300 dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">
                  {payment.invoice}
                </td>
                <th scope="row" className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex-shrink-0">
                    <Image src={payment.logo} alt="Brand" width={35} height={35} />
                  </div>
                  <p className="hidden text-black font-bold dark:text-white sm:block mt-2 ml-2">
                    {payment.name}
                  </p>
                </th>
                <td className="px-6 py-4">
                  {payment.Amount}
                </td>
                <td className="px-6 py-4">
                  {payment.Product}
                </td>
                <td className="px-6 py-4">
                  {payment.Datetime}
                </td>
                <td className={`px-6 py-4 flex items-center font-bold ${payment.Status == 'Paid' ? 'text-meta-3' : 'text-meta-1'}`}>
                  <div className="flex items-center">
                    {payment.Status}
                  </div>
                </td>
                <td>
                  <MdOutlineFileDownload className="text-black mt-4 text-xl" />
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

export default PaymentTable;
