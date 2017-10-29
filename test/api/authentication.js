const assert = require('assert');
const moxios = require('moxios');
const sinon = require('sinon');

const {Transport, Authentication} = require('../../src');

describe('Authentication', function () {
  beforeEach(function () {
    // import and pass your custom axios instance to this method
    moxios.install();
  });

  afterEach(function () {
    // import and pass your custom axios instance to this method
    moxios.uninstall();
  });

  it('can login', function (done) {
    // Match against an exact URL value
    const token = '123';
    moxios.stubRequest('/auth/login', {
      status: 200,
      response: {token}
    });
    const transport = new Transport();
    const auth = new Authentication(transport);

    const onFulfilled = sinon.spy();
    auth.login('email', 'password').then(onFulfilled);
    moxios.wait(function () {
      assert.equal(onFulfilled.getCall(0).args[0], token);
      assert.equal(transport.token, token);
      done();
    });
  });
});
