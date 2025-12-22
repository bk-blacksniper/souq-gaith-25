import { useRef, useState } from "react";
import "../styles/FileUploader.css";
import Image from "../assets/icon/Image.png";

function FileUploader() {
  const [files, setFiles] = useState(null);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  // send files to the server
  const handleUpload = () => {};

  if (files)
    return (
      <div className="uploads">
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
        <div className="actions">
          <button className="btnn" onClick={() => setFiles(null)}>Cancel</button>
          <button className="btnn" onClick={handleUpload}>Upload</button>
        </div>
      </div>
    );

  return (
    <div>
      {!files && (
        <div
          className="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <img src={Image} alt="Upload Images" className="img-upload"/>
          <h3>قم برفع صورة هنا</h3>
          <h3>أو</h3>
          <input
            type="file"
            multiple
            onChange={(event) => setFiles(event.target.files)}
            hidden
            ref={inputRef}
          />
          <button className="btn-upload" onClick={() => inputRef.current.click()}>تحديد صورة من هنا</button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
