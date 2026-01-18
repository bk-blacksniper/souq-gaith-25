import React, { useState } from "react";
import "../styles/LoginAlert.css";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";

const SignUp = ({ toggleAlert, switchToLogin }) => {
  const { t } = useTranslation();

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
      setErrorMsg(t("auth.mustAgree"));
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

    switchToLogin();
  };

  return (
    <div className="alert-overlay" onClick={toggleAlert}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="alert-title">{t("auth.signupTitle")}</h2>
        <p className="alert-description">{t("auth.signupDesc")}</p>

        {errorMsg && (
          <p className="alert-description" style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder={t("auth.name")}
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder={t("auth.email")}
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              placeholder={t("auth.phoneStar")}
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
              <option value="">{t("auth.city")}</option>

              <option value="رفح">{t("cities.rafah")}</option>
              <option value="خانيونس">{t("cities.khanYounis")}</option>
              <option value="غزة">{t("cities.gaza")}</option>
              <option value="الوسطى">{t("cities.middle")}</option>
              <option value="الشمال">{t("cities.north")}</option>
            </select>
          </div>

          <div className="form-group password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
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
              {t("auth.agreeTerms")}
            </label>
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? t("auth.creating") : t("auth.signupBtn")}
          </button>
        </form>

        <p className="create-account">
          {t("auth.haveAccount")}{" "}
          <span onClick={switchToLogin}>{t("auth.loginBtn")}</span>
        </p>

        <button className="btn-close" onClick={toggleAlert}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default SignUp;
