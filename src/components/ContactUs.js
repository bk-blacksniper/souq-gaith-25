import React from "react";
import "../styles/ContactUs.css";

const ContactUs = () => {
  return (
    <div style={{background: '#FAFBFC', margin: '20px 0', padding: '20px'}}>
      <div className="container cont">
        <div className="message">
          <h1 className="title">الرسالة</h1>
          <div className="box">
            <p>
              "مرحبًا فريق سوق الغيث، لدي استفسار حول كيفية عرض منتجي للتبادل
              على الموقع. أود معرفة الخطوات والإرشادات لضمان تجربة ناجحة. شكرًا
              لكم!"
            </p>
            <div className="box-2">
              <div className="details">
                <h3>أوقات التواصل المتاحة:</h3>
                <p>
                  من الأحد إلى الخميس، من 9:00 صباحًا حتى 5:00 مساءً بتوقيت
                  القدس.
                </p>
              </div>
              <div className="details">
                <h3>العنوان البريدي:</h3>
                <p>غزة، شارع فلسطين، مبنى التعاون، الطابق الثالث</p>
              </div>
              <div className="details">
                <h3>رقم الجوال :</h3>
                <p>+970-123-4567</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact">
          <h1 className="title">سوق الغيث - تواصل معنا</h1>
          <p>
            نحن هنا لمساعدتك والإجابة عن أي استفسارات أو ملاحظات قد تكون لديك
            حول خدماتنا. تواصل معنا عبر المعلومات التالية.
          </p>
          <form method="">
            <input type="text" placeholder="الاسم الكامل" />
            <input type="email" placeholder="البريد الإلكتروني" />
            <input type="text" placeholder="رقم الجوال" />
            <textarea></textarea>
            <input type="submit" value="إرسال الطلب" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
