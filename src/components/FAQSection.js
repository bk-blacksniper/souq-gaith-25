import React, { useState } from "react";
import "../styles/FAQSection.css";
import faqImage from "../assets/images/about-image.png"; // تأكد من وجود الصورة في المسار الصحيح

const faqs = [
  {
    question: "ما هي فكرة سوق الغيث؟",
    answer:
      "سوق الغيث هو منصة تتيح لك تبادل، بيع، أو التبرع بالأشياء التي لا تحتاجها، لمساعدة الآخرين وتلبية احتياجاتهم بطريقة تشاركية وداعمة.",
  },
  {
    question: "كيف يمكنني التبادل عبر الموقع؟",
    answer:
      "يمكنك تقديم المنتجات التي ترغب في مبادلتها مع الآخرين من خلال إضافة وصف دقيق لها ومتابعة طلبات التبادل.",
  },
  {
    question: "هل يمكنني بيع منتجاتي على الموقع؟",
    answer:
      "نعم، يمكنك بيع منتجاتك بسعر رمزي يساعد في تغطية احتياجاتك، ويمكنك عرضها بسهولة على الموقع.",
  },
  {
    question: "كيف أضمن سلامة المنتجات التي أستلمها من الآخرين؟",
    answer:
      "يتم مراجعة كل منتج مضاف بدقة من خلال فريق الموقع لضمان الجودة وسلامة المنتجات المعروضة.",
  },
  {
    question: "هل هناك رسوم لاستخدام الموقع؟",
    answer:
      "لا، استخدام المنصة مجاني بالكامل ولا توجد أي رسوم على التبادل أو البيع.",
  },
  {
    question: "كيف يمكنني التبادل عبر الموقع؟",
    answer:
      "ببساطة اختر المنتجات التي ترغب في مبادلتها وتواصل مع العارض لترتيب عملية التبادل بشكل مباشر.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="faq-container container">
      {/* صورة */}
      <div className="faq-image">
        <img src={faqImage} alt="FAQ" />
      </div>

      {/* الأسئلة الشائعة */}
      <div className="faq-content">
        <h2 className="faq-title">الأسئلة الشائعة</h2>
        <p className="faq-description">
          هناك حقيقة مثبتة منذ زمن طويل أن المحتوى المقروء لصفحة ما سيباهي.
        </p>

        {/* قائمة الأسئلة */}
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${
                  openIndex === index ? "active" : ""
                }`}
                onClick={() => toggleAccordion(index)}
              >
                {faq.question}
                <span className="faq-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
