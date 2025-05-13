"use client"
import React, { useRef, useEffect, useState } from "react";
import { toggleEmailModal } from "@/store/Slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { sendEmail } from "@/lib/api/auth";
import { useLocale, useTranslations } from 'next-intl';
import { MdVerifiedUser } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";

const SendEmailModal: React.FC<any> = ({ email }) => {
    const t = useTranslations();

    const emailModal = useAppSelector((state) => state.auth.emailModal)
    const modalRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async () => {
        setLoading(true)
        try {
            const response = await sendEmail({ email: email });
            if (response.success) {
                showSuccessToast(response.data.message);
                dispatch(toggleEmailModal())
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during sending email verification link:', err.message);
        } finally {
            setLoading(false)
        }

    };



    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            dispatch(toggleEmailModal());
        }
    };

    useEffect(() => {
        if (emailModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emailModal]);

    return (
        <>
            {emailModal ? (
                <>
                    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[500px] my-6 max-w-3xl ">
                            <div ref={modalRef} className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none  px-8 py-8">


                                <MdVerifiedUser size={75} className="mb-6 " />

                                <h3 className="text-xl font-semibold mt-8">{t('VERIFYLINK.title')}</h3>
                                <p className="font-[500] mt-2 mb-6">{t('VERIFYLINK.desc')}</p>


                                <button
                                    className="text-white w-full flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-semibold text-base px-6 py-3 outline-none mr-1 mb-1"
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSendEmail}
                                >
                                    {loading ? (
                                        <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                    ) : (
                                        <>
                                            <HiOutlineMail className="text-xl mr-2" />
                                            {t("VERIFYLINK.button")}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
};

export default SendEmailModal;