import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import LoginAlert from "./LoginAlert";
import SignUp from "./SignUp";
import { supabase } from "../lib/supabaseClient";

const Navbar = () => {
  const location = useLocation();

  const [showAlert, setShowAlert] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const toggleAlert = () => setShowAlert(!showAlert);
  const switchToSignUp = () => setIsSignUp(true);
  const switchToLogin = () => setIsSignUp(false);

  const isActive = (path) =>
    location.pathname === path ? "text-dark fw-bold" : "text-white";

  // ✅ استقبل طلب فتح نافذة تسجيل الدخول من ProtectedRoute
  useEffect(() => {
    const openLoginHandler = () => {
      setIsSignUp(false);
      setShowAlert(true);
    };

    window.addEventListener("open-login", openLoginHandler);
    return () => window.removeEventListener("open-login", openLoginHandler);
  }, []);

  // تحميل المستخدم
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top custom-navbar">
        <div className="container">
          {/* Logo */}
          <Link className="navbar-brand fw-bold text-success" to="/">
            سوق الغيث
          </Link>

          {/* Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Links */}
            <ul className="navbar-nav mx-auto text-center">
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/")}`} to="/">
                  الرئيسية
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/services")}`}
                  to="/services"
                >
                  خدماتنا
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/products")}`}
                  to="/products"
                >
                  منتجاتنا
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/about")}`} to="/about">
                  من نحن
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/faq")}`} to="/faq">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/contact")}`}
                  to="/contact"
                >
                  تواصل معنا
                </Link>
              </li>
            </ul>

            {/* User Menu */}
            <div className="d-flex justify-content-center mt-3 mt-lg-0">
              {!user ? (
                <div className="d-flex flex-column flex-lg-row gap-2 w-100">
                  <button
                    className="btn btn-success w-100"
                    onClick={toggleAlert}
                  >
                    تسجيل الدخول
                  </button>

                  <button
                    className="create-account btn w-100"
                    onClick={() => {
                      setIsSignUp(true);
                      setShowAlert(true);
                    }}
                  >
                    إنشاء حساب
                  </button>
                </div>
              ) : (
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
                    <span>{profile?.full_name || "حسابي"}</span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end text-end w-100">
                    <li>
                      <Link className="dropdown-item" to="/my-requests">
                        <i className="bi bi-box-seam me-2"></i>
                        طلباتي
                      </Link>
                    </li>

                    <li>
                      <Link className="dropdown-item" to="/settings">
                        <i className="bi bi-gear me-2"></i>
                        الإعدادات
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
                        تسجيل الخروج
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* مودال تسجيل الدخول / إنشاء حساب */}
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
