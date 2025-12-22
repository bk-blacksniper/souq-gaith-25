import HeroSection2 from "./components/HeroSectionTwo";
import Footer from "./components/Footer";
import ContactUs from "./components/ContactUs";

const Contact = () => {
  return (
    <>
      <HeroSection2
        heroName="تواصل معنا"
        heroBody="أهلاً بكم في سوق الغيث، حيث يمكنكم تبادل أو بيع أو التبرع بما لديكم ومساعدة الآخرين في تلبية احتياجاتهم. معاً نصنع الأمل وندعم بعضنا البعض."
      />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Contact;
