const { SESClient } = require("@aws-sdk/client-ses");

const REGION = "ap-south-1";

console.log("AWS Key Exists:", !!process.env.AWS_ACCESS_KEY);
console.log("AWS Secret Exists:", !!process.env.AWS_SECRET_KEY);

const sesClient = new SESClient({ region: REGION ,credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY
}});
module.exports = { sesClient };
