import React, { useState } from "react";
import FileUploader from "./FileUploader";
import "../styles/Exchange.css";
import { supabase } from "../lib/supabaseClient";

const Exchange = () => {
  const [images, setImages] = useState([]);

  const [offeredItem, setOfferedItem] = useState("");
  const [desiredItem, setDesiredItem] = useState("");
  const [description, setDescription] = useState("");

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

    if (!offeredItem) {
      setErrorMsg("يرجى تعبئة العنصر المعروض للتبادل");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("exchanges").insert([
      {
        user_id: user.id,
        offered_item: offeredItem,
        desired_item: desiredItem,
        description,
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

    alert("تم إرسال طلب التبادل بنجاح ✅");

    // reset
    setOfferedItem("");
    setDesiredItem("");
    setDescription("");
    setImages([]);
    setContactName("");
    setAddress("");
    setPhone("");
  };

  return (
    <div className="container">
      <div className="box-3">
        <h1>معلومات حول التبادل</h1>

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
            placeholder="العنصر المعروض"
            value={offeredItem}
            onChange={(e) => setOfferedItem(e.target.value)}
          />
          <input
            className="column"
            type="text"
            placeholder="العنصر المطلوب"
            value={desiredItem}
            onChange={(e) => setDesiredItem(e.target.value)}
          />
          <input
            className="column"
            type="text"
            placeholder="وصف التبادل"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

export default Exchange;
