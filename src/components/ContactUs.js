import React from "react";
import "../styles/ContactUs.css";
import { useTranslation } from "react-i18next";

const ContactUs = () => {
  const { t } = useTranslation();

  return (
    <div style={{ background: "#FAFBFC", margin: "20px 0", padding: "20px" }}>
      <div className="container cont">
        <div className="message">
          <h1 className="title">{t("contact.messageTitle")}</h1>

          <div className="box">
            <p>{t("contact.sampleMessage")}</p>

            <div className="box-2">
              <div className="details">
                <h3>{t("contact.availableTimesTitle")}</h3>
                <p>{t("contact.availableTimesBody")}</p>
              </div>

              <div className="details">
                <h3>{t("contact.postalTitle")}</h3>
                <p>{t("contact.postalBody")}</p>
              </div>

              <div className="details">
                <h3>{t("contact.mobileTitle")}</h3>
                <p>+970-123-4567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact">
          <h1 className="title">{t("contact.pageTitle")}</h1>
          <p>{t("contact.pageBody")}</p>

          <form method="">
            <input type="text" placeholder={t("contact.fullNamePlaceholder")} />
            <input type="email" placeholder={t("contact.emailPlaceholder")} />
            <input type="text" placeholder={t("contact.phonePlaceholder")} />
            <textarea placeholder={t("contact.sampleMessage")}></textarea>
            <input type="submit" value={t("contact.submit")} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
