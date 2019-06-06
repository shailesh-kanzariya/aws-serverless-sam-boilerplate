/* eslint-disable import/no-absolute-path */
/* eslint-disable import/no-unresolved */
const users = require('/opt/nodejs/users');
const validationUtil = require('/opt/nodejs/validation-util');
const responseUtil = require('/opt/nodejs/response-util');
const configsJSON = require('/opt/nodejs/configs.json');
// Mandatory API request params
const requiredReqParamsList = ['email', 'firstname', 'lastname'];

// Sample Lambda function to create new user and add it into DDB table
exports.lambdaHandler = async (event) => {
  const funcName = 'lambdaHandler: ';
  try {
    console.log(`${funcName}event = ${JSON.stringify(event)}`);
    console.log(`${funcName}configsJSON = ${JSON.stringify(configsJSON)}`);
    if (!event.body) { // return 400, bad request
      console.log(`${funcName}Invalid request body, event.body = ${JSON.stringify(event.body)}`);
      const apiRes = await responseUtil.getErrorAPIResponse(400);
      return apiRes;
    }
    const evtBody = JSON.parse(event.body);
    console.log(`${funcName}evtBody = ${JSON.stringify(evtBody)}`);
    // validate that API request has all required parameters
    try {
      await validationUtil.validateRequiredRequestBodyParams(event, requiredReqParamsList);
    } catch (error) { // return 400, bad request and missing params
      console.log(`${funcName}error = ${error}`);
      const apiRes = await responseUtil.getErrorAPIResponse(400, error, 'Missing required request parameters');
      return apiRes;
    }
    const userData = await users.createNewUser(evtBody.email, evtBody.firstname, evtBody.lastname);
    console.log(`${funcName}userData = ${userData}`);
    // all good
    const apiRes = await responseUtil.getSuccessAPIResponse(200, 'User created successfully');
    console.log(`${funcName}apiRes = ${JSON.stringify(apiRes)}`);
    return apiRes;
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    const apiRes = await responseUtil.getErrorAPIResponse(500, error);
    return apiRes;
  }
};
