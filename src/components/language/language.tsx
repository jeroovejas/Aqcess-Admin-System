import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { usePathname, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageDropdown() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();

    // const languages = [
    //     { code: "en", name: `${t('LANG.english')}`, flag: "https://flagcdn.com/w40/us.png" },
    //     { code: "es", name: `${t('LANG.spanish')}`, flag: "https://flagcdn.com/w40/es.png" }
    // ];

    const languages = [
        { code: "en", name: "English", flag: "https://flagcdn.com/w40/us.png" },
        { code: "es", name: "Spanish", flag: "https://flagcdn.com/w40/es.png" }
    ];

    // Load saved locale from local storage
    const [selectedLang, setSelectedLang] = useState(() => {
        const savedLang = localStorage.getItem("selectedLocale");
        return savedLang ? JSON.parse(savedLang) : languages.find(lang => lang.code === locale) || languages[0];
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("selectedLocale", JSON.stringify(selectedLang));
    }, [selectedLang]);

    const handleLanguageChange = (lang: any) => {
        setSelectedLang(lang);
        setOpen(false);
        localStorage.setItem("selectedLocale", JSON.stringify(lang));
        router.replace(pathname, { locale: lang.code });
    };

    return (
        <div className="relative">
            {/* Dropdown Button */}
            <button
                className="flex items-center gap-2 text-black rounded-lg border bg-white px-4 py-2.5 shadow-md"
                onClick={() => setOpen(!open)}
            >
                <img src={selectedLang.flag} alt={selectedLang.name} width={20} height={20} />
                <span className="font-medium">{selectedLang.name}</span>
                <FaChevronDown className="text-gray-500" />
            </button>

            {/* Dropdown List */}
            {open && (
                <div className="absolute left-0 mt-2 w-39 rounded-xl bg-white p-3 shadow-lg">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang)}
                            className="flex text-black w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100"
                        >
                            <img src={lang.flag} alt={lang.name} width={20} height={20} />
                            <span className="font-medium text-black">{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
