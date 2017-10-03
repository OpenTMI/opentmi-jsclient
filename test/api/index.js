const assert = require('assert');
const moxios = require('moxios');
const sinon = require('sinon');

const {Transport, Authentication, Resource} = require('../../src');


describe('Basics', function() {

  describe('Transport', function () {
    beforeEach(function () {
      // import and pass your custom axios instance to this method
      moxios.install()
    });

    afterEach(function () {
      // import and pass your custom axios instance to this method
      moxios.uninstall()
    });

    it('request', function (done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const transport = new Transport();
      transport.request({url: '/route'}).then(onFulfilled);
      moxios.wait(function () {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.url, '/route');
        done()
      });
    });
    it('get', function (done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const transport = new Transport();
      transport.get('/route').then(onFulfilled);
      moxios.wait(function () {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'get');
        done()
      });
    });
    it('post', function (done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const transport = new Transport('');
      transport.post('/route').then(onFulfilled);
      moxios.wait(function () {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'post');
        done()
      });
    });
    it('update', function (done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const transport = new Transport();
      transport.update('/route').then(onFulfilled);
      moxios.wait(function () {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'update');
        done()
      });
    });
    it('delete', function (done) {
      // Match against an exact URL value
      moxios.stubRequest('/route', {
        status: 200,
        response: {}
      });
      let onFulfilled = sinon.spy();
      const transport = new Transport('');
      transport.delete('/route').then(onFulfilled);
      moxios.wait(function () {
        assert.deepEqual(onFulfilled.getCall(0).args[0].data, {});
        assert.equal(onFulfilled.getCall(0).args[0].request.config.method, 'delete');
        done()
      });
    });
  });
  describe('Authentication', function () {
    beforeEach(function () {
      // import and pass your custom axios instance to this method
      moxios.install()
    });

    afterEach(function () {
      // import and pass your custom axios instance to this method
      moxios.uninstall()
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

      let onFulfilled = sinon.spy();
      auth.login("email", "password").then(onFulfilled);
      moxios.wait(function () {
        assert.equal(onFulfilled.getCall(0).args[0], token);
        assert.equal(transport.token, token);
        done()
      });
    });
  });
  describe('Resource', function () {
      let transport;
      beforeEach(function () {
        // import and pass your custom axios instance to this method
        moxios.install();
        transport = new Transport();
      });

      afterEach(function () {
        // import and pass your custom axios instance to this method
        moxios.uninstall()
      });
      it('constructing with valid json', function() {
        const resourceJson = {_id: '123', name: 'X', __v: 0};
        const res = new Resource(transport, resourceJson);
        assert.equal(res.name(), 'X');
        assert.equal(res.id, '123');
        assert.equal(res.isDirty(), false);
        assert.equal(res.toString(), '123: X');
        assert.deepEqual(res.toJson(), resourceJson);
        assert.deepEqual(res.getChanges(), {});
        assert.deepEqual(res.version, 0);
      });
      it('constructing with invalid json', function() {
        const resourceJson = 'invalid';
        assert.throws(() => new Resource(transport, resourceJson), Error);
      });
      it('isDirty if change happen', function() {
        const resourceJson = {_id: '123', name: 'X', __v: 0};
        const res = new Resource(transport, resourceJson);
        res.name('Y');
        assert.deepEqual(res.getChanges(), {name: 'Y'});
        assert.equal(res.isDirty(), true);
      });
      it('possible to change multiple', function() {
        const resourceJson = {_id: '123', name: 'X', __v: 0};
        const res = new Resource(transport, resourceJson);
        assert.equal(res.name('Y').location.site('oulu').name(), 'Y');
        assert.deepEqual(res.getChanges(), {name: 'Y', location: {site: 'oulu'}});
        assert.equal(res.isDirty(), true);
      });
  });
});