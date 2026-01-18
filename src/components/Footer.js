import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-title">{t("footer.siteName")}</h2>

        <ul className="footer-links">
          <li>
            <Link to="/">{t("nav.home")}</Link>
          </li>
          <li>
            <Link to="/services">{t("nav.services")}</Link>
          </li>
          <li>
            <Link to="/products">{t("nav.products")}</Link>
          </li>
          <li>
            <Link to="/about">{t("nav.about")}</Link>
          </li>
          <li>
            <Link to="/faq">{t("nav.faq")}</Link>
          </li>
          <li>
            <Link to="/contact">{t("nav.contact")}</Link>
          </li>
        </ul>

        <div className="footer-social">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-pinterest"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-youtube"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          {t("footer.rights")} &copy; {new Date().getFullYear()} -{" "}
          {new Date().getFullYear() + 1}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
