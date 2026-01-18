import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import LoginAlert from "./LoginAlert";
import SignUp from "./SignUp";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [showAlert, setShowAlert] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const toggleAlert = () => setShowAlert(!showAlert);
  const switchToSignUp = () => setIsSignUp(true);
  const switchToLogin = () => setIsSignUp(false);

  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) =>
    location.pathname === path ? "text-dark fw-bold" : "text-white";

  useEffect(() => {
    const openLoginHandler = () => {
      setIsSignUp(false);
      setShowAlert(true);
    };

    window.addEventListener("open-login", openLoginHandler);
    return () => window.removeEventListener("open-login", openLoginHandler);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setUser(u);

      if (u) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", u.id)
          .single();
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const closeMobileMenu = () => {
    const el = document.getElementById("navbarNav");
    if (!el) return;

    if (window.bootstrap && window.bootstrap.Collapse) {
      const instance = window.bootstrap.Collapse.getOrCreateInstance(el, {
        toggle: false,
      });
      instance.hide();
      return;
    }

    if (el.classList.contains("show")) el.classList.remove("show");
    const btn = document.querySelector('[data-bs-target="#navbarNav"]');
    if (btn) btn.setAttribute("aria-expanded", "false");
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg navbar-light fixed-top custom-navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        <div className="container">
          <Link
            className="navbar-brand fw-bold text-success"
            to="/"
            onClick={closeMobileMenu}
          >
            {t("appName")}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto text-center">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/")}`}
                  to="/"
                  onClick={closeMobileMenu}
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/services")}`}
                  to="/services"
                  onClick={closeMobileMenu}
                >
                  {t("nav.services")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/products")}`}
                  to="/products"
                  onClick={closeMobileMenu}
                >
                  {t("nav.products")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/about")}`}
                  to="/about"
                  onClick={closeMobileMenu}
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/faq")}`}
                  to="/faq"
                  onClick={closeMobileMenu}
                >
                  {t("nav.faq")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/contact")}`}
                  to="/contact"
                  onClick={closeMobileMenu}
                >
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>

            <div className="d-flex justify-content-center mt-3 mt-lg-0 align-items-center gap-2">
              {!user ? (
                <div className="d-flex flex-column flex-lg-row gap-2 w-100">
                  <button
                    className="btn btn-success w-100"
                    onClick={toggleAlert}
                  >
                    {t("nav.login")}
                  </button>
                  <button
                    className="create-account btn w-100"
                    onClick={() => {
                      setIsSignUp(true);
                      setShowAlert(true);
                    }}
                  >
                    {t("nav.signup")}
                  </button>
                  <LanguageSwitcher
                    className="ms-2"
                    onAfterChange={closeMobileMenu}
                  />{" "}
                </div>
              ) : (
                <>
                  <div className="dropdown text-center w-100">
                    <button
                      className="btn btn-outline-light dropdown-toggle w-100 d-flex align-items-center justify-content-center gap-2"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="avatar"
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i className="bi bi-person-circle"></i>
                      )}
                      <span>{profile?.full_name || t("nav.account")}</span>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end text-end w-100">
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/my-requests"
                          onClick={closeMobileMenu}
                        >
                          <i className="bi bi-box-seam me-2"></i>
                          {t("nav.myRequests")}
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/settings"
                          onClick={closeMobileMenu}
                        >
                          <i className="bi bi-gear me-2"></i>
                          {t("nav.settings")}
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          {t("nav.logout")}
                        </button>
                      </li>
                    </ul>
                  </div>

                  <LanguageSwitcher className="ms-2" onToggle={closeMobileMenu} />                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showAlert &&
        (isSignUp ? (
          <SignUp toggleAlert={toggleAlert} switchToLogin={switchToLogin} />
        ) : (
          <LoginAlert
            toggleAlert={toggleAlert}
            switchToSignUp={switchToSignUp}
          />
        ))}
    </>
  );
};

export default Navbar;
