const AWS = require('aws-sdk');
const validationUtil = require('./validation-util');
// load configs from json file
const configsJSON = require('./configs.json');
// const and let declarations
const moduleName = 'core-ddbutil.js ';
let docClient = null;

try {
  console.log(`${moduleName}, configsJSON = ${JSON.stringify(configsJSON)}`);
  // set AWS region to send service requests to
  AWS.config.update({ region: configsJSON.aws_region });
  // Create DynamoDB document client object
  docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: configsJSON.aws_ddb_api_version });
} catch (error) {
  console.log(`${moduleName}, error = ${error.toString()}`);
  throw (new Error(`${moduleName}, error = ${error.toString()}`));
}

// put item into DDB table as per params
exports.putItemInTable = async (params) => {
  const funcName = 'putItemInTable: ';
  try {
    console.log(`${funcName}params = ${JSON.stringify(params)}`);
    // validate 'params' input parameter
    await validationUtil.validateJSONTypeParamList([params]);
    const data = await docClient.put(params).promise();
    console.log(`${funcName}data = ${JSON.stringify(data)}`);
    if (data === null || data === undefined) {
      console.log(`${funcName}invalid data`);
      throw (new Error('Failed to put item'));
    }
    return data;
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    if (error.code === 'ConditionalCheckFailedException') {
      throw (new Error('Item already exist into the table'));
    }
    throw (error);
  }
};

// get item from DDB table as per params
exports.getItemFromTable = async (params) => {
  const funcName = 'getItemFromTable: ';
  try {
    console.log(`${funcName}params = ${JSON.stringify(params)}`);
    const data = await docClient.get(params).promise();
    console.log(`${funcName}data = ${data}`);
    console.log(`${funcName}data = ${JSON.stringify(data.Item)}`);
    if (data === null || data === undefined || data.Item === null || data.Item === undefined) {
      console.log(`${funcName} data invalid`);
      throw (new Error('Item not found for given values'));
    }
    return data.Item;
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    throw (error);
  }
};

/*
// load DDB Configurations
exports.loadDDBConfigs = async () => {
  const funcName = 'loadDDBConfigs: ';
  try {
    if (!configsJSON) {
      console.log(`${funcName}failed to load configs from configs.json file`);
      throw (new Error(`${funcName}failed to load configs`));
    }
    console.log(`${funcName}ddbConfigJSON = ${JSON.stringify(configsJSON)}`);
    return configsJSON;
  } catch (error) {
    console.log(`${funcName}error = ${error}`);
    throw (error);
  }
};
*/
