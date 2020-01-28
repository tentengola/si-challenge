'use strict';

const methods = require('./interactions.handler.js').methods;
const aws = require('aws-sdk');
const docClient = new aws.DynamoDB.DocumentClient();
const deps = { docClient };

//injecting dependencies for use in live Lambda handler
exports.handler = methods(deps);
