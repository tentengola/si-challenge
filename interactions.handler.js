'use strict';

const moment = require('moment');
const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT, POST', ...additionalHeaders },
});

//checks for necessary data and creates dynamoDB put operation
const put = async(deps, event) => {
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

      return response(201, { message: 'Created item', id: { application: params.Item.application, time: params.Item.time } });
    }
    else {
      return response(400, { error: 'To record an interaction, you must include values for application, operation, and currentMediaTime.' });
    }
  }
  catch (err) {
    throw err;
  }
};

//builds a search query and returns a daily count object
const post = async(deps, event) => {
  try {
    const body = JSON.parse(event.body);
    if (body && body.startDate && body.endDate && body.application) {
      
      //creates between range for the dynamoDB query from the submitted dates 
      const startTime = new Date(body.startDate + 'T00:00:00-00:00').getTime();
      const endTime = new Date(body.endDate + 'T23:59:59-00:00').getTime();

      const params = {
        TableName: "interactions",
        KeyConditionExpression: "application = :application AND #time BETWEEN :start AND :end",
        ExpressionAttributeNames: {
          '#time': 'time'
        },
        ExpressionAttributeValues: {
          ":application": body.application,
          ":start": startTime,
          ":end": endTime
        }
      };

      const queryResponse = await deps.docClient.query(params).promise();

      //this creates a counts object for the reponse that shows daily interactions
      const items = queryResponse.Items;

      let counts = {};

      for (let i = 0; i < items.length; i++) {

        if (counts[items[i].date]) {
          counts[items[i].date] += 1;
        }
        else {
          counts[items[i].date] = 1;
        }

      }

      return response(200, { counts: counts });
    }
    else {
      return response(400, { error: 'To retrieve interaction counts, you must include values for startDate, endDate, and application.' });
    }
  }
  catch (err) {
    throw err;
  }
};

//switch to filter out request for methods that don't exist
exports.methods = deps => async(event, context, callback) => {
  try {
    switch (event.httpMethod) {
      case 'PUT':
        return await put(deps, event);
      case 'POST':
        return await post(deps, event);
      default:
        return response(405, { Message: `Unsupported method: ${event.httpMethod}` }, { Allow: 'POST,PUT' });
    }
  }
  catch (err) {
    return response(500, { error: err.message });
  }
};
