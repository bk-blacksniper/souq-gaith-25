import HeroSection2 from './components/HeroSectionTwo';
import Services2 from './components/Services2';
import Products2 from './components/Products2';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';


const ServicesPage = () => {
  return (
    <>
      <HeroSection2 heroName="خدماتنا" heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"/>
              <Services2 />
              <Products2 />
              <FAQSection />
              <Footer />
    </>
  );
};

export default ServicesPage;
