'use strict';

const methods = require('../interactions.handler.js').methods;
const chai = require('chai');
const timeout = ms => new Promise(res => setTimeout(res, ms));
const queryResponse = require('./query-response.js').payload;

chai.should();

const deps = {
  docClient: {
    put: () => {
      return {
        promise: () => {
          return new Promise(async(resolve, reject) => {
            await timeout(500);
            resolve({});
          });
        }
      };
    },
    query: () => {
      return {
        promise: () => {
          return new Promise(async(resolve, reject) => {
            await timeout(500);
            resolve(queryResponse);
          });
        }
      };
    }
  }
};

const handler = methods(deps);

describe('Save an interaction', function() {
  it('returns a response from endpoint', async() => {
    const response = await handler({
      httpMethod: 'PUT'
    });
    response.statusCode.should.exist;
  });
  it('rejects unsupported methods', async() => {
    const response = await handler({
      httpMethod: 'UPDATE'
    });
    response.statusCode.should.equal(405);
  });
  it('rejects request without all required parameters', async() => {
    const response = await handler({
      httpMethod: 'PUT',
      requestContext: {
        identity: {
          sourceIp: '196.53.96.43'
        }
      },
      headers: {
        'User-Agent': 'PostmanRuntime/7.22.0'
      },
      body: JSON.stringify({
        application: 'vLive',
        operation: 'pause'
      })
    });
    response.statusCode.should.equal(400);
  });
  it('successfully puts an interaction in the database', async() => {
    const response = await handler({
      httpMethod: 'PUT',
      requestContext: {
        identity: {
          sourceIp: '196.53.96.43'
        }
      },
      headers: {
        'User-Agent': 'PostmanRuntime/7.22.0'
      },
      body: JSON.stringify({
        application: 'vLive',
        operation: 'pause',
        currentMediaTime: 209
      })
    });

    response.statusCode.should.equal(201);
    response.headers['Content-Type'].should.equal('application/json');
    let body = JSON.parse(response.body);
    body.id.application.should.equal('vLive');
  });
});

describe('Retrieve interactions', function() {
  it('returns a response from enpoint', async() => {
    const response = await handler({
      httpMethod: 'POST'
    });
    response.statusCode.should.exist;
  });
  it('rejects unsupported methods', async() => {
    const response = await handler({
      httpMethod: 'UPDATE'
    });
    response.statusCode.should.equal(405);
  });
  it('rejects request without all required parameters', async() => {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        startDate: '2019-01-01',
        endDate: '2019-01-03'
      })
    });
    response.statusCode.should.equal(400);
  });
  it('successfully returns counts from the database', async() => {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        startDate: '2020-01-25',
        endDate: '2020-01-26',
        application: 'vLive'
      })
    });

    response.statusCode.should.equal(200);
    response.headers['Content-Type'].should.equal('application/json');
    let counts = JSON.parse(response.body).counts;
    counts['2020-01-25'].should.equal(2);
    counts['2020-01-26'].should.equal(7);
  });
});
