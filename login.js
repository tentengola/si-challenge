'use strict';

const jwt = require('jsonwebtoken');
const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', ...additionalHeaders },
});

//build a simple JWT for use with the interactions endpoints
exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body);

    //in prod, the secret would be pulled into the code from AWS secret manager
    const token = jwt.sign( { user:body.username }, 'hiuh7f5cdfghytr', { expiresIn: 5 * 60 });

    callback(null, response(200, { token: token }));
};
