import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HeroSection2 from "./components/HeroSectionTwo";
import Services from "./components/Services";
import Products from "./pages/Products";
import AboutUs from "./components/AboutUs";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import ContactUs from "./components/ContactUs";
import Exchange from "./components/Exchange";
import Sale from "./components/Sale";
import Donate from "./components/Donate";
import MyRequests from "./pages/MyRequests";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import LangDirection from "./components/LangDirection";

function App() {
  const openLogin = () => window.dispatchEvent(new Event("open-login"));

  return (
    <Router>
      <ScrollToTop />
      <LangDirection />
      <Navbar />
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <Services />

              {/* <Products mode="home" homeLimit={3} showPagination={false} /> */}

              <AboutUs />
              <FAQSection />
              <Footer />
            </>
          }
        />

        {/* Services */}
        <Route
          path="/services"
          element={
            <>
              <HeroSection2
                heroNameKey="hero.servicesTitle"
                heroBodyKey="hero.servicesSubtitle"
              />
              <Services />
              <FAQSection />
              <Footer />
            </>
          }
        />

        {/* Products */}
        <Route
          path="/products"
          element={
            <>
              <HeroSection2
                heroNameKey="hero.productsTitle"
                heroBodyKey="hero.productsSubtitle"
              />
              <Products mode="all" />
              <Footer />
            </>
          }
        />

        {/* My Requests - Protected */}
        <Route
          path="/my-requests"
          element={
            <>
              <HeroSection2
                heroNameKey="hero.myRequestsTitle"
              />
              <ProtectedRoute openLogin={openLogin}>
                <MyRequests />
              </ProtectedRoute>
              <Footer />
            </>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <>
              <HeroSection2
                heroNameKey="hero.settingsTitle"
              />
              <Settings />
            </>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <>
              <HeroSection2
                heroNameKey="hero.aboutTitle"
                heroBodyKey="hero.aboutSubtitle"
              />
              <AboutUs />
              <FAQSection />
              <Footer />
            </>
          }
        />

        {/* FAQ */}
        <Route
          path="/faq"
          element={
            <>
              <HeroSection2
                heroNameKey="hero.faqTitle"
                heroBodyKey="hero.faqSubtitle"
              />
              <FAQSection />
              <Footer />
            </>
          }
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={
            <>
              <HeroSection2
                heroNameKey="hero.contactTitle"
                heroBodyKey="hero.contactSubtitle"
              />
              <ContactUs />
              <Footer />
            </>
          }
        />

        {/* Exchange - Protected */}
        <Route
          path="/exchange"
          element={
            <>
              <HeroSection2
                heroName="تبادل منتج"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              <ProtectedRoute openLogin={openLogin}>
                <Exchange />
              </ProtectedRoute>
              <Footer />
            </>
          }
        />

        {/* Sale - Protected */}
        <Route
          path="/sale"
          element={
            <>
              <HeroSection2
                heroName="بيع منتج"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              <ProtectedRoute openLogin={openLogin}>
                <Sale />
              </ProtectedRoute>
              <Footer />
            </>
          }
        />

        {/* Donate - Protected */}
        <Route
          path="/donate"
          element={
            <>
              <HeroSection2
                heroName="تبرع بمنتج"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              <ProtectedRoute openLogin={openLogin}>
                <Donate />
              </ProtectedRoute>
              <Footer />
            </>
          }
        />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
