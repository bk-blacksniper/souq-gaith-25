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

function App() {
  const openLogin = () => window.dispatchEvent(new Event("open-login"));

  return (
    <Router>
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
                heroName="خدماتنا"
                heroBody="هناك حقيقة مثبتة منذ زمن طويل وهي أن المحتوى المقروء لصفحة ما سيلهي القارئ عن التركيز على الشكل الخارجي للنص"
              />
              {/* ✅ Services لحالها (بدون Services2 ولا Products) عشان ما يتكرر */}
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
              <HeroSection2 heroName="منتجاتنا" heroBody="بيب" />
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
              <HeroSection2 heroName="طلباتي" />
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
              <HeroSection2 heroName="الإعدادات" />
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
                heroName="من نحن"
                heroBody="أهلاً بكم في سوق الغيث، حيث يمكنكم تبادل أو بيع أو التبرع بما لديكم ومساعدة الآخرين في تلبية احتياجاتهم. معاً نصنع الأمل وندعم بعضنا البعض."
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
                heroName="الاسئله الشائعه"
                heroBody="الأسئلة المتكررة – حلول سريعة لاستفساراتك"
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
                heroName="تواصل معنا"
                heroBody="أهلاً بكم في سوق الغيث، حيث يمكنكم تبادل أو بيع أو التبرع بما لديكم ومساعدة الآخرين في تلبية احتياجاتهم. معاً نصنع الأمل وندعم بعضنا البعض."
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
