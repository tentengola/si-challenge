'use strict';

const methods = require('../interactions.handler.js').methods;
const chai = require('chai');
const sinon = require('sinon');

chai.should();

const deps = {};

const handler = methods(deps);

describe('Save an interaction', function() {
  it('returns a response from enpoint', async () => {
    let response = await handler({
      httpMethod: 'PUT'
    });
    response.statusCode.should.exist;
  });
  it('successfully puts an interaction in the database');
});

describe('Retrieve interactions', function() {
  it('successfully returns interactions from the database');
});