import React from "react";
import FileUploader from "./FileUploader";
import "../styles/Exchange.css";

const Exchange = () => {
  return (
    <>
      <div className="container">
        <div className="box-3">
          <h1>معلومات حول المنتج المراد تبديله</h1>
          <div className="file-upload">
            <FileUploader />
          </div>
          <div className="info">
            <input className="column" type="text" placeholder="اسم المنتج" />
            <input className="column" type="text" placeholder="وصف المنتج" />
          </div>
          <div className="product-info">
            <h1>معلومات عن المنتج المطلوب الذي سيتم التبادل به</h1>
            <div className="info">
              <input className="column" type="text" placeholder="اسم المنتج" />
              <input className="column" type="text" placeholder="وصف المنتج" />
              <input className="column" type="text" placeholder="كمية المنتج" />
            </div>
          </div>
          <div className="contact-info">
            <h1>معلومات التواصل</h1>
            <div className="info">
              <input className="column" type="text" placeholder="اسم المنتج" />
              <input className="column" type="text" placeholder="وصف المنتج" />
              <input className="column" type="text" placeholder="كمية المنتج" />
            </div>
            <button className="submit-send">إرسال الطلب</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Exchange;
