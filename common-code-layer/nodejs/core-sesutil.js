const AWS = require('aws-sdk');
const validationUtil = require('./validation-util');
// load configs from json file
const configsJSON = require('./configs.json');
// constants
const charset = 'UTF-8';
const moduleName = 'core-sesutil.js ';
let ses = null;

try {
  console.log(`${moduleName}, configsJSON = ${JSON.stringify(configsJSON)}`);
  // set AWS region to send service requests to
  AWS.config.update({ region: configsJSON.aws_region });
  // Create a new SES object
  ses = new AWS.SES({ apiVersion: configsJSON.aws_ses_api_version });
} catch (error) {
  console.log(`${moduleName}, error = ${error.toString()}`);
  throw (new Error(`${moduleName}, error = ${error.toString()}`));
}

// Ensure sender email id is verified in AWS SES
// Refre @ https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-addresses-and-domains.html
const sender = 'Enter Your Sender Email Id Here e.g. john.doe@acme.com';

// Sample send email function which can be customised as per use case need
exports.sendEmailTo = async (toEmailId, emailSubjectStr, emailMsgBodyStr) => {
  const funcName = 'sendEmailTo: ';
  try {
    // validate input params
    await validationUtil.validateStringTypeParamList([toEmailId, emailSubjectStr, emailMsgBodyStr]);
    const recipient = toEmailId;
    const subject = emailSubjectStr;
    const bodyText = emailMsgBodyStr;
    // configure ses params
    const params = {
      Source: sender,
      Destination: {
        ToAddresses: [
          recipient,
        ],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: charset,
        },
        Body: {
          Text: {
            Data: bodyText,
            Charset: charset,
          },
        },
      },
    }; // params
    console.log(`${funcName}params = ${JSON.stringify(params)}`);
    // Try to send the email.
    const data = await ses.sendEmail(params).promise();
    if (!(data && data.MessageId)) {
      console.log(`${funcName}Invalid data value, data = ${JSON.stringify(data)}`);
      throw (new Error('Failed to send email'));
    }
    console.log(`${funcName}data.MessageId = ${data.MessageId}`);
    return data;
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    throw (error);
  }
};
