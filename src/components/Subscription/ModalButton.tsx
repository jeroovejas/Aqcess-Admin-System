"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

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
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const user = useAppSelector((state) => state.auth.userData);
    const customerId = user?.subscription?.customerId;

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
        setSelectedCardId(card.id);
        onSelectCard(card);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4">Select a Card</h2>

                {loading ? (
                    <p className="text-gray-500">Loading cards...</p>
                ) : cards.length > 0 ? (
                    <ul className="space-y-3">
                        {cards.map((card) => (
                            <li
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                className={`p-3 rounded-lg border cursor-pointer hover:border-blue-600 hover:bg-blue-100 ${selectedCardId === card.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                    }`}
                            >
                                <div className="font-medium text-gray-800">
                                    **** **** **** {card.card.last4}
                                </div>
                                <div className="flex justify-start items-center text-sm text-gray-500">
                                    {
                                        card.card.brand == "visa" ?
                                            <img src="/images/settings/method1.png" className="w-10" />
                                            :
                                            card.card.brand == "mastercard" ?
                                                <img src="/images/settings/method2.png" className="w-10" />
                                                :
                                                <span className="text-lg font-extrabold text-[#1E2A86]">{card.card.brand.toUpperCase()}</span>
                                    } · Expires {card.card.exp_month}/{card.card.exp_year}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No cards found</p>
                )}

                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 bg-graydark text-white rounded hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ModalButton;
