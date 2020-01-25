'use strict';

const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: body,
  headers: { 'Content-Type': 'application/json', ...additionalHeaders },
});

const put = async (deps, event) => {
  try {
    const body = JSON.parse(event.body);
    if(body && body.application && body.operation && body.currentMediaTime) {
      return response(200, JSON.stringify({message:'Hello'}));
    } else {
      return response(400, JSON.stringify({message:'To record an interaction, you must include values for application, operation, and currentMediaTime.'}));
    }
  } catch(err) {
    throw err;
  }
};

const post = async (deps, event) => {
  try {
    const body = JSON.parse(event.body);
    if(body && body.startDate && body.endDate && body.application) {
      return response(200, JSON.stringify({message:'Hello'}));
    } else {
      return response(400, JSON.stringify({message:'To retrieve interaction counts, you must include values for startDate, endDate, and application.'}));
    }
  } catch(err) {
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