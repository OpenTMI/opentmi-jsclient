const {expect} = require('chai');
const moxios = require('moxios');
const sinon = require('sinon');
const _ = require('lodash');

const {Transport} = require('../../src');

class IOClientMock {
  constructor(url, options) {
    this.init = sinon.stub();
    this.init(url, options);
    this.once = sinon.stub();
    this.once.withArgs('connect').callsFake((event, cb) => cb());
    this.on = sinon.stub();
  }
  static IO(...args) {
    return new IOClientMock(...args)
  }
}

describe('Transport', function () {
  beforeEach(function () {
    // import and pass your custom axios instance to this method
    moxios.install();
  });

  afterEach(function () {
    // import and pass your custom axios instance to this method
    moxios.uninstall();
  });

  it('request', function (done) {
    // Match against an exact URL value
    moxios.stubRequest('/route', {
      status: 200,
      response: {}
    });
    const onFulfilled = sinon.spy();
    const transport = new Transport();
    transport.request({url: '/route'}).then(onFulfilled);
    moxios.wait(function () {
      expect(onFulfilled.getCall(0).args[0].data).to.be.deep.equal({});
      expect(onFulfilled.getCall(0).args[0].request.url).deep.equal('/route');
      done();
    });
  });
  it('get', function (done) {
    // Match against an exact URL value
    moxios.stubRequest('/route', {
      status: 200,
      response: {}
    });
    const onFulfilled = sinon.spy();
    const transport = new Transport();
    transport.get('/route').then(onFulfilled);
    moxios.wait(function () {
      expect(onFulfilled.getCall(0).args[0].data).deep.equal({});
      expect(onFulfilled.getCall(0).args[0].request.config.method).equal('get');
      done();
    });
  });
  it('post', function (done) {
    // Match against an exact URL value
    moxios.stubRequest('/route', {
      status: 200,
      response: {}
    });
    const onFulfilled = sinon.spy();
    const transport = new Transport('');
    transport.post('/route').then(onFulfilled);
    moxios.wait(function () {
      expect(onFulfilled.getCall(0).args[0].data).deep.equal({});
      expect(onFulfilled.getCall(0).args[0].request.config.method).equal('post');
      done();
    });
  });
  it('put', function (done) {
    // Match against an exact URL value
    moxios.stubRequest('/route', {
      status: 200,
      response: {}
    });
    const onFulfilled = sinon.spy();
    const transport = new Transport();
    transport.put('/route').then(onFulfilled);
    moxios.wait(function () {
      expect(onFulfilled.getCall(0).args[0].data).deep.equal({});
      expect(onFulfilled.getCall(0).args[0].request.config.method).equal('put');
      done();
    });
  });
  it('delete', function (done) {
    // Match against an exact URL value
    moxios.stubRequest('/route', {
      status: 200,
      response: {}
    });
    const onFulfilled = sinon.spy();
    const transport = new Transport('');
    transport.delete('/route').then(onFulfilled);
    moxios.wait(function () {
      expect(onFulfilled.getCall(0).args[0].data).to.be.deep.equal({});
      expect(onFulfilled.getCall(0).args[0].request.config.method).equal('delete');
      done();
    });
  });
  describe('sio', function () {
    describe('namespaces', function () {
      let transport;
      beforeEach(function () {
        transport = new Transport('localhost', {IO: IOClientMock.IO});
      });
      it('connect to default ns', function () {
        transport.token = '123';
        expect(transport.isConnected).to.be.false;
        return transport.connect()
          .then(() => transport.sio())
          .then((io) => {
            expect(io.init.calledOnceWith('localhost', {query: 'token=123'})).to.be.true;
            expect(transport.isConnected).to.be.true;
          });
      });
      it('invalid namespace is rejected', function () {
        transport.token = '12';
        return transport.connect('invalid')
          .reflect()
          .then((promise) => {
            expect(promise.isRejected()).to.be.true
            expect(transport.isConnected).to.be.false;
          });
      });
      it('connect to custom ns', function () {
        transport.token = '12';
        return transport.connect('/myname')
          .then(() => transport.sio('/myname'))
          .then((io) => {
            expect(io.init.calledOnceWith('localhost/myname', {query: 'token=12'})).to.be.true;
          });
      });
    });
    describe('connection', function () {
      it('listen events', function () {
        const transport = new Transport('localhost', {IO: IOClientMock.IO});
        transport.token = '123';
        return transport.connect()
          .then(() => transport.sio())
          .then((io) => {
            const calls = io.on.getCalls();
            const getCb = (event) => {
              return _.find(calls, c => c.args[0] === event).args[1]
            };
            getCb('error')('error');
            getCb('reconnect')();
            getCb('reconnect_attempt')();
            getCb('reconnecting')(1);
            getCb('reconnect_error')('oh');
            getCb('reconnect_failed')('oh');
            getCb('exit')();
            getCb('pong')(1.1);
            expect(transport.latency).to.be.equal(1.1);
          });
      });
      it('can throw', function () {
        function IO() {
          throw new Error('ohhoh');
        }
        const transport = new Transport('localhost', {IO});
        transport.token = '123';
        return transport.connect()
          .reflect()
          .then((promise) => expect(promise.isRejected()).true);
      })
    })
  });
});
