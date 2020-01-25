'use strict';

const methods = require('../interactions.handler.js').methods;
const chai = require('chai');
const sinon = require('sinon');

chai.should();

const deps = {};

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
  it('successfully puts an interaction in the database');
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
  it('successfully returns interactions from the database');
});