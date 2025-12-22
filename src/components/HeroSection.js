import React from "react";
import "../styles/HeroSection.css";

const HeroSection = () => {
  return (
    <div className="hero-section d-flex align-items-center justify-content-center text-center text-white">
      <div className="overlay"></div>
      <div className="container position-relative">
        <h2 className="fw-bold">سوق الغيث</h2>
        <p className="lead">
          "أهلاً بكم في سوق الغيث، حيث يمكنكم تبادل أو بيع أو التبرع بما لديكم
          ومساعدة الآخرين في تلبية احتياجاتهم. معاً نصنع الأمل وندعم بعضنا
          البعض."
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
