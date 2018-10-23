const {expect} = require('chai');
const moxios = require('moxios');

const {Transport, Admin} = require('../../src');

describe('Admin', function () {
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
  it('version', function () {
    const version = '123';
    moxios.stubRequest('/api/v0/version', {
      status: 200,
      response: {version}
    });
    transport.token = '123';
    const admin = new Admin(transport);
    return admin.version()
      .then((data) => {
        expect(data).to.be.deep.equal({version});
      });
  });
  describe('upgrade', function () {
    it('without reload', function () {
      const version = '123';
      moxios.stubRequest('/api/v0/version', {
        status: 200,
        method: 'POST',
        response: {version}
      });
      transport.token = '123';
      const admin = new Admin(transport);
      return admin.upgrade('123', false);
    });
    it('and reload', function () {
      const version = '123';
      moxios.stubRequest('/api/v0/version', {
        status: 200,
        method: 'POST',
        response: {version}
      });
      moxios.stubRequest('/api/v0/restart', {
        status: 200,
        method: 'POST'
      });
      transport.token = '123';
      const admin = new Admin(transport);
      return admin.upgrade('123', true);
    });
  });
});
