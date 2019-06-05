const AWS = require('aws-sdk');
const validationUtil = require('./validation-util');
// load DDB configs from json file
const configsJSON = require('./configs.json');
// const and var declarations
const moduleName = 'core-snsutil.js ';
let sns = null;

try {
  console.log(`${moduleName}, configsJSON = ${JSON.stringify(configsJSON)}`);
  // set AWS region to send service requests to
  AWS.config.update({ region: configsJSON.aws_region });
  // Create a new SNS object
  sns = new AWS.SNS({ apiVersion: configsJSON.aws_sns_api_version });
} catch (error) {
  console.log(`${moduleName}, error = ${error.toString()}`);
  throw (new Error(`${moduleName}, error = ${error.toString()}`));
}

// sends a text message (SMS message) directly to a phone number (and no topic is created or required in this case)
// smsSubjectStr will be used only when the message is delivered to email endpoints
exports.sendSMSToPhone = async (toPhoneNumber, smsSubjectStr, smsMsgStr) => {
  const funcName = 'sendSMSToPhone: ';
  try {
    // validate params
    await validationUtil.validateStringTypeParamList([toPhoneNumber, smsMsgStr]);
    // prepare SNS PARAMS
    const params = {
      PhoneNumber: toPhoneNumber,
      Subject: smsSubjectStr,
      Message: smsMsgStr,
    };
    // send msg
    const data = await sns.publish(params).promise();
    if (!(data && data.MessageId)) {
      console.log(`${funcName}Invalid data value, data = ${JSON.stringify(data)}`);
      throw (new Error('Failed to send message'));
    }
    return data;
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    throw (error);
  }
};
