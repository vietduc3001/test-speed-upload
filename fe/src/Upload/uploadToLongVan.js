import AWS from "aws-sdk";
import { getFileSize, convertTime } from "../helper";

const CONFIG = {
  accessKey: "EUMTEDYNRU6NEV7CQ1P0",
  secretKey: "0xCTFBIzeanOPzACW8hWJ83q84EzLxllPY9u3BDp",
  endpoint: "s3-hcm-r1.longvan.net",
  bucket: "ant-music-bucket-test",
};

let { accessKey, secretKey, endpoint, bucket } = CONFIG;

let s3 = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  endpoint: endpoint,
  s3ForcePathStyle: true,
  //signatureVersion: "v3",
  sslEnabled: true,
  httpOptions: {
    timeout: 1000 * 60000,
  },
});

export const uploadToLongVan = (
  fileUploadInformation,
  handleChangeUploadProgress,
) => {
  const { file, objKey, startTime } = fileUploadInformation;
  const params = {
    Body: file,
    Bucket: bucket,
    Key: objKey,
  };

  const managedUpload = new AWS.S3.ManagedUpload({
    partSize: file.size + 10 * 1024 * 1024,
    queueSize: 1,
    params: params,
    service: s3,
  });

  managedUpload.on("httpUploadProgress", (progress) => {
    const progressVariable = Math.round(
      (progress.loaded / progress.total) * 100,
    );
    handleChangeUploadProgress(progressVariable);
  });
  managedUpload.send((err, data) => {
    if (err) {
      alert("File upload lỗi", err);
      return;
    }
    const endTime = new Date(); // End time of the upload

    const finishedTime = convertTime(startTime, endTime);
    const fileSize = getFileSize(fileUploadInformation.file.size);
    const message = `LONGVAN: Hoàn thành trong ${finishedTime} | Kích thước: ${fileSize}`;

    console.log(message);
    alert(message);
  });
};
