"use client"

import React from "react"
import { DateRange, DateRangePicker } from "./dataPicker"
import { showErrorToast } from "@/lib/toastUtil"

export const DateRangePickerElement: React.FC<any> = ({ setToDate, setFromDate }) => {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
        undefined,
    )
    const presets = [
        {
            label: "Today",
            dateRange: {
                from: new Date(),
                to: new Date(),
            },
        },
        {
            label: "Last 7 days",
            dateRange: {
                from: new Date(new Date().setDate(new Date().getDate() - 7)),
                to: new Date(),
            },
        },
        {
            label: "Last 30 days",
            dateRange: {
                from: new Date(new Date().setDate(new Date().getDate() - 30)),
                to: new Date(),
            },
        },
        {
            label: "Last 3 months",
            dateRange: {
                from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                to: new Date(),
            },
        },
        {
            label: "Last 6 months",
            dateRange: {
                from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
                to: new Date(),
            },
        },
        {
            label: "Month to date",
            dateRange: {
                from: new Date(new Date().setDate(1)),
                to: new Date(),
            },
        },
        {
            label: "Year to date",
            dateRange: {
                from: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
                to: new Date(),
            },
        },
    ]

    // React.useEffect(() => {
    //     if (dateRange) {
    //         const fromDate: any = dateRange.from?.toLocaleDateString()
    //         const toDate: any = dateRange.to?.toLocaleDateString()
    //         const [fromDay, fromMonth, fromYear] = fromDate.split('/');
    //         const [toDay, toMonth, toYear] = toDate.split('/');
    //         const formattedFromDate = `${fromYear}-${fromMonth.padStart(2, '0')}-${fromDay.padStart(2, '0')}`;
    //         const formattedToDate = `${toYear}-${toMonth.padStart(2, '0')}-${toDay.padStart(2, '0')}`;
    //         // setFromDate(fromDate?.replace(/\//g, '-'))
    //         setFromDate(formattedFromDate)
    //         setToDate(formattedToDate)
    //     }
    // }, [dateRange, setFromDate, setToDate])
    React.useEffect(() => {
        if (dateRange) {
            const fromDate: any = dateRange.from?.toLocaleDateString()
            const toDate: any = dateRange.to?.toLocaleDateString()
            if (fromDate && toDate) {
                const [fromDay, fromMonth, fromYear] = fromDate.split('/')
                const [toDay, toMonth, toYear] = toDate.split('/')
                const formattedFromDate = `${fromYear}-${fromMonth.padStart(2, '0')}-${fromDay.padStart(2, '0')}`
                const formattedToDate = `${toYear}-${toMonth.padStart(2, '0')}-${toDay.padStart(2, '0')}`
                setFromDate(formattedFromDate)
                setToDate(formattedToDate)
            } else {
                showErrorToast("Both from and to dates must be selected.")
            }
        }
    }, [dateRange, setFromDate, setToDate])
    return (
        <div className="flex flex-col items-center gap-y-4 ">
            <DateRangePicker
                presets={presets}
                value={dateRange}
                onChange={setDateRange}
                className="w-[11rem] md:w-60 py-2.5 md:py-3"
            />

            {/* <p className="flex items-center rounded-md bg-gray-100 p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                Selected Range:{" "}
               
                {dateRange
                    ? `${dateRange.from?.toLocaleDateString()} – ${dateRange.to?.toLocaleDateString() ?? ""}`
                    : "None"}
            </p> */}
        </div>


    )
}