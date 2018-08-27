const assert = require('assert');
const moxios = require('moxios');

const {Transport, Event, Events} = require('../../src');

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
  it('statics', function () {
    assert.equal(Event.PRIORITIES.length, 8);
  });
  it('constructing with valid json', function () {
    const toBe = {_id: '123', priority: {level: 'alert', facility: 'resource'}, msgid: 'ALLOCATED'};
    const res = new Event(transport, toBe);
    assert.deepEqual(res.toJson(), toBe);
  });
  it('create event from events', function () {
    const events = new Events(transport);
    const res = events.create();
    assert.equal(res.isNew, true);
    assert.equal(typeof res.toString(), 'string');
  });
  it('call setters', function () {
    const res = new Event(transport, {_id: '123'});
    assert.equal(res.isDirty(), false);
    res
      .critical()
      .error()
      .warning()
      .notice()
      .info()
      .debug()
      .alert()
      .facility('resource')
      .id('abc')
      .allocated()
      .released()
      .enterMaintenance()
      .exitMaintenance()
      .created()
      .deleted()
      .flashed()
      .tag('test')
      .msg('hohhoi')
      .allocated();
    assert.equal(res.isDirty(), true);
    const toBe = {
      _id: '123',
      tag: 'test',
      id: 'abc',
      msg: 'hohhoi',
      priority: {level: 'alert', facility: 'resource'},
      msgid: 'ALLOCATED'
    };
    assert.deepEqual(res.toJson(), toBe);
  });
});
