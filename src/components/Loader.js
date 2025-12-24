import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        height: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div className="spinner-border text-success" role="status"></div>
      <span className="text-muted">جاري التحقق...</span>
    </div>
  );
};

export default Loader;
