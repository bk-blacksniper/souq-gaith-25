import React, { useState } from "react";
import FileUploader from "./FileUploader";
import "../styles/Exchange.css";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";

const Exchange = () => {
  const { t } = useTranslation();

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
      setErrorMsg(t("forms.exchangeNeedLogin"));
      return;
    }

    if (!offeredItem) {
      setErrorMsg(t("forms.exchangeFillRequired"));
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
        phone
      }
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      return;
    }

    alert(t("forms.exchangeSuccess"));

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
        <h1>{t("forms.exchangeTitle")}</h1>

        <div className="file-upload">
          <FileUploader onUpload={(urls) => setImages(urls)} />
        </div>

        {images.length > 0 && (
          <p style={{ color: "green" }}>{t("forms.imagesUploaded")}</p>
        )}

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <div className="info">
          <input
            className="column"
            type="text"
            placeholder={t("forms.exchangeOffered")}
            value={offeredItem}
            onChange={(e) => setOfferedItem(e.target.value)}
          />
          <input
            className="column"
            type="text"
            placeholder={t("forms.exchangeDesired")}
            value={desiredItem}
            onChange={(e) => setDesiredItem(e.target.value)}
          />
          <input
            className="column"
            type="text"
            placeholder={t("forms.exchangeDesc")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="contact-info">
          <h1>{t("forms.contactInfo")}</h1>
          <div className="info">
            <input
              className="column"
              type="text"
              placeholder={t("forms.name")}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
            <input
              className="column"
              type="text"
              placeholder={t("forms.address")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="column"
              type="text"
              placeholder={t("forms.phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            className="submit-send"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t("common.sending") : t("forms.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exchange;
