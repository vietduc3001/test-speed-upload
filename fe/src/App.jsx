// ./src/App.tsx

import React, { useState, useRef } from "react";
import {
  uploadToAzure,
  uploadToViettel,
  uploadToLongVan,
  uploadToAmazon,
  uploadToGoogleCloud,
  downloadFile,
  downloadFileFromGoogleCloud,
} from "./Upload";
import { getFileSize } from "./helper";
import dayjs from "dayjs";

const DISTRIBUTOR = ["LONGVAN", "AZURE", "VIETTEL", "AMAZON", "GOOGLE"];

const getObjKey = (file) => {
  const currentYear = dayjs().format("YYYY");
  const currentMonth = dayjs().format("MM");
  const currentDay = dayjs().format("DD");
  const currentTime = dayjs().format("YYYY-MM-DD-hh-mm-ss");
  const fileName = file.name.replace(/ /g, "_");
  const objKey = `${currentYear}/${currentMonth}/${currentDay}/${currentTime}-${fileName}`;
  return objKey;
};

const App = () => {
  const fileInput = useRef(null);
  const [file, setFile] = useState({});
  const [audioSrc, setAudioSrc] = useState("");
  const [distributor, setDistributor] = useState("GOOGLE");
  const [progress, setProgress] = useState(0);
  const handleChangeProgress = (value) => {
    setProgress(value);
  };

  const handleUpload = async (e) => {
    if (!distributor) {
      alert("Vui lòng chọn nơi lưu");
      return;
    }
    if (!file.name) {
      alert("Vui lòng chọn file");
      return;
    }

    const objKey = getObjKey(file);

    const fileUploadInformation = {
      startTime: new Date(),
      file: file,
      objKey,
      reader: new FileReader(),
      distributor,
    };

    switch (distributor) {
      case "AZURE":
        uploadToAzure(fileUploadInformation, handleChangeProgress);
        break;
      case "VIETTEL":
        uploadToViettel(fileUploadInformation, handleChangeProgress);
        break;
      case "AMAZON":
        uploadToAmazon(fileUploadInformation, handleChangeProgress);
        break;
      case "LONGVAN":
        uploadToLongVan(fileUploadInformation, handleChangeProgress);
        break;
      case "GOOGLE":
        uploadToGoogleCloud(fileUploadInformation, handleChangeProgress);
        break;
      default:
        break;
    }
  };

  const onChange = (e) => {
    setFile(e.target.files?.[0] || {});
    // console.log(
    //   "🚀 ~ file: App.jsx:46 ~ onChange ~ e.target.files:",
    //   e.target.files,
    // );
  };

  const onChangeDistributor = (e) => {
    setDistributor(e.target.value);
  };

  const handleResetConsole = () => {
    console.log(
      "-----------------------------------------------------------------------------------",
    );
  };

  const getAudioSrc = (value) => {
    setAudioSrc(value);
  };

  const handleDownload = () => {
    // const key =
    //   "2023/03/17/2023-03-17-10-52-07-Special_4K_HDR_120FPS_Dolby_Vision_Demo.mkv";
    downloadFileFromGoogleCloud(key, getAudioSrc);
  };

  const onChangeInput = (e) => {
    console.log("file: App.jsx:103 ~ onChangeInput ~ e:", e.target.value);

    setKey(e.target.value);
  };
  const [key, setKey] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      {/* <h1>Test tốc độ upload</h1> */}
      <input
        style={{ width: "100%" }}
        ref={fileInput}
        onChange={onChange}
        type="file"
        required
      />
      {/* <div>
        <h4 style={{ marginBottom: 0 }}>Nơi lưu</h4>

        {DISTRIBUTOR.map((item) => (
          <React.Fragment key={item}>
            <input
              onChange={onChangeDistributor}
              type="radio"
              id={item}
              name="fav_language"
              value={item}
            />
            <label htmlFor={item}>{item}</label>
            <br />
          </React.Fragment>
        ))}
      </div> */}

      {/* <h3>Tên file: {file.name || ""}</h3> */}
      <h4>Kích thước: {getFileSize(file.size || 0)}</h4>
      <h4>Tiến trình: {progress}%</h4>
      <button onClick={handleUpload}>Tải lên</button>

      <h4 style={{ marginBottom: 0 }}>Download</h4>
      <input style={{ width: "100%" }} onChange={onChangeInput} value={key} />
      <button style={{ marginTop: "10px" }} onClick={handleDownload}>
        download
      </button>
      {/* <button style={{ marginLeft: "20px" }} onClick={handleResetConsole}>
        Reset console
      </button> */}

      {(audioSrc && (
        <audio controls>
          <source src={audioSrc} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )) ||
        null}
    </div>
  );
};

export default App;
