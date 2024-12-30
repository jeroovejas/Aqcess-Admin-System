import React, { useState, useEffect, useRef } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleImportModal, toggleIsUpdated } from "@/store/Slices/ResidentSlice";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { showSuccessToast, showErrorToast } from "../../lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { importResidents } from "@/lib/api/resident";
import { useLocale, useTranslations } from 'next-intl';


const ImportModal: React.FC<any> = () => {
  const t = useTranslations();
    const importModal = useAppSelector((state) => state.resident.importModal);
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState<boolean>(false);
    //   const token = useAppSelector((state) => state.token.token)
    const dispatch = useAppDispatch();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    useEffect(() => {
        if (importModal) {
            setSelectedFile(null);
        }
    }, [importModal]);

    const handleImportFile = async () => {
        if (!selectedFile) {
            showErrorToast("File is required");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('token', token);
        setLoading(true)
        try {
            const response = await importResidents(formData);
            if (response.success) {
                dispatch(toggleImportModal())

                dispatch(toggleIsUpdated());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }
        } catch (error: any) {
            showErrorToast(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {importModal && (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div  className="relative w-auto my-6 max-w-3xl">
                        <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none px-8 py-8">
                            <FaRegArrowAltCircleDown size={30} className="mb-6" />
                            <h3 className="text-3xl font-semibold mt-8">{t('RESIDENT.button1Modal.title')}</h3>
                            <div className="w-full my-6">
                                <p className="font-[500] mt-3 mb-2">{t('RESIDENT.button1Modal.lable')} <small>(.csv)</small> <span className="text-danger">*</span></p>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".csv, text/csv"
                                        className="block appearance-none w-full rounded-xl border border-[#DDDDDD] text-black py-3 px-4 pr-8 focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="file-input"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 items-center">
                                <button
                                    className="text-red-500 border rounded-xl border-[#DDDDDD] w-1/2 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleImportModal())}
                                >
                                    {t('RESIDENT.button1Modal.button1')}
                                </button>
                                <button
                                    className="text-white w-1/2 flex items-center justify-center cursor-pointer rounded-xl bg-slate-900 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                                    type="button"
                                    disabled={loading}
                                    onClick={handleImportFile}
                                >
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('RESIDENT.button1Modal.button2')}`}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


export default ImportModal;
