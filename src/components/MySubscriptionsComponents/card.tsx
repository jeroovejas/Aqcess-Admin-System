"use client";
import { Check } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  downGradeSubscription,
  getUserActiveSubscription,
  upGradeSubscription,
} from "@/lib/api/subscription";
import { showSuccessToast, showErrorToast } from "@/lib/toastUtil";
import { setCurrentPackageId, setPackageId } from "@/store/Slices/AuthSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ModalButton from "../Subscription/ModalButton";

interface PricingCardProps {
  cardId: number;
  title: string;
  price: string;
  subtitle: string;
  features: string[];
}

const PricingCard = ({
  cardId,
  title,
  price,
  subtitle,
  features,
}: PricingCardProps) => {
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const packageId = useAppSelector((state) => state.auth.packageId);
  const currentPackage = useAppSelector((state) => state.auth.currentPackageId);
  const user = useAppSelector((state) => state.auth.userData);
  const token = useAppSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const isSelected = currentPackage == cardId;

  const handleCardSelect = (card: any) => {
    if (cardId == 2 && !card?.id) {
      return showErrorToast("Please select a card.");
    }

    setSelectedCard(card);
    setIsModalOpen(false);

    if (cardId === 1) {
      handleDowngrade();
    } else {
      handleUpgrade();
    }
  };

  const handleUpgrade = async () => {
    if (!selectedCard?.id) {
      showErrorToast("Please select a card before subscribing.");
      return;
    }

    try {
      setLoading(true);
      const body = {
        token: token,
        card_id: selectedCard?.id,
        package_id: cardId,
      };

      const response = await upGradeSubscription(body);

      if (response.success) {
        if (response.data.data.subscription) {
          dispatch(setPackageId(response.data.data.subscription.package_id));
        }
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
    } catch (err: any) {
      console.error("Unexpected error during subscription upgrade:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async () => {
    setLoading(true);
    try {
      const body = { token: token };
      const response = await downGradeSubscription(body);

      if (response.success) {
        if (response.data.data.subscription) {
          dispatch(setPackageId(response.data.data.subscription.package_id));
        }
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
      }
    } catch (err: any) {
      console.error("Unexpected error during subscription downgrade:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSubscription = async () => {
    try {
      const body = { token: token };
      const response = await getUserActiveSubscription(body);

      if (response.success) {
        if (response.data.data) {
            console.log("Current Id =========== > ");
            console.log(response.data.data.currentPackage.package_id);
            
          dispatch(
            setCurrentPackageId(response.data.data.currentPackage.package_id)
          );
          dispatch(setPackageId(response.data.data.activePackage.package_id));
        }
      } else {
        showErrorToast(response.data.message);
      }
    } catch (err: any) {
      console.error("Unexpected error during active subscription fetch:", err.message);
    }
  };

  useEffect(() => {
    fetchActiveSubscription();
  },[packageId]);

  return (
    <div
      className={`rounded-xl p-6 w-full md:w-[48%] xl:w-1/3 flex flex-col justify-between ${
        isSelected
          ? "bg-black text-white border border-black"
          : "bg-white text-black"
      }`}
    >
      <div>
        <div className="text-left">
          <div
            className={`rounded-full px-4 py-1 text-sm font-medium self-start mb-4 inline-block ${
              isSelected
                ? "bg-white text-black border border-white"
                : "bg-white text-black border border-black"
            }`}
          >
            {title}
          </div>
          <h3
            className={`text-3xl font-bold mb-1 ${
              isSelected ? "text-white" : "text-black"
            }`}
          >
            {price}
            <span className="text-lg font-bold">/mes</span>
          </h3>
          <p
            className={`text-sm mb-2 ${
              isSelected ? "text-white" : "text-black"
            }`}
          >
            {subtitle}
          </p>
        </div>
        <hr className={`mb-6 ${isSelected ? "border-white" : "border-slate-700"}`} />
        <div className="space-y-2 text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`rounded-full border p-0.5 flex-shrink-0 ${
                  isSelected ? "border-white" : "border-black"
                }`}
              >
                <Check
                  className={isSelected ? "text-white" : "text-black"}
                  size={10}
                />
              </div>
              <span className={isSelected ? "text-white" : "text-black"}>
                {t(feature)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => (cardId == 2 ? setIsModalOpen(true) : handleCardSelect(null))}
        disabled={isSelected || loading}
        className={`w-full rounded-full py-3 px-6 text-center font-medium mt-8 block ${
          isSelected
            ? "bg-white text-black opacity-50 cursor-not-allowed"
            : "bg-black text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <AiOutlineLoading3Quarters className="animate-spin" />
            {t("MySubscription.button3")}
          </span>
        ) : cardId === 1 ? (
          t("MySubscription.button2")
        ) : (
          t("MySubscription.button1")
        )}
      </button>

      {/* Modal */}
      <ModalButton
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCard={handleCardSelect}
      />
    </div>
  );
};

export default PricingCard;
