import URLSearchParams from "url-search-params";

const ENDPOINT = "http://localhost:4000/get-signed-url";

export const uploadToGoogleCloud = (
  fileUploadInformation,
  handleChangeProgress,
) => {
  const params = {
    fileName: fileUploadInformation.file.name,
    contentType: fileUploadInformation.file.type,
  };
  const searchParams = new URLSearchParams(params).toString();
  const url = `${ENDPOINT}?${searchParams}`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success") {
        uploadFile(fileUploadInformation, result.url);
      } else {
        console.log("result", result);
      }
    });
};

async function uploadFile(fileUploadInformation, signedUrl) {
  const { file } = fileUploadInformation;
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });
  console.log("response", response);
}
