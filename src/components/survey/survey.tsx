import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

// const SurveyData:any[] = [
//   {
//     avatar: "/images/user/user-01.png",
//     name: "Devid Heilo",
//     text: "How are you? Can you confirm if payment of this month has benn recieved",
//     time: 12,
//     address: '123 maple street',
//     textCount: 3,
//     dot: 3,
//   },
//   {
//     avatar: "/images/user/user-02.png",
//     name: "Henry Fisher",
//     text: "Waiting for you!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, labore?",
//     time: 12,
//     address: '123 maple street',
//     textCount: 3,
//     dot: 1,
//   },
//   {
//     avatar: "/images/user/user-04.png",
//     name: "Jhon Doe",
//     text: "What's up?  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, labore?",
//     time: 32,
//     address: '123 maple street',
//     textCount: 6,
//     dot: 3,
//   },


// ];

const Survey = () => {
  return (
    <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex justify-between">
        <h4 className=" pb-4 text-xl  font-semibold text-black dark:text-white">
          Cleanliness satisfaction survey
        </h4>
        <FaArrowRight className="text-black" />
      </div>
      <div className="  py-3 border-t border-[#DDDDDD]">
        <h5 className="pb-4 text-lg font-semibold text-black">
          How satisfied are you with the cleanliness of the common areas (e.g., hallways, lobbies)?
        </h5>
        <div className="flex items-center gap-3">
          <p className="text-black text-[20px] font-[600]">
            67%
          </p>
          <div className="w-full">
            <p className="text-black text-[14px] font-[600] ">Satsified (17 responses)</p>
            <div className=" bg-gray rounded-full h-2.5 mb-4 dark:bg-gray-700 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: "87%" }} ></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <p className="text-black text-[20px] font-[600]">
            21%
          </p>
          <div className="w-full">
            <p className="text-black text-[14px] font-[600] ">Neutral (6 responses)</p>
            <div className=" bg-gray rounded-full h-2.5 mb-4 dark:bg-gray-700 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: "21%" }} ></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 mb-3">
          <p className="text-black text-[20px] font-[600]">
            12%
          </p>
          <div className="w-full">
            <p className="text-black text-[14px] font-[600] ">Dissatisfied (3 responses)</p>
            <div className=" bg-gray rounded-full h-2.5 mb-4 dark:bg-gray-700 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: "12%" }} ></div>
            </div>
          </div>
        </div>

        <span className="text-black text-[14px] bg-[#F2F4F7] font-[600] p-2 rounded-2xl">+1 more question</span>
      </div>
      <button className="text-black text-[14px] border border-[#DDDDDD] rounded-md px-2 py-1.5 font-bold mt-6">Open Surveys</button>
    </div>
  );
};

export default Survey;
