"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { downGradeSubscription } from "@/lib/api/subscription";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtil";
import { setPackageId } from "@/store/Slices/AuthSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface PricingCardProps {
    cardId: number;
    title: string;
    price: string;
    subtitle: string;
    features: string[];
}

const PricingCard = ({ cardId, title, price, subtitle, features }: PricingCardProps) => {
    const locale = useLocale();
    const dispatch = useAppDispatch()
    const t = useTranslations();
    const packageId = useAppSelector((state) => state.auth.packageId);
    const user = useAppSelector((state) => state.auth.userData);
    const token = useAppSelector((state) => state.auth.token);
    const [loading, setLoading] = useState(false);
    const isSelected = packageId === cardId;

    const handleUpgrade = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/${locale}/api/create-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email }),
            });

            const data = await res.json();
            window.location.href = data.url;
        } catch (err: any) {
            console.error('Unexpected error during subscription up grade:', err.message);
        } finally {
            setLoading(false)
        }
    }
    const handleDowngrade = async () => {
        setLoading(true)
        try {
            const body = { token: token };
            const response = await downGradeSubscription(body);
            if (response.success) {
                if (response.data.data.subscription) {
                    dispatch(setPackageId(response.data.data.subscription.packageId))
                }
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message)
            }

        } catch (err: any) {
            console.error('Unexpected error during subscription down grade:', err.message);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className={`rounded-xl p-6 w-full md:w-[48%] xl:w-1/3 flex flex-col justify-between 
    ${isSelected ? "bg-black text-white border border-black" : "bg-white text-black"}`}
        >
            <div>
                <div className="text-left">
                    <div
                        className={`rounded-full px-4 py-1 text-sm font-medium self-start mb-4 inline-block 
            ${isSelected ? "bg-white text-black border border-white" : "bg-white text-black border border-black"}`}
                    >
                        {title}
                    </div>

                    <h3 className={`text-3xl font-bold mb-1 ${isSelected ? "text-white" : "text-black"}`}>
                        {price}<span className="text-lg font-bold">/mes</span>
                    </h3>

                    <p className={`text-sm mb-2 ${isSelected ? "text-white" : "text-black"}`}>
                        {subtitle}
                    </p>
                </div>

                <hr className={`mb-6 ${isSelected ? "border-white" : "border-slate-700"}`} />

                <div className="space-y-2 text-left">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`rounded-full border p-0.5 flex-shrink-0 
              ${isSelected ? "border-white" : "border-black"}`}>
                                <Check className={isSelected ? "text-white" : "text-black"} size={10} />
                            </div>
                            <span className={isSelected ? "text-white" : "text-black"}>{t(feature)}</span>
                        </div>
                    ))}
                </div>

            </div>

            <button
                onClick={cardId === 1 ? handleDowngrade : handleUpgrade}
                disabled={isSelected || loading}
                className={`w-full rounded-full py-3 px-6 text-center font-medium mt-8 block 
          ${isSelected ? "bg-white text-black opacity-50 cursor-not-allowed" : "bg-black text-white "}`}
            >
                {/* {cardId == 1 ? `${t('MySubscription.button1')}` : `${t('MySubscription.button2')}`} */}
                {!isSelected
                    ? (cardId === 1 ? t('MySubscription.button2') : t('MySubscription.button1'))
                    : t('MySubscription.button3')}
                {/* {
                    !isSelected
                        ? (cardId === 1
                            ? (loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : t('MySubscription.button2'))
                            : t('MySubscription.button1'))
                        : t('MySubscription.button3')
                } */}
            </button>
        </div>
    );
};

export default PricingCard;


