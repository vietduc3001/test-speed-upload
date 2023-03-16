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

// The origin for this CORS config to allow requests from
const origin = "http://localhost:3000";

// The response header to share across origins
const responseHeader = "Content-Type";

// The maximum amount of time the browser can make requests before it must
// repeat preflighted requests
const maxAgeSeconds = 3600;

// The name of the method
// See the HttpMethod documentation for other HTTP methods available:
// https://cloud.google.com/appengine/docs/standard/java/javadoc/com/google/appengine/api/urlfetch/HTTPMethod
const method = "PUT";

async function configureBucketCors() {
  await storage.bucket(BUCKET_NAME).setCorsConfiguration([
    {
      maxAgeSeconds,
      method: [method],
      origin: [origin],
      responseHeader: [responseHeader],
    },
  ]);

  console.log(`Bucket ${BUCKET_NAME} was updated with a CORS config
      to allow ${method} requests from ${origin} sharing 
      ${responseHeader} responses across origins`);
}

async function generateSignedUrl(fileName, contentType) {
  configureBucketCors().catch(console.error);
  try {
    const [url] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl({
        version: "v4",
        action: "write",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: contentType,
      });
    return { status: "success", url };
  } catch (error) {
    return { status: "false", error };
  }
}

module.exports = {
  generateSignedUrl,
};

// Example usage
// generateSignedUrl("my-bucket", "my-file.txt", "text/plain")
//   .then((url) => {
//     // Use the signed URL to upload the file
//     console.log(`Upload file to ${url}`);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
