import dayjs from "dayjs";

export const getFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  let k = 1024,
    dm = 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function convertTime(startTime, endTime) {
  const time = endTime - startTime;
  const minutes = dayjs(time).format("mm");
  const seconds = dayjs(time).format("ss");
  return `${minutes} phút ${seconds} giây`;
}

export function logMessage(fileUploadInformation) {
  const { startTime, file, distributor } = fileUploadInformation;
  const endTime = new Date(); // End time of the upload

  const finishedTime = convertTime(startTime, endTime);
  const fileSize = getFileSize(file.size);
  const message = `${distributor}: Hoàn thành trong ${finishedTime} | Kích thước: ${fileSize}`;

  console.log(message);
  alert(message);
}
