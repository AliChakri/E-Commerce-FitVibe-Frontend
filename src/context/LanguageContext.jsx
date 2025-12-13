// LanguageContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import i18n from "i18next"; // 👈 import i18n instance

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";

    // Apply to i18next
    i18n.changeLanguage(savedLang);

    // Handle RTL
    document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";

    setLang(savedLang);
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    i18n.changeLanguage(newLang); // 👈 sync with i18next

    // Handle RTL
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    localStorage.setItem("lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
