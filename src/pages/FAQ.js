import HeroSection2 from "./components/HeroSectionTwo";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

const FAQ = () => {
  return (
    <>
      <HeroSection2
        heroName="الاسئله الشائعه"
        heroBody="الأسئلة المتكررة – حلول سريعة لاستفساراتك"
      />
      <FAQSection />
      <Footer />
    </>
  );
};

export default FAQ;
