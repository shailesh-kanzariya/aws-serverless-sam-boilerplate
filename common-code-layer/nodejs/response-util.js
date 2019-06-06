const validationUtil = require('./validation-util');

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};
const responseJSON = {
  200: {
    statusCode: 200,
    headers: responseHeaders,
  },
  400: {
    statusCode: 400,
    headers: responseHeaders,
  },
  500: {
    statusCode: 500,
    headers: responseHeaders,
  },
};

/*
  Follow "Error First" approach of Node.js. If an error then return error first. If there is no error then only return "result"
  Both "result" and "error" JSON keys NEVER exist together in response json.

  Error Response JSON Sample:
    { "error": "Bad Request", "info": "Missing required request parameters: 'email', 'firstname' " } Or
    { "error": "Internal Server Error", "info": "Data invalid" }
*/
async function getErrorAPIResponse(resStatusCode, errorObj, infoStr) { // error, info are optional, if provided will overwrite default
  const funcName = 'getErrorAPIResponse: ';
  try {
    // validate input params
    await validationUtil.validateStringTypeParamList([String(resStatusCode)]); // resStatusCode must exist
    // prepare response as per resStatusCode
    switch (resStatusCode) {
      // Bad Request
      case 400: {
        console.log(`${funcName}case:400`);
        const apiResJson = responseJSON[resStatusCode];
        console.log(`${funcName}apiResJson = ${JSON.stringify(apiResJson)}`);
        // add body
        const errJSON = {};
        if (errorObj) { // if errorObj exist then add it in body
          errJSON.error = errorObj.toString();
        } else { // else add default error message string in body
          errJSON.error = 'Bad Request';
        }
        // if info exist then add it
        if (infoStr && typeof (infoStr) === 'string' && String(infoStr).length > 0) {
          errJSON.info = infoStr;
        }
        apiResJson.body = JSON.stringify(errJSON);
        console.log(`${funcName}apiResJson = ${JSON.stringify(apiResJson)}`);
        return apiResJson;
      }
      // Internal Server Error
      case 500:
      default:
      {
        console.log(`${funcName}case:500, default`);
        const apiResJson = responseJSON[resStatusCode];
        // add body
        const errJSON = {};
        if (errorObj) {
          errJSON.error = errorObj.toString();
        } else {
          errJSON.error = 'Internal Server Error';
        }
        // if info exist, add it
        if (infoStr && typeof (infoStr) === 'string' && String(infoStr).length > 0) {
          errJSON.info = infoStr;
        }
        apiResJson.body = JSON.stringify(errJSON);
        console.log(`${funcName}apiResJson = ${JSON.stringify(apiResJson)}`);
        return apiResJson;
      }
    }
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    throw (error);
  }
}

/*
  Follow "Error First" approach of Node.js. If an error then return error first. If there is no error then only return "result"
  Both "result" and "error" JSON keys NEVER exist together in response json.

  Success Response JSON Sample:
    { "result": "success" } or
    { "result": "User created successfully" } or
    { "result": [ { "email": "john.doe@acme.com", "firstname": "John", "lastname": "Doe" } ] }
*/
async function getSuccessAPIResponse(resStatusCode, resultData) { // resultData is optional, if provided will overwrite default
  const funcName = 'getSuccessAPIResponse: ';
  try {
    // validate input params
    await validationUtil.validateStringTypeParamList([String(resStatusCode)]); // resStatusCode must exist
    if (resultData) {
      console.log(`${funcName}resultData = ${resultData}`);
    }
    // prepare response as per resStatusCode
    switch (resStatusCode) {
      // OK
      default:
      case 200: {
        console.log(`${funcName}case:200`);
        const apiResJson = responseJSON[resStatusCode];
        console.log(`${funcName}apiResJson = ${JSON.stringify(apiResJson)}`);
        // add response result body
        const resResultJSON = {};
        if (resultData) { // if resultData exist then add it in body
          resResultJSON.result = resultData;
        } else { // else add default message string in body
          resResultJSON.result = 'success';
        }
        apiResJson.body = JSON.stringify(resResultJSON);
        console.log(`${funcName}apiResJson = ${JSON.stringify(apiResJson)}`);
        return apiResJson;
      }
    } // switch
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    throw (error);
  }
}

module.exports = { getSuccessAPIResponse, getErrorAPIResponse };
