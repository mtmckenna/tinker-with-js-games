import "./index.css";

const GET_UPLOAD_PATH_URL = "https://g5f83oj990.execute-api.us-east-1.amazonaws.com/prod/upload-url";
const form = document.getElementById("upload-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const uploadCreds = await getUpdatedUploadCreds();
  const { fields, url } = uploadCreds;
  const redirectUrl = `./${fields['key'].split("/")[0]}`;
  const formData = new FormData();

  formData.append("acl", "public-read");
  formData.append("Content-Type", "text/html");
  Object.keys(fields).forEach((fieldName) => formData.append(fieldName, fields[fieldName]));
  formData.append("file", document.getElementById("file").value);

  await fetch(url, { body: formData, method: "POST" });

  window.location.href = redirectUrl;
});

async function getUpdatedUploadCreds() {
  const getUrlResponse = await fetch(GET_UPLOAD_PATH_URL);
  const responseData = await getUrlResponse.json();
  return JSON.parse(responseData.body);
}