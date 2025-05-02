"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useTranslations } from "next-intl";

interface PricingCardProps {
    cardId: number;
    title: string;
    price: string;
    subtitle: string;
    features: string[];
}

const PricingCard = ({ cardId, title, price, subtitle, features }: PricingCardProps) => {
    const t = useTranslations();
    const packageId = useAppSelector((state) => state.auth.packageId);
    const isSelected = packageId === cardId;

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
                disabled={isSelected}
                className={`w-full rounded-full py-3 px-6 text-center font-medium mt-8 block 
          ${isSelected ? "bg-white text-black opacity-50 cursor-not-allowed" : "bg-black text-white "}`}
            >
                {/* {cardId == 1 ? `${t('MySubscription.button1')}` : `${t('MySubscription.button2')}`} */}
                {!isSelected
                    ? (cardId === 1 ? t('MySubscription.button2') : t('MySubscription.button1'))
                    : t('MySubscription.button3')}
            </button>
        </div>
    );
};

export default PricingCard;


