import React from "react";
import FileUploader from "./FileUploader";
import "../styles/Exchange.css";

const Sale = () => {
  return (
    <>
      <div className="container">
        <div className="box-3">
          <h1>معلومات حول المنتج المراد بيعه</h1>
          <div className="file-upload">
            <FileUploader />
          </div>
          <div className="info">
            <input className="column" type="text" placeholder="اسم المنتج" />
            <input className="column" type="text" placeholder="وصف المنتج" />
          </div>
          <div className="contact-info">
            <h1>معلومات التواصل</h1>
            <div className="info">
              <input className="column" type="text" placeholder="الاسم" />
              <input className="column" type="text" placeholder="العنوان" />
              <input className="column" type="text" placeholder="رقم الهاتف" />
            </div>
            <button className="submit-send">تبرع الآن</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sale;
