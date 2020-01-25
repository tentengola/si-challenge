'use strict';

const methods = require('./interactions.handler.js').methods;
const aws = require('aws-sdk');
const deps = {};

exports.handler = methods(deps);