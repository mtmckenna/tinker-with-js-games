import "./index.css";

const GET_UPLOAD_PATH_URL = "https://g5f83oj990.execute-api.us-east-1.amazonaws.com/prod/upload-url";
const URL_PREFIX = "https://tjsg.mtmckenna.com";
let uploadCreds = null;

window.addEventListener("load", async function () {
  uploadCreds = await getUpdatedUploadCreds();
  const { fields, url } = uploadCreds;
  const redirectUrl = `${URL_PREFIX}/${fields['key'].split("/")[0]}`;
  const form = document.getElementById("upload-form");
  const formData = new FormData();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formData.append("acl", "public-read");
    formData.append("Content-Type", "text/html");
    Object.keys(fields).forEach((fieldName) => formData.append(fieldName, fields[fieldName]));
    formData.append("file", document.getElementById("file").value);

    await fetch(url, { body: formData, method: "POST" });
    uploadCreds = await getUpdatedUploadCreds();
    window.location.href = redirectUrl;
  });
});

async function getUpdatedUploadCreds() {
  const getUrlResponse = await getUploadUrl();
  const responseData = await getUrlResponse.json();
  return JSON.parse(responseData.body);
}

async function getUploadUrl() {
  return await fetch(GET_UPLOAD_PATH_URL);
}