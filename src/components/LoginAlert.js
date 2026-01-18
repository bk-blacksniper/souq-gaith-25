import React, { useState } from "react";
import "../styles/LoginAlert.css";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";

const LoginAlert = ({ toggleAlert, switchToSignUp }) => {
  const { t } = useTranslation();

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

    toggleAlert();
    window.location.reload();
  };

  return (
    <div className="alert-overlay" onClick={toggleAlert}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="alert-title">{t("auth.loginTitle")}</h2>
        <p className="alert-description">{t("auth.loginDesc")}</p>

        {errorMsg && (
          <p className="alert-description" style={{ color: "red" }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="form-group remember-me">
            <label>
              <input type="checkbox" /> {t("auth.remember")}
            </label>
            <a href="/" className="forgot-password">
              {t("auth.forgot")}
            </a>
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? t("auth.loggingIn") : t("auth.loginBtn")}
          </button>
        </form>

        <p className="create-account">
          {t("auth.noAccount")}{" "}
          <span onClick={switchToSignUp}>{t("auth.createNew")}</span>
        </p>

        <button className="btn-close" onClick={toggleAlert}></button>
      </div>
    </div>
  );
};

export default LoginAlert;
