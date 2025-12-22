import React, { useState } from "react";
import "../styles/LoginAlert.css";
import { supabase } from "../lib/supabaseClient"; // تأكد من المسار

const LoginAlert = ({ toggleAlert, switchToSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // نجاح: اقفل النافذة
    toggleAlert();
    // إذا عندك state عالمي للمستخدم استخدمه بدل reload
    window.location.reload();
  };

  return (
    <div className="alert-overlay" onClick={toggleAlert}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="alert-title">تسجيل الدخول</h2>
        <p className="alert-description">
          لتجربة كاملة والاستفادة من جميع خدماتنا، يرجى تسجيل الدخول
        </p>

        {errorMsg && (
          <p className="alert-description" style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`password-icon bi ${
                showPassword ? "bi-eye" : "bi-eye-slash"
              }`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>

          <div className="form-group remember-me">
            <label>
              <input type="checkbox" /> تذكرني
            </label>
            <a href="/" className="forgot-password">
              نسيت كلمة المرور؟
            </a>
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p className="create-account">
          ليس لديك حساب؟ <span onClick={switchToSignUp}>إنشاء حساب جديد</span>
        </p>

        <button className="btn-close" onClick={toggleAlert}></button>
      </div>
    </div>
  );
};

export default LoginAlert;
