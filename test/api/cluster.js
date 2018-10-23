const {expect} = require('chai');
const moxios = require('moxios');

const {Transport, Cluster} = require('../../src');

describe('Cluster', function () {
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
    const cluster = new Cluster(transport);
    expect(cluster).to.be.ok;
  });
  it('data require refresh', function () {
    moxios.stubRequest('/api/v0/clusters', {
      status: 200,
      response: 'ok'
    });
    const cluster = new Cluster(transport);
    expect(() => cluster.data).to.throw(Error);
    return cluster.refresh()
      .then(() => {
        expect(cluster.data).to.be.equal('ok');
      })
  });
  it('refresh rejection', function () {
    moxios.stubRequest('/api/v0/clusters', {
      status: 500,
      response: 'oh'
    });
    const cluster = new Cluster(transport);
    return cluster.refresh()
      .reflect()
      .then((promise) => {
        expect(promise.isRejected()).to.be.true;
      });
  });
  it('status and workers api', function () {
    moxios.stubRequest('/api/v0/clusters', {
      status: 200,
      response: {workers: ['a'], a: 1}
    });
    const cluster = new Cluster(transport);
    return cluster.refresh()
      .then(() => {
        expect(cluster.status).to.be.deep.equal({a: 1});
        expect(cluster.workers).to.be.deep.equal(['a']);
      })
  });
  it('restartWorkers', function () {
    moxios.stubRequest('/api/v0/restart', {
      status: 200,
      response: 'ok'
    });
    transport.token = '123';
    const cluster = new Cluster(transport);
    return cluster.restartWorkers();
  });
  it('restartWorkers throws', function () {
    moxios.stubRequest('/api/v0/restart', {
      status: 500,
      response: 'oh'
    });
    transport.token = '123';
    const cluster = new Cluster(transport);
    return cluster.restartWorkers()
      .reflect()
      .then((promise) => {
        expect(promise.isRejected()).to.be.true;
      });
  });
});
