import ServicesSection from "./Services2";
import Products from "../pages/Products";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();

  return (
    <main>
      <ServicesSection />

      <section>
        <div className="container">
          <h2 className="mb-4 text-center">{t("services.productsSectionTitle")}</h2>
        </div>

        <Products mode="home" />
      </section>
    </main>
  );
};

export default Services;
