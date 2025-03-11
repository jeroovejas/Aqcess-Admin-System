"use client"
import React, { useState, useRef, useEffect } from "react";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { toggleExportModal } from "@/store/Slices/PaymentSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from 'next-intl';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { exportPayments } from "@/lib/api/payment";
import { saveAs } from 'file-saver';
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";

const ExportModal: React.FC<any> = ({filterTerm}) => {
    const t = useTranslations();

    const [selectedOption, setSelectedOption] = useState<string>("");
    const exportModal = useAppSelector((state) => state.payment.exportModal)
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true)
        try {
            let params = { token: token, filterTerm }
            const response = await exportPayments(params);
            if (response.success) {
                const csvData = convertToCSV(response.data);
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const fileName = 'payments.csv';
                saveAs(blob, fileName);
                dispatch(toggleExportModal())
                showSuccessToast(response.message);
            } else {
                showErrorToast('Failed to download the file. Please try again.');
            }
        } catch (err: any) {
            console.error('Unexpected error during deleting resident:', err.message);
        } finally {
            setLoading(false)
        }
    };

    const convertToCSV = (data: any[]): string => {
        const csvRows: string[] = [];
        // Function to escape and wrap values
        const escapeValue = (value: string): string => {
            if (typeof value === 'string') {
                // Escape double quotes by doubling them and wrap the value in double quotes
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        };
        const headers = [
            'Invoive Id', 'Resident Name', 'Email', 'Product Title', 'Amount',
            'Type', 'Description', 'Attachment', 'Status', 'Reject Reason'
        ];
        csvRows.push(headers.join(','));
        data.forEach((payment: any) => {
            const row = [
                escapeValue(payment.invoiceId),
                escapeValue(payment.residentName),
                escapeValue(payment.email),
                escapeValue(payment.productTitle),
                escapeValue(payment.amount),
                escapeValue(payment.type),
                escapeValue(payment.desc),
                escapeValue(payment.attachment),
                escapeValue(payment.adminStatus),
                escapeValue(payment.rejectReason)
            ].map(value => ((value !== undefined && value !== null) ? `${value}` : ``)).join(',');
            csvRows.push(row);
        });
        return csvRows.join('\n');
    }


    return (
        <>
            {exportModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[calc(100vw-20px)] md:w-auto my-6">
                            <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">

                                <FaRegArrowAltCircleUp size={30} className="mb-6 " />
                                <h3 className="text-3xl font-semibold mt-8">{t('PAYMENT.button1Modal.title')}</h3>
                                <p className="font-[500] mt-2">{t('PAYMENT.button1Modal.lable')}</p>
                                <div className="w-full my-6">

                                    <div className="relative">
                                        <select
                                            value={selectedOption}
                                            onChange={(e) => {
                                                setSelectedOption(e.target.value);

                                            }}
                                            className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8   focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                            <option value="CSV">{t('PAYMENT.button1Modal.option1')}</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>



                                <div className="flex gap-3 items-center">
                                    <button
                                        className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 flex items-center justify-center cursor-pointer  background-transparent font-bold px-6 py-3 text-sm outline-none  mr-1 mb-1"
                                        type="button"
                                        onClick={() => dispatch(toggleExportModal())}
                                    >
                                        {t('PAYMENT.button1Modal.button1')}
                                    </button>
                                    <button
                                        className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold text-sm px-6 py-3   outline-none  mr-1 mb-1"
                                        type="button"
                                        disabled={loading}
                                        onClick={handleExport}
                                    >
                                        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PAYMENT.button1Modal.button2')}`}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default ExportModal;