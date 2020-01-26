'use strict';

const methods = require('../interactions.handler.js').methods;
const chai = require('chai');
const timeout = ms => new Promise(res => setTimeout(res, ms));

chai.should();

const deps = {
  docClient: {
    put: () => {
      return {
        promise: () => {
          return new Promise( async (resolve, reject) => {
            await timeout(500);
            resolve({});
          });
        }
      };
    }
  }
};

const handler = methods(deps);

describe('Save an interaction', function() {
  it('returns a response from enpoint', async () => {
    const response = await handler({
      httpMethod: 'PUT'
    });
    response.statusCode.should.exist;
  });
  it('rejects unsupported methods', async () => {
    const response = await handler({
      httpMethod: 'UPDATE'
    });
    response.statusCode.should.equal(405);
  });
  it('rejects request without all required parameters', async () => {
    const response = await handler({
      httpMethod: 'PUT',
      body: JSON.stringify({
      	application: "vLive",
      	operation: "pause"
      })
    });
    response.statusCode.should.equal(400);
  });
  it('successfully puts an interaction in the database', async () => {
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
    let item = JSON.parse(response.body).item;
    item.ip.should.equal('196.53.96.43');
    item.userAgent.should.equal('PostmanRuntime/7.22.0');
    item.operation.should.equal('pause');
  });
});

describe('Retrieve interactions', function() {
  it('returns a response from enpoint', async () => {
    const response = await handler({
      httpMethod: 'POST'
    });
    response.statusCode.should.exist;
  });
  it('rejects unsupported methods', async () => {
    const response = await handler({
      httpMethod: 'UPDATE'
    });
    response.statusCode.should.equal(405);
  });
  it('rejects request without all required parameters', async () => {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({
        startDate: "2019-01-01",
        endDate: "2019-01-03"
      })
    });
    response.statusCode.should.equal(400);
  });
  it('successfully returns interactions from the database');
});