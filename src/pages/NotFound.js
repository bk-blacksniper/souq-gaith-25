import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: 700 }}>
      <div
        className="card text-center"
        style={{
          borderRadius: 16,
          border: "1px solid #eee",
          boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
        }}
      >
        <div className="card-body p-4">
          <div style={{ fontSize: 64, lineHeight: 1 }} className="mb-2">
            <i className="bi bi-exclamation-triangle-fill text-warning"></i>
          </div>

          <h2 className="mb-2">الصفحة غير موجودة</h2>
          <p className="text-muted mb-4" style={{ margin: 0 }}>
            الرابط التالي غير صحيح:
            <br />
            <code dir="ltr">{location.pathname}</code>
          </p>

          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Link to="/" className="btn btn-success">
              العودة للرئيسية
            </Link>

            <button
              className="btn btn-outline-secondary"
              onClick={() => window.history.back()}
            >
              رجوع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
