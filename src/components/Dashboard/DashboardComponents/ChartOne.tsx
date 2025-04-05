// "use client";

// import { ApexOptions } from "apexcharts";
// import React from "react";
// import dynamic from "next/dynamic";
// import { useLocale, useTranslations } from 'next-intl';


// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

// const options: ApexOptions = {
//   legend: {
//     show: false,
//     position: "top",
//     horizontalAlign: "left",
//   },
//   colors: ["#3C50E0", "#80CAEE"],
//   chart: {
//     fontFamily: "Satoshi, sans-serif",
//     height: 335,
//     type: "area",
//     dropShadow: {
//       enabled: true,
//       color: "#623CEA14",
//       top: 10,
//       blur: 4,
//       left: 0,
//       opacity: 0.1,
//     },

//     toolbar: {
//       show: false,
//     },
//   },
//   responsive: [
//     {
//       breakpoint: 1024,
//       options: {
//         chart: {
//           height: 300,
//         },
//       },
//     },
//     {
//       breakpoint: 1366,
//       options: {
//         chart: {
//           height: 350,
//         },
//       },
//     },
//   ],
//   stroke: {
//     width: [2, 2],
//     curve: "straight",
//   },
//   // labels: {
//   //   show: false,
//   //   position: "top",
//   // },
//   grid: {
//     // xaxis: {
//     //   lines: {
//     //     show: true,
//     //   },
//     // },
//     // yaxis: {
//     //   lines: {
//     //     show: true,
//     //   },
//     // },
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   // markers: {
//   //   size: 4,
//   //   colors: "#fff",
//   //   strokeColors: ["#3056D3", "#80CAEE"],
//   //   strokeWidth: 3,
//   //   strokeOpacity: 0.9,
//   //   strokeDashArray: 0,
//   //   fillOpacity: 1,
//   //   discrete: [],
//   //   hover: {
//   //     size: undefined,
//   //     sizeOffset: 5,
//   //   },
//   // },
//   xaxis: {
//     type: 'numeric', // Change to numeric
//     min: 2,          // Minimum value for x-axis
//     max: 30,         // Maximum value for x-axis
//     tickAmount: 14,  // Number of ticks to display
//     labels: {
//       formatter: function (value) {
//         return value; // Customize the tick labels if necessary
//       }
//     },
//     axisBorder: {
//       show: false,
//     },
//     axisTicks: {
//       show: false,
//     }
//   },
//   yaxis: {
//     title: {
//       style: {
//         fontSize: "0px",
//       },
//     },
//     min: 0,
//     max: 1000,
//   },
// };

// interface ChartOneState {
//   series: {
//     name: string;
//     data: number[];
//   }[];
// }

// const ChartOne: React.FC = () => {
//   const series = [
//     {
//       name: "Product One",
//       data: [[2, 200], [3, 200], [7, 300], [7, 400], [13, 500],
//       [11, 600], [15, 700], [17, 800], [28, 900], [30, 1000]],
//     },
//   ]

//   const t = useTranslations();


//   return (
//     <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
//       <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
//         <div className="flex w-full flex-wrap gap-3 sm:gap-5">

//           <p className="font-semibold text-black">{t('DASHBOARD.title1')}</p>

//         </div>

//       </div>

//       <div>
//         <div id="chartOne" className="-ml-5">
//           <ReactApexChart
//             options={options}
//             series={series}
//             type="area"
//             height={350}
//             width={"100%"}
//           />
//         </div>
//       </div>
//     </div >
//   );
// };

// export default ChartOne;

"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Payment from "./payment";
import { getDashboardChartPayment } from "@/lib/api/dashboard";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ChartOne: React.FC<{ token: string }> = ({ token }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [paymentsByMonth, setPaymentsByMonth] = useState<{ month: number; total: number, expenseTotal:number }[]>([]);
  const [recentPayment, setRecentPayment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data whenever the selected year changes
  useEffect(() => {
    FetchChartData();
  }, [selectedYear]);

  const FetchChartData = async () => {
    setLoading(true);
    try {
      const chartParams = { token, year: selectedYear };
      const chartResponse = await getDashboardChartPayment(chartParams);

      if (chartResponse?.success) {
        setPaymentsByMonth(chartResponse?.data?.data?.paymentsByMonth);
        setRecentPayment(chartResponse?.data?.data?.recentPayments);
      } else {
        setPaymentsByMonth([]);
        setRecentPayment([]);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setPaymentsByMonth([]);
    } finally {
      setLoading(false);
    }
  };

  // Safely map months and totals
  const months = paymentsByMonth?.length > 0 ? paymentsByMonth.map((item) => monthLabels[item.month - 1]) : monthLabels;
  const totals = paymentsByMonth?.length > 0 ? paymentsByMonth.map((item) => item.total) : new Array(12).fill(0);
  const ExpenseTotals = paymentsByMonth?.length > 0 ? paymentsByMonth.map((item) => item.expenseTotal) : new Array(12).fill(0);

  const options: ApexOptions = {
    chart: { type: "bar", height: 350, fontFamily: "Satoshi, sans-serif", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%", borderRadius: 6 } },
    colors: ["#3C50E0", "#80CAEE", "#FF0000", "#FFD700"],
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: { categories: months },
    yaxis: { title: { text: "USD ($)" } },
    fill: { opacity: 1 },
    legend: { position: "top", horizontalAlign: "center" },
    responsive: [{ breakpoint: 1024, options: { chart: { height: 300 }, legend: { position: "bottom" } } }],
  };

  const series = [{ name: "Income", data: totals }, { name: "Expense", data: ExpenseTotals }];

  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <div className="col-span-12 md:col-span-8">
        <div className="w-full h-full mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex gap-5 justify-center items-center mb-6">
            <p className="text-lg font-semibold text-black text-center">Payments by Month</p>
            {/* Year Dropdown */}
            <select
              className="px-4 py-2 border rounded-md text-black bg-white shadow-sm focus:ring focus:ring-blue-200"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <ReactApexChart options={options} series={series} type="bar" height={350} />
          )}
        </div>
      </div>
      <div className="col-span-12 md:col-span-4">
        <Payment paymentData={recentPayment} />
      </div>
    </div>
  );
};

export default ChartOne;
