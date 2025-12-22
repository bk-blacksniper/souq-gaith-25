import React from "react";
import "../styles/HeroSection.css";

const HeroSection = (props) => {
  return (
    <div className="hero-section two d-flex align-items-center justify-content-center text-center text-white">
      <div className="overlay"></div>
      <div className="container position-relative">
        <h2 className="fw-bold">{props.heroName}</h2>
        <p className="lead">
        {props.heroBody}
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
