// Validation Module contains utility functions to perform different data validations

// Validate that each item in the given list is of type string, is not null and has length > 0
exports.validateStringTypeParamList = async (strParamsList) => {
  const funcName = 'validateStringTypeParamList: ';
  try {
    if (!(strParamsList && Array.isArray(strParamsList))) {
      console.log(`${funcName}error = Invalid value of param, strParamsList = ${JSON.stringify(strParamsList)}`);
      throw (new Error('Invalid value of input parameter'));
    }
    console.log(`${funcName}strParamsList = ${JSON.stringify(strParamsList)}`);
    const invalidParamsList = [];
    // for each item check its type is string, not null and length > 0
    strParamsList.forEach((element) => {
      console.log(`${funcName}element = ${element}`);
      if (!(element !== null && element !== undefined && typeof element === 'string' && String(element).length > 0)) {
        invalidParamsList.push(element);
      }
    });
    console.log(`${funcName}invalidParamsList = ${JSON.stringify(invalidParamsList)}`);
    if (invalidParamsList.length > 0) {
      console.log(`${funcName}error = Invalid value of param, invalidParamsList = ${JSON.stringify(invalidParamsList)}`);
      throw (new Error(`Invalid value of one or more parameters, invalidParamsList = ${JSON.stringify(invalidParamsList)}`));
    }
    return strParamsList;
  } catch (error) {
    console.log(`${funcName}: error = ${error}`);
    throw (error);
  }
};

// Validate that each item in the given list is 'in valid JSON structure'
exports.validateJSONTypeParamList = async (jsonParamsList) => {
  const funcName = 'validateJSONTypeParamList: ';
  try {
    if (!(jsonParamsList && Array.isArray(jsonParamsList))) {
      console.log(`${funcName}error = Invalid value of param, jsonParamsList = ${JSON.stringify(jsonParamsList)}`);
      throw (new Error('Invalid value of input parameter'));
    }
    console.log(`${funcName}jsonParamsList = ${JSON.stringify(jsonParamsList)}`);
    Array(jsonParamsList).forEach((jsonObject) => {
      // iterate through each key-value of JSON object. If it is not valid JSON then below code will throw error
      // eslint-disable-next-line no-restricted-syntax
      for (const key in jsonObject) {
        // eslint-disable-next-line no-prototype-builtins
        if (jsonObject.hasOwnProperty(key)) {
          const keyVal = jsonObject[key];
          console.log(`${funcName}keyVal = ${keyVal}`);
        }
      } // for in
    }); // forEach
    return jsonParamsList;
  } catch (error) {
    console.log(`${funcName}: error = ${error}`);
    throw (error);
  }
};

// Validate 'event' object by checking that it contains each 'required' parameter as asked in the 'requiredParamsList' list
exports.validateRequiredRequestBodyParams = async (event, requiredParamsList) => {
  const funcName = 'validateRequiredRequestBodyParams: ';
  try {
    if (!event) {
      console.log(`${funcName}Invalid value of event, event = ${JSON.stringify(event)}`);
      throw (new Error('Invalid value of event'));
    }
    if (!requiredParamsList) {
      console.log(`${funcName}Invalid value of requiredParamsList, requiredParamsList = ${JSON.stringify(requiredParamsList)}`);
      throw (new Error('Invalid value of requiredParamsList'));
    }
    const evtBody = JSON.parse(event.body);
    console.log(`${funcName}evtBody = ${JSON.stringify(evtBody)}`);
    const missingParams = [];
    // iterate each required param and validate it against event body
    Array(requiredParamsList).forEach((element) => {
      console.log(`${funcName}element = ${element}`);
      if (!evtBody[element]) { // if event body does not conain required param then add it into missing params list
        missingParams.push(element);
      }
    }); // forEach
    if (missingParams.length > 0) {
      throw (new Error(`Missing required request params: ${JSON.stringify(missingParams)}`));
    }
    return requiredParamsList;
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    throw (error);
  }
};
