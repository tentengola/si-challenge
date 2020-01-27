'use strict';
const jwt = require('jsonwebtoken');
const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET', ...additionalHeaders },
});

exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body);

    const token = jwt.sign( { user:body.username }, 'hiuh7f5cdfghytr', { expiresIn: 5 * 60 });

    callback(null, response(200, { token: token }));
};
