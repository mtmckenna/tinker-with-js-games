const aws = require("aws-sdk");
const crypto = require("crypto");
const util = require("util");

const { S3 } = aws;

exports.handler = async(event) => {
    const s3 = new S3();
    const s3Path = `z${crypto.randomBytes(16).toString("hex")}`;
    const redirectUrl = `https://tjsg.mtmckenna.com/${s3Path}`;
    const params = {
        Bucket: "tinker-with-js-games-html-uploads",
        Conditions: [
            { acl: "public-read" },
            { "Content-Type": "text/html"},
            ["content-length-range", 1, 2097152],
            ["starts-with", "$success_action_redirect", redirectUrl],
            ],
        Fields: { key: s3Path }
    };

    const createPresignedPost = util.promisify(s3.createPresignedPost).bind(s3);
    const postResponse = await createPresignedPost(params);

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "https://tjsg.mtmckenna.com",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postResponse),
    };
    return response;
};