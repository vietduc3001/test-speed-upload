import AWS from "aws-sdk";
import { logMessage } from "../helper";

const CONFIG = {
  accessKey: "63048af01deccf617b4d",
  secretKey: "k2Wj7uoJ/QSw1GjMjZnboIoAPnlm+j6iQsXttv0z",
  endpoint: "s3-north.viettelidc.com.vn",
  bucket: "ant-music-trial-viettel",
};
const EXPIRES_TIME = 60;

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

export const downloadFile = (key) => {
  console.log("file: uploadToViettel.js:28 ~ downloadFile ~ key:", key);

  // s3.getObject({
  //   Bucket: 'ant-music-bucket-test',
  //   Key: 'beat mashup 3 bai.mp3',
  // })
  //   .promise()
  //   .then((data) => {
  //     // File contents are in data.Body
  //     console.log(data);
  //     // saveAs(data.Body, 'YOUR_FILE_NAME');
  //     const file = new Blob([data.Body], { type: 'audio/mpeg' });
  //     saveAs(file, 'YOUR_FILE_NAME');
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: EXPIRES_TIME,
  };
  s3.getSignedUrl("getObject", params, function (err, url) {
    if (err) {
      console.log("err", err);
    } else {
      // Use the URL to download the file
      console.log("url", url);
      window.open(url);
    }
  });
};

// ========================== UPLOAD MULTI PART ===========================
const PART_SIZE = 5 * 1024 * 1024;

export const uploadToViettel = (
  fileUploadInformation,
  handleChangeUploadProgress,
  distributor,
) => {
  const params = {
    Bucket: bucket,
    Key: fileUploadInformation.objKey,
    ContentType: fileUploadInformation.file.type,
    ACL: "public-read",
  };

  s3.createMultipartUpload(params, (mpErr, multipart) => {
    if (mpErr) {
      console.log("createMultipartUpload Error: ", mpErr);
      return;
    }
    uploadPart(
      s3,
      multipart,
      1,
      0,
      fileUploadInformation,
      handleChangeUploadProgress,
    );
  });
};

function uploadPart(
  s3,
  multipart,
  partNum,
  rangeStart,
  fileUploadInformation,
  handleChangeUploadProgress,
) {
  let progress = ((rangeStart / fileUploadInformation.file.size) * 100).toFixed(
    2,
  );
  if (progress > 100) progress = 100;
  handleChangeUploadProgress(progress);

  if (fileUploadInformation.file.size <= rangeStart) {
    getETag(multipart.UploadId, partNum - 1, fileUploadInformation);
    return;
  }

  fileUploadInformation.reader.readAsArrayBuffer(
    fileUploadInformation.file.slice(rangeStart, rangeStart + PART_SIZE),
  );
  fileUploadInformation.reader.onload = function startUploadAPart() {
    let byte2Upload = null;
    byte2Upload = fileUploadInformation.reader.result;
    const partParams = {
      Body: byte2Upload,
      Bucket: bucket,
      Key: fileUploadInformation.objKey,
      PartNumber: String(partNum),
      UploadId: multipart.UploadId,
    };

    s3.uploadPart(partParams, (multiErr, mData) => {
      if (multiErr) {
        console.log("multiErr, upload part error: ", multiErr);
        return;
      }
      byte2Upload = null;
      uploadPart(
        s3,
        multipart,
        partNum + 1,
        rangeStart + PART_SIZE,
        fileUploadInformation,
        handleChangeUploadProgress,
      );
    });
  };
}

function getETag(uploadId, totalPart, fileUploadInformation) {
  var listPartParams = {
    Bucket: bucket,
    Key: fileUploadInformation.objKey,
    UploadId: uploadId,
    MaxParts: totalPart,
    PartNumberMarker: 0,
  };
  s3.listParts(listPartParams, (err, data) => {
    if (err) {
      console.log("🚀 ~ file: UploadForm.js:187 ~ s3.listParts ~ err:", err);
      return;
    }

    var multipartMap = {
      Parts: [0],
    };
    for (let i = 0; i < data.Parts.length; i++) {
      let aPart = data.Parts[i];
      multipartMap.Parts[i] = {
        ETag: aPart.ETag,
        PartNumber: Number(aPart.PartNumber),
      };
    }

    var doneParams = {
      Bucket: bucket,
      Key: fileUploadInformation.objKey,
      MultipartUpload: multipartMap,
      UploadId: uploadId,
    };
    completeMultipartUpload(s3, doneParams, fileUploadInformation);
  });
}

function completeMultipartUpload(s3, doneParams, fileUploadInformation) {
  s3.completeMultipartUpload(doneParams, (err, data) => {
    if (err) {
      console.log("An error occurred while competing the multipart upload");
      console.log(err);
    } else {
      logMessage(fileUploadInformation);
    }
  });
}
