import React, { useState, useEffect } from "react";
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

  const switchToSignUp = () => setIsSignUp(true);
  const switchToLogin = () => setIsSignUp(false);

  const toggleAlert = () => {
    setShowAlert(!showAlert);
  };

  // link active
  const isActive = (path) =>
    location.pathname === path ? "text-dark fw-bold" : "text-white";

  // جلب المستخدم + اسمه
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const u = data.user;
      setUser(u);

      if (u) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name")
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

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // تسجيل خروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <div>
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

          {/* Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
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

            {/* Right buttons */}
            <div className="d-flex align-items-center gap-2">
              {!user ? (
                <>
                  <button className="btn btn-success" onClick={toggleAlert}>
                    تسجيل الدخول
                  </button>
                  <button
                    className="create-account btn"
                    onClick={() => {
                      setIsSignUp(true);
                      setShowAlert(true);
                    }}
                  >
                    إنشاء حساب
                  </button>
                </>
              ) : (
                <>
                  <span className="text-white fw-bold">
                    أهلاً، {profile?.full_name || "مستخدم"}
                  </span>
                  <button
                    className="btn btn-outline-light"
                    onClick={handleLogout}
                  >
                    تسجيل خروج
                  </button>
                </>
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
    </div>
  );
};

export default Navbar;
