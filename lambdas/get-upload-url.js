const aws = require("aws-sdk");
const crypto = require("crypto");
const util = require("util");

const { S3 } = aws;

exports.handler = async () => {
  const s3 = new S3();
  const s3Path = `z${crypto.randomBytes(3).toString("hex")}`;
  const params = {
    Bucket: "tinker-with-js-games-html-uploads",
    Conditions: [
      { acl: "public-read" },
      { "Content-Type": "text/html" },
      ["content-length-range", 1, 2097152],
    ],
    Fields: { key: s3Path }
  };

  const createPresignedPost = util.promisify(s3.createPresignedPost).bind(s3);
  const postResponse = await createPresignedPost(params);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postResponse),
  };

  return response;
};