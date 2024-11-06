"use client"
import { useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
const Survey: React.FC<any> = ({ survey }) => {
  const [isDisabled, setIsDisabled] = useState(false);

  // console.log("survey",survey)

  if (!survey || Object.keys(survey).length === 0) {
    return (
      <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
        <h4 className="text-center text-xl font-semibold text-black dark:text-white">
          No Survey Data Available
        </h4>
      </div>
    );
  }

  return (

    <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="flex justify-between">
        <h4 className=" pb-4 text-xl  font-semibold text-black dark:text-white">
          {survey.title}
        </h4>
        <FaArrowRight className="text-black" />
      </div>
      <div className="  py-3 border-t border-[#DDDDDD]">
        <h5 className="pb-4 text-lg font-semibold text-black">
          {survey.questions[0].questionTitle}
        </h5>
        {survey.questions[0].options.map((option: any, key: number) => (
          <div key={key} className="flex items-center gap-3">
            <p className="text-black text-[20px] font-[600]">
              {option.percentage}%
            </p>
            <div className="w-full">
              <p className="text-black text-[14px] font-[600] ">{option.title} ({option.totalResponse})</p>
              <div className=" bg-gray rounded-full h-2.5 mb-4 dark:bg-gray-700 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" style={{ width: `${option.percentage}%` }} ></div>
              </div>
            </div>
          </div>
        ))}
        {survey.questions.length > 1 ?

          <span className="text-black text-[14px] bg-[#F2F4F7] font-[600] p-2 rounded-2xl">+{survey.questions.length - 1} more question</span> : null}
      </div>
      <Link href={isDisabled ? '#' : '/survey'} onClick={() => setIsDisabled(true)} className={`text-black text-[14px] border border-[#DDDDDD] rounded-md px-2 py-1.5 font-bold mt-6 ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>Open Surveys</Link>
    </div >
  );
};

export default Survey;
