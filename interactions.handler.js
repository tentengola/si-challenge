'use strict';

const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: body,
  headers: { 'Content-Type': 'application/json', ...additionalHeaders },
});

const put = async (deps, event) => {
  try {
    return response(200, JSON.stringify({message:'Hello'}));
  } catch(err) {
    console.log('err', err);
    throw err;
  }
};

const post = async (deps, event) => {
  try {
    return response(200, JSON.stringify({message:'Hello'}));
  } catch(err) {
    console.log('err', err);
    throw err;
  }
};

exports.methods = deps => async (event, context, callback) => {
  try {
    switch (event.httpMethod) {
      case 'PUT':
        return await put(deps, event);
      case 'POST':
        return await post(deps, event);
      default: return response(405,
        { Message: `Unsupported method: ${event.httpMethod}` },
        { Allow: 'POST,PUT' });
    }
  } catch(err) {
    return response(500, JSON.stringify({ Error: err.message }));
  }
};