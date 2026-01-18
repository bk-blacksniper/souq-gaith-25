import React from "react";
import "../styles/HeroSection.css";
import { useTranslation } from "react-i18next";

const HeroSection = (props) => {
  const { t } = useTranslation();

  const heroName =
    props.heroNameKey ? t(props.heroNameKey) : (props.heroName ?? "");

  const heroBody =
    props.heroBodyKey ? t(props.heroBodyKey) : (props.heroBody ?? "");

  return (
    <div className="hero-section two d-flex align-items-center justify-content-center text-center text-white">
      <div className="overlay"></div>
      <div className="container position-relative">
        <h2 className="fw-bold">{heroName}</h2>
        <p className="lead">{heroBody}</p>
      </div>
    </div>
  );
};

export default HeroSection;
