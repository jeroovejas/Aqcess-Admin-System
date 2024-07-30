"use client";

import { ApexOptions } from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    // xaxis: {
    //   lines: {
    //     show: true,
    //   },
    // },
    // yaxis: {
    //   lines: {
    //     show: true,
    //   },
    // },
  },
  dataLabels: {
    enabled: false,
  },
  // markers: {
  //   size: 4,
  //   colors: "#fff",
  //   strokeColors: ["#3056D3", "#80CAEE"],
  //   strokeWidth: 3,
  //   strokeOpacity: 0.9,
  //   strokeDashArray: 0,
  //   fillOpacity: 1,
  //   discrete: [],
  //   hover: {
  //     size: undefined,
  //     sizeOffset: 5,
  //   },
  // },
  xaxis: {
    type: 'numeric', // Change to numeric
    min: 2,          // Minimum value for x-axis
    max: 30,         // Maximum value for x-axis
    tickAmount: 14,  // Number of ticks to display
    labels: {
      formatter: function (value) {
        return value; // Customize the tick labels if necessary
      }
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    }
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 1000,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const series = [
    {
      name: "Product One",
      data:[[2, 200], [3, 200], [7, 300], [7, 400], [13, 500],
      [11, 600], [15, 700], [17, 800], [28, 900], [30, 1000]],
    },
  ]

  return (
    <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">

          <p className="font-semibold text-black">Payments</p>

        </div>

      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div >
  );
};

export default ChartOne;
