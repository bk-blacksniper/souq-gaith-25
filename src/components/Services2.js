import React from "react";
import "../styles/Services.css";
import Arrow from "../assets/icon/Arrow.svg";
import Money from "../assets/icon/money.svg";
import Heart from "../assets/icon/Heart Donation.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    {
      titleKey: "services.exchangeTitle",
      descriptionKey: "services.exchangeBody",
      buttonKey: "services.exchangeBtn",
      icon: Arrow,
      route: "/exchange",
    },
    {
      titleKey: "services.saleTitle",
      descriptionKey: "services.saleBody",
      buttonKey: "services.saleBtn",
      icon: Money,
      route: "/sale",
    },
    {
      titleKey: "services.donateTitle",
      descriptionKey: "services.donateBody",
      buttonKey: "services.donateBtn",
      icon: Heart,
      route: "/donate",
    },
  ];

  return (
    <section className="services-section py-5">
      <div className="container text-center">
        <div className="row">
          {services.map((service, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card service-card p-4 shadow-sm">
                <div className="service-icon mb-3">
                  <img
                    src={service.icon}
                    alt={`${t(service.titleKey)} icon`}
                  />
                </div>

                <h5 className="service-title mb-3">{t(service.titleKey)}</h5>

                <p className="service-description mb-4">
                  {t(service.descriptionKey)}
                </p>

                <Link className="btn btn-success" to={service.route}>
                  {t(service.buttonKey)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
