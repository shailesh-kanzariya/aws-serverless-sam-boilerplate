# aws-serverless-sam-boilerplate
Foundational / Boilerplate code for AWS based Serverless project which primarily use Lambda, API Gateway, DynamoDB and SAM
# Watch This Code: Work In Progress...
# Overview
  This project provides foundational / boilerplate code to quick start an AWS based Serverless project which primarly use AWS SAM, Lambda, Lambda Layer, API Gateway, DynamoDB, SES, SNS etc.
# Project Structure
  ## common-code-layer 
  Lambda Layer containing common code
  - **Node Modules**
    - Has 'aws-sdk' node module mainly
  - **Custom Modules**
    - *core-ddbutil.js*
      - Has core functinalities to GET and PUT item into DDB table
    - *core-sesutil.js*
      - Has core functinalities to send email using AWS SES
    - *core-snsutil.js*
      - Has core funtionalities to send SMS (text message) using AWS SNS
    - *data-models.js*
      - Contains application specific different 'data model' structure definitions
    - *response-util.js*
      - Has basic functinalities to prepare 'Error' and 'Success' API responses
    - *usesrs.js*
      - Application use case specific wrapper which under the hood uses 'core-ddbutil.js' to create and get users
    - *validation-util.js*
      - Core functinalities to perofrm different input data validations
    - *configs.json*
      - App specific configurations
## sample-lambda-function 
  Sample Lambda function which demonstrated creating new user into DynamoDB table and using different common utils from Lambda Layer)
  - app.js
    - Lambda handler file which processes lambda 'event' and returns 'success' or 'error' API response
    - Uses 'users.js' module to perform 'add new user into DDB table operation'
    - Validates required API request parameters
# Prerquisites
- [Install AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Export AWS_PROFILE environment variable](https://docs.aws.amazon.com/sdk-for-java/v2/developer-guide/credentials.html)
- This document asssumes good knowledge and hands on with AWS Console, AWS CLI and AWS SDK. It does not provide step by step, micro level details
# How to use?
- Git clone the project repository.
- Open 'Terminal' or 'Shell'
- CD to clonned project directory
- Make sure you have SAM CLI installed and AWS_PROFILE set properly
- Open "configs.json" file and modify "aws_region" variable if required. By default it uses "us-west-2" AWS region
- Make sure you are in the same directory where 'template.uaml' exist
- SAM packaging and deployment requires S3 bucket to upload the package. You can use any existing S3 bucket or create new one e.g. aws s3 mb my.sls.sample.project
- Run 'sam package' command
  - - First, replace 'my.sls.sample.project' with the S3 bucket you wish to use
  - sam package --output-template-file packaged.yaml --s3-bucket my.sls.sample.project
  - Make sure it runs successfully and creates 'packaged.yaml' file
- Run 'sam deploy' command
  - First, replace 'my-sls-lambda' with the stack-name you wish to give
  - sam deploy --template-file packaged.yaml --stack-name my-sls-lambda --capabilities CAPABILITY_IAM 
  - If it runs successfully then it creates and deploys 'Lambda', 'API Gateway API' and 'DynamoDB' table resources
- Test
  - Go to AWS API Gateway Console and navigate to API created by this stack. Find API endpoint for 'users' resource and test using either curl or POSTMAN collection
# Extend By Adding Your Lambda Functions And Other AWS Resources
  This project gives foundational structure and code to quick start your serverless application. As per your application need, add more Lambda, APIs, DynamoDB tables or add new AWS resources like AWS SES, SNS etc.
# Help To Improve
  Please help to improve by creating bug / issue / improvment / features
