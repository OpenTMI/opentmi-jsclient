const assert = require('assert');
const moxios = require('moxios');

const {Transport, Resource, Resources} = require('../../src');

describe('Resource', function () {
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
  it('create new resource', function () {
    const resourceJson = {_id: '123', name: 'X', __v: 0};
    const resources = new Resources(transport);
    const res = resources.create();
    assert.equal(res.isNew, true);
    res.overwrite(resourceJson);
    assert.equal(res.name(), 'X');
    assert.equal(res.id, '123');
    assert.equal(res.isDirty(), true);
  });
  it('resources update', function () {
    const resources = new Resources(transport);
    return resources.update()
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  it('constructing with valid json', function () {
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
  it('constructing with invalid json', function () {
    const resourceJson = 'invalid';
    assert.throws(() => new Resource(transport, resourceJson), Error);
  });
  it('isDirty if change happen', function () {
    const resourceJson = {_id: '123', name: 'X', __v: 0};
    const res = new Resource(transport, resourceJson);
    res.name('Y');
    assert.deepEqual(res.getChanges(), {name: 'Y'});
    assert.equal(res.isDirty(), true);
  });
  it('possible to change multiple', function () {
    const resourceJson = {_id: '123', name: 'X', __v: 0};
    const res = new Resource(transport, resourceJson);
    assert.equal(res.name('Y').location.site('oulu').name(), 'Y');
    assert.deepEqual(res.getChanges(), {name: 'Y', location: {site: 'oulu'}});
    assert.equal(res.isDirty(), true);
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/resources?', {
        status: 200,
        response: []
      });
      const resources = new Resources(transport);
      transport.token = 'abc';
      const find = resources.find();
      return find.exec();
    });
    it('apis', function () {
      const resources = new Resources(transport);
      const find = resources.find()
        .name('abc')
        .id('asd')
        .hwid('abc')
        .hwsn('abc')
        .hasParent()
        .hasParent('abc')
        .hasNoParent()
        .type('x')
        .status('active')
        .usageType('manual')
        .haveTag('test')
        .haveTags(['a', 'b']);
      assert.ok(find);
    });
  });
});
