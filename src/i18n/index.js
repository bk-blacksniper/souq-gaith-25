import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ar from "../locales/ar/translation.json";
import en from "../locales/en/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

const applyHtmlLangDir = (lng) => {
  const lang = (lng || "ar").split("-")[0];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
};

applyHtmlLangDir(i18n.language);
i18n.on("languageChanged", applyHtmlLangDir);

export default i18n;
