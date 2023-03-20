const { Storage } = require("@google-cloud/storage");

const BUCKET_NAME = "ant-music-test";
const PROJECT_ID = "unique-machine-380806";
const KEY_FILE_NAME =
  "D:/VietDuc/Demo/test-upload-speed/server/credentials.json";

const storage = new Storage({
  // Configure the Google Cloud Storage client with your credentials
  projectId: PROJECT_ID,
  keyFilename: KEY_FILE_NAME,
});

async function generateSignedUrl(fileName, contentType) {
  const config = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
    contentType,
  };

  try {
    const [url] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl(config);
    return { status: "success", url };
  } catch (error) {
    return { status: "false", error };
  }
}

async function generateDownloadUrl(fileName) {
  // These options will allow temporary read access to the file
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    // Get a v4 signed URL for reading the file
    const [url] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl(options);
    return { status: "success", url };
  } catch (error) {
    return { status: "false", error };
  }
}

module.exports = {
  generateSignedUrl,
  generateDownloadUrl,
};
