import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LangDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language?.startsWith("en") ? "en" : "ar";
    const dir = lang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = lang;
    document.documentElement.dir = dir;

    document.body.style.direction = dir;
    document.body.style.textAlign = dir === "rtl" ? "right" : "left";
  }, [i18n.language]);

  return null;
}
