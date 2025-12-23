import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HeroSection2 from "./components/HeroSectionTwo";
import Services from "./components/Services";
import Services2 from "./components/Services2";
import Products from "./pages/Products";
import Products2 from "./components/Products2";
import AboutUs from "./components/AboutUs";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import ContactUs from "./components/ContactUs";
import Exchange from "./components/Exchange";
import Sale from "./components/Sale";
import Donate from "./components/Donate";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Services />
              <Products />
              <AboutUs />
              <FAQSection />
              <Footer />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <HeroSection2
                heroName="خدماتنا"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              <Services2 />
              <Products2 />
              <FAQSection />
              <Footer />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <HeroSection2 heroName="منتجاتنا" heroBody="بيب" />
              <Products /> <Footer />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <HeroSection2
                heroName="من نحن"
                heroBody="أهلاً بكم في سوق الغيث، حيث يمكنكم تبادل أو بيع أو التبرع بما لديكم ومساعدة الآخرين في تلبية احتياجاتهم. معاً نصنع الأمل وندعم بعضنا البعض."
              />
              <AboutUs />
              <FAQSection />
              <Footer />
            </>
          }
        />
        <Route
          path="/faq"
          element={
            <>
              <HeroSection2
                heroName="الاسئله الشائعه"
                heroBody="الأسئلة المتكررة – حلول سريعة لاستفساراتك"
              />
              <FAQSection />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <HeroSection2
                heroName="تواصل معنا"
                heroBody="أهلاً بكم في سوق الغيث، حيث يمكنكم تبادل أو بيع أو التبرع بما لديكم ومساعدة الآخرين في تلبية احتياجاتهم. معاً نصنع الأمل وندعم بعضنا البعض."
              />
              <ContactUs />
              <Footer />
            </>
          }
        />

        <Route
          path="/exchange"
          element={
            <>
              <HeroSection2
                heroName="تبادل منتج"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              <Exchange />
              <Footer />
            </>
          }
        />
        <Route
          path="/sale"
          element={
            <>
              <HeroSection2
                heroName="بيع منتج"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              <Sale />
              <Footer />
            </>
          }
        />
        <Route
          path="/donate"
          element={
            <>
              <HeroSection2
                heroName="تبرع بمنتج"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              <Donate />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
