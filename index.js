import "./index.css";

const GET_UPLOAD_PATH_URL = "https://g5f83oj990.execute-api.us-east-1.amazonaws.com/prod/upload-url";
const URL_PREFIX = "https://tjsg.mtmckenna.com";

window.addEventListener("load", async function () {
  const getUrlResponse = await getUploadUrl();
  const responseData = await getUrlResponse.json();
  const json = JSON.parse(responseData.body);
  const { fields, url } = json;
  const redirectUrl = `${URL_PREFIX}/${fields['key'].split("/")[0]}`;
  const form = document.getElementById("upload-form");

  form.setAttribute("action", url);
  form.prepend(createHiddenInput("success_action_redirect", redirectUrl));

  Object.keys(fields).forEach((fieldName) => {
    const input = createHiddenInput(fieldName, fields[fieldName]);
    form.prepend(input);
  });
});

async function getUploadUrl() {
  return await fetch(GET_UPLOAD_PATH_URL);
}

function createHiddenInput(name, value) {
  const input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", name);
  input.setAttribute("value", value);
  return input;
}