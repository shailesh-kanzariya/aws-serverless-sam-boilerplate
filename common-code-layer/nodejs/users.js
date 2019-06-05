const ddbUtil = require('./core-ddbutil');
const validationUtil = require('./validation-util');
const { User } = require('./data-models');
// load configs from json file
const ddbConfigsJSON = require('./configs.json');

// Sample of application use case specific wrapper function which use "core-ddbutil.js" under the hood
// App sepecific use case  - Create New User into DDB Table
exports.createNewUser = async (userEmail, userFirstName, userLastName) => {
  const funcName = 'createNewUser: ';
  try {
    // validate input params
    await validationUtil.validateStringTypeParamList([userEmail]);
    // get user data model
    const userModel = new User(userEmail, userFirstName, userLastName);
    console.log(`${funcName}userModel = ${JSON.stringify(userModel)}`);
    // define DDB table params
    const params = {
      TableName: ddbConfigsJSON.ddb_users_table_name,
      ConditionExpression: 'attribute_not_exists(Email)', // Item with same email MUST not exist
      Item: userModel,
    };
    const data = await ddbUtil.putItemInTable(params);
    return data;
  } catch (error) {
    console.log(`${funcName}: error = ${error}`);
    throw (error);
  }
};

// Sample of application use case specific wrapper function which use "core-ddbutil.js" under the hood
// App sepecific use case  - Get User from DDB Table with given 'Email' value
exports.getUser = async (userEmail) => {
  const funcName = 'getUser: ';
  try {
    await validationUtil.validateStringTypeParamList([userEmail]);
    // define params
    const params = {
      TableName: ddbConfigsJSON.ddb_users_table_name,
      Key: {
        Email: userEmail,
      },
    };
    const dataItem = await ddbUtil.getItemFromTable(params);
    return dataItem;
  } catch (error) {
    console.log(`${funcName}: error = ${error}`);
    throw (error);
  }
};
