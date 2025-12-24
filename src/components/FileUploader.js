import React, { useRef, useState } from "react";
import "../styles/FileUploader.css";
import Image from "../assets/icon/Image.png";
import { supabase } from "../lib/supabaseClient";

function FileUploader({ onUpload }) {
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setErr("");
    setFiles(event.dataTransfer.files);
  };

  const handleUpload = async () => {
    try {
      setErr("");

      if (!files || files.length === 0) {
        setErr("اختر صورة أولًا");
        return;
      }

      const { data: uData, error: uErr } = await supabase.auth.getUser();
      if (uErr) throw uErr;
      if (!uData?.user) {
        setErr("لازم تسجّل دخول قبل رفع الصور");
        return;
      }

      setUploading(true);

      const uploadedUrls = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const filePath = `${uData.user.id}/${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, { upsert: false });

        if (upErr) throw upErr;

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      setUploading(false);
      setFiles(null);

      if (onUpload) onUpload(uploadedUrls);
    } catch (e) {
      console.error("UPLOAD ERROR:", e);
      setUploading(false);
      setErr(e?.message || "حدث خطأ أثناء رفع الصور");
    }
  };

  if (files)
    return (
      <div className="uploads">
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>

        {err && <p style={{ color: "red", margin: "8px 0" }}>{err}</p>}

        <div className="actions">
          <button className="btnn" onClick={() => setFiles(null)} disabled={uploading}>
            Cancel
          </button>
          <button className="btnn" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    );

  return (
    <div>
      {!files && (
        <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
          <img src={Image} alt="Upload Images" className="img-upload" />
          <h3>قم برفع صورة هنا</h3>
          <h3>أو</h3>

          {err && <p style={{ color: "red", margin: "8px 0" }}>{err}</p>}

          <input
            type="file"
            multiple
            onChange={(event) => {
              setErr("");
              setFiles(event.target.files);
            }}
            hidden
            ref={inputRef}
          />

          <button className="btn-upload" onClick={() => inputRef.current.click()}>
            تحديد صورة من هنا
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
