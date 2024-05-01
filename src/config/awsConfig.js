require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
module.exports = { sqs, queueUrl: process.env.QUEUE_URL };
