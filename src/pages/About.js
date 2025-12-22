import HeroSection2 from '../components/HeroSectionTwo';
import AboutUs from '../components/AboutUs';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

function About() {
  return (
    <>
      <HeroSection2
        heroName="من نحن"
        heroBody="أهلاً بكم في سوق الغيث، حيث يمكنكم تبادل أو بيع أو التبرع بما لديكم ومساعدة الآخرين في تلبية احتياجاتهم. معاً نصنع الأمل وندعم بعضنا البعض."
      />
      <AboutUs />
      <FAQSection />
      <Footer />
    </>
  );
}

export default About;