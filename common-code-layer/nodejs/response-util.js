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

  Success Response JSON Sample:
    { "result": "success / custom success message / json data" }
  Error Response JSON Sample:
    { "error": "error message", "info": "more details about error" }
*/
async function getAPIResponse(resStatusCode, errorObj, infoStr, resBodyDataJSON) { // error, info and resBodyDataJSON are optional, if provided will overwrite default
  const funcName = 'getAPIResponse: ';
  try {
    // validate input params
    await validationUtil.validateStringTypeParamList([String(resStatusCode)]); // resStatusCode must exist
    if (resBodyDataJSON) {
      console.log(`${funcName}resBodyDataJSON = ${JSON.stringify(resBodyDataJSON)}`);
    }
    // prepare response as per resStatusCode
    switch (resStatusCode) {
      // OK
      case 200: {
        console.log(`${funcName}case:200`);
        const apiResJson = responseJSON[resStatusCode];
        console.log(`${funcName}apiResJson = ${JSON.stringify(apiResJson)}`);
        // add body
        const resultJSON = {};
        if (resBodyDataJSON) { // if resBodyDataJSON exist then add it in body
          resultJSON.result = resBodyDataJSON;
        } else { // else add default message string in body
          resultJSON.result = 'success';
        }
        apiResJson.body = JSON.stringify(resultJSON);
        console.log(`${funcName}apiResJson = ${JSON.stringify(apiResJson)}`);
        return apiResJson;
      }
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

module.exports = { getAPIResponse };
