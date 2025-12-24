import React, { useState } from "react";
import FileUploader from "./FileUploader";
import "../styles/Exchange.css";
import { supabase } from "../lib/supabaseClient";

const Sale = () => {
  const [images, setImages] = useState([]);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [price, setPrice] = useState("");

  const [contactName, setContactName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      setErrorMsg("يجب تسجيل الدخول لإرسال الطلب");
      return;
    }

    if (!productName || !price) {
      setErrorMsg("يرجى تعبئة اسم المنتج والسعر");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("sales").insert([
      {
        user_id: user.id,
        product_name: productName,
        product_description: description,
        estimated_value: estimatedValue || null,
        price,
        images,
        contact_name: contactName,
        address,
        phone,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      return;
    }

    alert("تم إرسال طلب البيع بنجاح ✅");

    // reset
    setProductName("");
    setDescription("");
    setEstimatedValue("");
    setPrice("");
    setImages([]);
    setContactName("");
    setAddress("");
    setPhone("");
  };

  return (
    <div className="container">
      <div className="box-3">
        <h1>معلومات حول المنتج المراد بيعه</h1>

        <div className="file-upload">
          <FileUploader onUpload={(urls) => setImages(urls)} />
        </div>

        {images.length > 0 && (
          <p style={{ color: "green" }}>تم رفع الصور بنجاح ✅</p>
        )}

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <div className="info">
          <input
            className="column"
            type="text"
            placeholder="اسم المنتج"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            className="column"
            type="text"
            placeholder="وصف المنتج"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="column"
            type="text"
            placeholder="القيمة التقديرية"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
          />
          <input
            className="column"
            type="text"
            placeholder="سعر المنتج"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="contact-info">
          <h1>معلومات التواصل</h1>
          <div className="info">
            <input
              className="column"
              type="text"
              placeholder="الاسم"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            <input
              className="column"
              type="text"
              placeholder="العنوان"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="column"
              type="text"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button className="submit-send" onClick={handleSubmit} disabled={loading}>
            {loading ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sale;
