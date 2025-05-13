// "use client";
// import { useEffect, useState } from "react";
// import { useAppSelector, useAppDispatch } from "@/store/hooks";
// import { FaPlus } from "react-icons/fa6";
// import { useTranslations } from 'next-intl';
// import { toggleBillingModal } from "@/store/Slices/SettingSlice";
// import { Link } from '@/navigation';

// interface Card {
//     id: string;
//     card: {
//         last4: string;
//         brand: string;
//         exp_month: number;
//         exp_year: number;
//     };
// }

// interface ModalButtonProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSelectCard: (card: Card) => void;
// }

// const ModalButton = ({ isOpen, onClose, onSelectCard }: ModalButtonProps) => {
//     const [cards, setCards] = useState<Card[]>([]);
//     const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const user = useAppSelector((state) => state.auth.userData);
//     const billingModal = useAppSelector((state) => state.setting.billingModal)
//     const customerId = user?.subscription?.customerId;
//     const t = useTranslations();
//     const dispatch = useAppDispatch()



//     const fetchCards = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch("/en/api/list-cards", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ customerId }),
//             });

//             if (!res.ok) {
//                 throw new Error("Failed to fetch cards");
//             }

//             const data = await res.json();
//             setCards(data.cards || []);
//         } catch (err) {
//             console.error("Failed to fetch cards:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (isOpen && customerId) {
//             fetchCards();
//         }
//     }, [isOpen, customerId]);

//     const handleCardClick = (card: Card) => {
//         setSelectedCardId(card.id);
//         onSelectCard(card);
//     };

//     if (!isOpen) return null;

//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//             onClick={onClose}
//         >
//             <div
//                 className="bg-white rounded-lg p-6 max-w-lg w-full"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <h2 className="text-lg font-semibold mb-4">Select a Card</h2>

//                 {loading ? (
//                     <p className="text-gray-500">Loading cards...</p>
//                 ) : cards.length > 0 ? (
//                     <ul className="space-y-3">
//                         {cards.map((card) => (
//                             <li
//                                 key={card.id}
//                                 onClick={() => handleCardClick(card)}
//                                 className={`p-3 rounded-lg border cursor-pointer hover:border-blue-600 hover:bg-blue-100 ${selectedCardId === card.id
//                                     ? "border-blue-600 bg-blue-50"
//                                     : "border-gray-300"
//                                     }`}
//                             >
//                                 <div className="font-medium text-gray-800">
//                                     **** **** **** {card.card.last4}
//                                 </div>
//                                 <div className="flex justify-start items-center text-sm text-gray-500">
//                                     {
//                                         card.card.brand == "visa" ?
//                                             <img src="/images/settings/method1.png" className="w-10" />
//                                             :
//                                             card.card.brand == "mastercard" ?
//                                                 <img src="/images/settings/method2.png" className="w-10" />
//                                                 :
//                                                 <span className="text-lg font-extrabold text-[#1E2A86]">{card.card.brand.toUpperCase()}</span>
//                                     } · Expires {card.card.exp_month}/{card.card.exp_year}
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-gray-500">No cards found</p>
//                 )}
//                 <Link href={'/settings?modal=true'} className="flex items-center mt-4">
//                     <FaPlus className="mt-3" />
//                     <button onClick={() => dispatch(toggleBillingModal())} className="text-base font-bold pt-3 pl-2">{t('PAYMENTBILLING.addButton')}</button>
//                 </Link>

//                 <button
//                     onClick={onClose}
//                     className="mt-6 px-4 py-2 bg-graydark text-white rounded hover:bg-gray-700"
//                 >
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ModalButton;



"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useTranslations } from 'next-intl';
import { toggleBillingModal } from "@/store/Slices/SettingSlice";
import { Link } from '@/navigation';

interface Card {
    id: string;
    card: {
        last4: string;
        brand: string;
        exp_month: number;
        exp_year: number;
    };
}

interface ModalButtonProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCard: (card: Card) => void;
}

const ModalButton = ({ isOpen, onClose, onSelectCard }: ModalButtonProps) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useAppSelector((state) => state.auth.userData);
    const customerId = user?.subscription?.customerId;
    const t = useTranslations();
    const dispatch = useAppDispatch();

    const fetchCards = async () => {
        setLoading(true);
        try {
            const res = await fetch("/en/api/list-cards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId }),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch cards");
            }

            const data = await res.json();
            setCards(data.cards || []);
            setSelectedCardId(data.cards[0]);
        } catch (err) {
            console.error("Failed to fetch cards:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && customerId) {
            fetchCards();
        }
    }, [isOpen, customerId]);

    const handleCardClick = (card: Card) => {
        setSelectedCardId(card);
    };

    const handleSubscribe = () => {
        if(selectedCardId.id){
            setSelectedCardId(selectedCardId);
            onSelectCard(selectedCardId);
        }
    };


    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}>
            <div
                className="bg-white relative rounded-lg p-6 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Select a Card</h2>
                    <FaTimes
                        onClick={onClose}
                        className="text-gray-500 cursor-pointer"
                        size={24}
                    />
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading cards...</p>
                ) : cards.length > 0 ? (
                    <ul className="space-y-3">
                        {cards.map((card) => (
                            <li
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                className={`p-3 rounded-lg border cursor-pointer hover:border-blue-600 hover:bg-blue-100 ${selectedCardId?.id === card.id
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-gray-300"
                                    }`}
                            >
                                <div className="font-medium text-gray-800">
                                    **** **** **** {card.card.last4}
                                </div>
                                <div className="flex justify-start items-center text-sm text-gray-500">
                                    {card.card.brand === "visa" ? (
                                        <img src="/images/settings/method1.png" className="w-10" />
                                    ) : card.card.brand === "mastercard" ? (
                                        <img src="/images/settings/method2.png" className="w-10" />
                                    ) : (
                                        <span className="text-lg font-extrabold text-[#1E2A86]">{card.card.brand.toUpperCase()}</span>
                                    )}
                                    · Expires {card.card.exp_month}/{card.card.exp_year}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No cards found</p>
                )}

                <Link href={'/settings?modal=true'} className="flex items-center mt-4">
                    <FaPlus className="mt-3" />
                    <button
                        onClick={() => dispatch(toggleBillingModal())}
                        className="text-base font-bold pt-3 pl-2"
                    >
                        {t('PAYMENTBILLING.addButton')}
                    </button>
                </Link>

                {/* Subscribe Button in Bottom Right */}
                <div className=" flex w-full justify-end">
                    <button
                        onClick={handleSubscribe}
                        className="mt-4 right-6 px-6 py-2 bg-black text-white rounded-full"
                    >
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalButton;
