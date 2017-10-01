const assert = require('assert');
const moxios = require('moxios');
const sinon = require('sinon');

const Client = require('../../src/client');


describe('Client', function() {

  describe('Rest', function(){
    beforeEach(function () {
      // import and pass your custom axios instance to this method
      moxios.install()
    });

    afterEach(function () {
      // import and pass your custom axios instance to this method
      moxios.uninstall()
    });

    it('request', function(done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const client = new Client('');
      client.request({url: '/route'}).then(onFulfilled);
      moxios.wait(function() {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.url, '/route');
        done()
      });
    });
    it('get', function(done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const client = new Client('');
      client.get('/route').then(onFulfilled);
      moxios.wait(function() {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'get');
        done()
      });
    });
    it('post', function(done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const client = new Client('');
      client.post('/route').then(onFulfilled);
      moxios.wait(function() {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'post');
        done()
      });
    });
    it('update', function(done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const client = new Client('');
      client.update('/route').then(onFulfilled);
      moxios.wait(function() {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'update');
        done()
      });
    });
    it('delete', function(done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const client = new Client('');
      client.delete('/route').then(onFulfilled);
      moxios.wait(function() {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'delete');
        done()
      });
    });
    it('can login', function (done) {
      // Match against an exact URL value
      const token = '123';
      moxios.stubRequest('/auth/login', {
        status: 200,
        response: {token}
      });
      const client = new Client('');

      let onFulfilled = sinon.spy();
      client.login("email", "password").then(onFulfilled);
      moxios.wait(function () {
        assert.equal(onFulfilled.getCall(0).args[0], token);
        assert.equal(client.token, token);
        done()
      });
    });
  });
});