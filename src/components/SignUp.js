import React, { useState } from "react";
import "../styles/LoginAlert.css";
import { supabase } from "../lib/supabaseClient"; // تأكد من المسار

const SignUp = ({ toggleAlert, switchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agree) {
      setErrorMsg("يجب الموافقة على الشروط والأحكام");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          city,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // نفس الشكل، فقط تنبيه بسيط
    alert("تم إنشاء الحساب بنجاح ✅");
    switchToLogin();
  };

  return (
    <div className="alert-overlay" onClick={toggleAlert}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="alert-title">إنشاء حساب جديد</h2>
        <p className="alert-description">
          مرحباً بك! انضم إلينا الآن واستمتع بجميع خدماتنا المميزة عبر التسجيل
        </p>

        {errorMsg && (
          <p className="alert-description" style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="الاسم"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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

          <div className="form-group">
            <input
              type="tel"
              placeholder="رقم الجوال *"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <select
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">مكان الإقامة (المحافظة)*</option>
              <option value="رفح">رفح</option>
              <option value="خانيونس">خانيونس</option>
              <option value="غزة">غزة</option>
              <option value="الوسطى">الوسطى</option>
              <option value="الشمال">الشمال</option>
            </select>
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

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />{" "}
              الموافقة على الشروط والأحكام
            </label>
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="create-account">
          لديك حساب؟ <span onClick={switchToLogin}>تسجيل الدخول</span>
        </p>

        <button className="btn-close" onClick={toggleAlert}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default SignUp;
