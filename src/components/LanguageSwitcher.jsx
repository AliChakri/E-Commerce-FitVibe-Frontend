// src/components/LanguageSwitcher.jsx
import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = languages.find((l) => l.code === lang);

  return (
    <div className="relative z-40">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800
                   rounded-xl shadow-md border border-gray-200 dark:border-gray-700
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      >
        <span className="text-xl text-cyan-600 dark:text-cyan-300">{current.flag}</span>
        <span className="font-medium text-gray-700 dark:text-gray-200">{current.label}</span>

        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute mt-2 right-0 bg-white dark:bg-gray-900 rounded-xl shadow-lg border
                     border-gray-200 dark:border-gray-700 w-44 py-2 animate-scaleIn"
        >
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => {
                changeLang(item.code);
                setOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 text-left
                          hover:bg-gray-100 dark:hover:bg-gray-800 transition-all
                          ${lang === item.code ? "bg-gray-100 dark:bg-gray-800" : ""}`}
            >
              <span className="text-xl text-cyan-600 dark:text-cyan-300 transition-colors">{item.flag}</span>
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
