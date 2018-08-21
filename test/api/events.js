const assert = require('assert');
const moxios = require('moxios');

const {Transport, Event} = require('../../src');

describe('Event', function () {
  let transport;
  beforeEach(function () {
    // import and pass your custom axios instance to this method
    moxios.install();
    transport = new Transport();
    moxios.stubRequest('/api/v0/events', {
      status: 200,
      response: {}
    });
  });

  afterEach(function () {
    // import and pass your custom axios instance to this method
    moxios.uninstall();
  });
  it('constructing with valid json', function () {
    const toBe = {_id: '123', priority: {level: 'alert', facility: 'resource'}, msgid: 'ALLOCATED'};
    const res = new Event(transport, toBe);
    assert.deepEqual(res.toJson(), toBe);
  });
  it('call setters', function () {
    const res = new Event(transport, {_id: '123'});
    assert.equal(res.isDirty(), false);
    res
      .alert()
      .facility('resource')
      .allocated();
    assert.equal(res.isDirty(), true);
    const toBe = {_id: '123', priority: {level: 'alert', facility: 'resource'}, msgid: 'ALLOCATED'};
    assert.deepEqual(res.toJson(), toBe);
  });
});
