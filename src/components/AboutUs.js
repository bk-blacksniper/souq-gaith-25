import React from "react";
import "../styles/AboutUs.css";
import aboutImage from "../assets/images/about-image.png";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <section className="about-us container">
      <div className="about-image">
        <img src={aboutImage} alt={t("about.imageAlt")} />
      </div>

      <div className="about-content">
        <h2 className="about-title">{t("about.title")}</h2>

        <p className="about-text">{t("about.body")}</p>

        <ul className="about-list">
          <li>{t("about.exchange")}</li>
          <li>{t("about.sale")}</li>
          <li>{t("about.donate")}</li>
        </ul>

        <p className="about-text">{t("about.closing")}</p>

        <a href="/about" className="about-button">
          {t("about.more")}
        </a>
      </div>
    </section>
  );
};

export default AboutUs;
