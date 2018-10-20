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

  describe('login with username and password', function () {
    it('success', function (done) {
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
    it('no access', function (done) {
      // Match against an exact URL value
      const response = 'error';
      moxios.stubRequest('/auth/login', {
        status: 401,
        response
      });
      const transport = new Transport();
      const auth = new Authentication(transport);

      const onFailed = sinon.spy();
      auth.login('email', 'password').catch(onFailed);
      moxios.wait(function () {
        assert.equal(onFailed.getCall(0).args[0].response.data, response);
        assert.equal(transport.token, undefined);
        done();
      });
    });
  });

  describe('login with 3rd party access token', function () {

    it('success', function (done) {
      // Match against an exact URL value
      const token = 'mytoken';
      moxios.stubRequest('/auth/myservice/token', {
        status: 200,
        response: {token}
      });
      const transport = new Transport();
      const auth = new Authentication(transport);

      const onFulfilled = sinon.spy();
      auth.loginWithToken('mytoken', 'myservice').then(onFulfilled);
      moxios.wait(function () {
        assert.equal(onFulfilled.getCall(0).args[0], token);
        assert.equal(transport.token, token);
        done();
      });
    });
    it('fails', function (done) {
      // Match against an exact URL value
      const response = 'error';
      moxios.stubRequest('/auth/myservice/token', {
        status: 401,
        response
      });
      const transport = new Transport();
      const auth = new Authentication(transport);

      const onFailed = sinon.spy();
      auth.loginWithToken('mytoken', 'myservice').catch(onFailed);
      moxios.wait(function () {
        assert.equal(onFailed.getCall(0).args[0].response.data, response);
        assert.equal(transport.token, undefined);
        done();
      });
    });
  });
});
