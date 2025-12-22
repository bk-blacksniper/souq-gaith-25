import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* اسم الموقع */}
        <h2 className="footer-title">سوق الغيث</h2>

        {/* الروابط */}
        <ul className="footer-links">
          <li>
            <Link to="/">الرئيسية</Link>
          </li>
          <li>
            <Link to="/services">خدماتنا</Link>
          </li>
          <li>
            <Link to="/products">منتجاتنا</Link>
          </li>
          <li>
            <Link to="/about">من نحن</Link>
          </li>
          <li>
            <Link to="/faq">الأسئلة الشائعة</Link>
          </li>
          <li>
            <Link to="/contact">تواصل معنا</Link>
          </li>
        </ul>

        {/* أيقونات التواصل الاجتماعي */}
        <div className="footer-social">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-pinterest"></i>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-youtube"></i>
          </a>
        </div>
      </div>

      {/* نص الحقوق */}
      <div className="footer-bottom">
        <p>
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - {new Date().getFullYear() + 1}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
