import React from "react";
import "../styles/HeroSection.css";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div className="hero-section d-flex align-items-center justify-content-center text-center text-white">
      <div className="overlay"></div>
      <div className="container position-relative">
        <h2 className="fw-bold">{t("hero.homeTitle")}</h2>
        <p className="lead">{t("hero.homeSubtitle")}</p>
      </div>
    </div>
  );
};

export default HeroSection;
