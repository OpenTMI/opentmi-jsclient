const assert = require('assert');
const moxios = require('moxios');

const {Transport, Schemas} = require('../../src');

describe('Schemas', function () {
  let transport;
  beforeEach(function () {
    // import and pass your custom axios instance to this method
    moxios.install();
    transport = new Transport();
  });

  afterEach(function () {
    // import and pass your custom axios instance to this method
    moxios.uninstall();
  });
  it('is ok', function () {
    const schemas = new Schemas(transport);
    assert.ok(schemas);
  });
  it('get collections', function () {
    moxios.stubRequest('/api/v0/schemas', {
      status: 200,
      response: []
    });
    const schemas = new Schemas(transport);
    return schemas.collections();
  });
  it('get getAllSchemas', function () {
    moxios.stubRequest('/api/v0/schemas', {
      status: 200,
      response: ['abc']
    });
    moxios.stubRequest('/api/v0/schemas/abc', {
      status: 200,
      response: {a: 'b'}
    });
    const schemas = new Schemas(transport);
    return schemas.getAllSchemas()
      .then((data) => {
        assert.deepEqual(data, [{a: 'b'}]);
      });
  });
});
