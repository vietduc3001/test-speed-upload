import URLSearchParams from "url-search-params";
import { logMessage } from "../helper";
import axios from "axios";

const ENDPOINT = "http://localhost:4000";

export const uploadToGoogleCloud = (
  fileUploadInformation,
  handleChangeProgress,
) => {
  const params = {
    fileName: fileUploadInformation.objKey,
    contentType: fileUploadInformation.file.type,
  };

  console.log(
    "file: uploadToGoogleCloud.js:17 ~ fileUploadInformation:",
    fileUploadInformation,
  );

  const searchParams = new URLSearchParams(params).toString();
  const url = `${ENDPOINT}/get-signed-url?${searchParams}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        uploadFile(fileUploadInformation, result.url, handleChangeProgress);
      } else {
        console.log("result", result);
      }
    });
};

async function uploadFile(
  fileUploadInformation,
  signedUrl,
  handleChangeProgress,
) {
  const { file } = fileUploadInformation;
  // const response = await fetch(signedUrl, {
  //   method: "PUT",
  //   headers: {
  //     "Content-Type": file.type,
  //   },
  //   body: file,
  // });
  // console.log("response", response);
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", signedUrl, true);

  xhr.upload.onprogress = (event) => {
    const percentComplete = ((event.loaded / event.total) * 100).toFixed(2);
    handleChangeProgress(percentComplete);
    // console.log(`Upload progress: ${percentComplete}%`);
    // Update the UI with the progress
  };

  xhr.onload = () => {
    console.log("file: uploadToGoogleCloud.js:68 ~ xhr:", xhr);
    if (xhr.status === 200) {
      // console.log("Upload succeeded");
      // console.log("Server response:", xhr.response);
      // Handle successful completion of the upload
      logMessage(fileUploadInformation);
    } else {
      // console.error("Upload failed");
      // Handle upload failure
    }
  };

  xhr.send(file);
}

export function downloadFileFromGoogleCloud(objKey, getAudioSrc) {
  console.log(
    "file: uploadToGoogleCloud.js:78 ~ downloadFileFromGoogleCloud ~ objKey:",
    objKey,
  );

  const params = {
    fileName: objKey,
  };
  const searchParams = new URLSearchParams(params).toString();
  const url = `${ENDPOINT}/download?${searchParams}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        // window.open(result.url);
        getAudioSrc(result.url);

        console.log(
          "file: uploadToGoogleCloud.js:85 ~ .then ~ result:",
          result,
        );
      } else {
        console.log("result", result);
      }
    });
}
