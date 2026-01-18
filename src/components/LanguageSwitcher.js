import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ className = "", onToggle }) {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith("en");

  const toggle = () => {
    if (typeof onToggle === "function") onToggle();
    i18n.changeLanguage(isEn ? "ar" : "en");
  };

  const titleText = isEn ? "Switch to Arabic" : "التبديل إلى الإنجليزية";
  const labelText = isEn ? "AR" : "EN";

  return (
    <button
      type="button"
      className={`btn btn-sm ${isEn ? "btn-outline-success" : "btn-outline-light"} ${className}`}
      onClick={toggle}
      title={titleText}
      aria-label={titleText}
    >
      {labelText}
    </button>
  );
}
