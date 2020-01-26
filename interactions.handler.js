'use strict';
const moment = require('moment');
const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json', ...additionalHeaders },
});

const put = async (deps, event) => {
  try {
    const body = JSON.parse(event.body);
    
    if (event.headers && event.requestContext && body && body.application && body.operation && body.currentMediaTime) {
      const time = new Date();

      let ip = "NA";
      if (event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp) {
        ip = event.requestContext.identity.sourceIp;
      }

      let referer = event.headers['Referer'] ? event.headers['Referer'] : "NA";
      let userAgent = event.headers['User-Agent'] ? event.headers['User-Agent'] : "NA";

      let params = {
        TableName: 'interactions',
        Item: {
          application: body.application,
          time: time.getTime(),
          operation: body.operation,
          currentMediaTime: body.currentMediaTime,
          ip: ip,
          referer: referer,
          userAgent: userAgent,
          date: moment(time).utc().format('YYYY-MM-DD')
        }
      };

      await deps.docClient.put(params).promise();
      
      return response(201, { message: 'Created item', item: params.Item });
    }
    else {
      return response(400, { message: 'To record an interaction, you must include values for application, operation, and currentMediaTime.' });
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