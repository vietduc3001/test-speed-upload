const express = require("express");
const cors = require("cors");
const { generateSignedUrl } = require("./googleCloud");
const { Storage } = require("@google-cloud/storage");

const app = express();
const port = 4000;

app.use(cors());
app.get("/", (req, res) => {
  // uploadWithoutAuthenticationSignedUrlStrategy().catch(console.error);
  res.send("Hello World!");
});

app.get("/get-signed-url", (req, res) => {
  const { fileName, contentType } = req.query;
  // Generate a signed URL for uploading the file to Google Cloud Storage

  let url = "abc";
  generateSignedUrl(fileName, contentType)
    .then((result) => {
      console.log("file: index.js:33 ~ .then ~ result:", result);
      res.send(result);
    })
    .catch((error) => console.log("error: ", error));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
