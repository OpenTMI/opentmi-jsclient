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
  describe('modify', function () {
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
    it('apis', function () {
      const resourceJson = {_id: '123', name: 'X', __v: 0};
      const res = new Resource(transport, resourceJson);
      res.name('Y')
        .type('hw')
        .status.value('available')
        .status.note('hups')
        .status.availability('sure')
        .usage.type('aa')
        .usage.group('group1')
        .location.site('oulu')
        .location.country('finland')
        .location.city('oulu')
        .location.postcode('1234')
        .location.address('street')
        .location.room('a')
        .location.subRoom('b')
        .location.geo(123)
        .location.rack('r1')
        .location.bed('b2')
        .location.slot('s3')
        .item.model('aa')
        .item.ref('1234')
        .network.hostname('local')
        .network.domain('domain')
        .hw.sn('12')
        .hw.imei('34')
        .hw.id('123')
        .hw.firmware.name('q')
        .hw.firmware.version('1')
        .hw.meta_data('a', 'b')
        .parent('123')
        .childs(['987']);
      const changes = {
        name: 'Y',
        type: 'hw',
        status: {
          value: 'available',
          note: 'hups',
          availability: 'sure'
        },
        item: {
          model: 'aa',
          ref: '1234'
        },
        location: {
          site: 'oulu',
          country: 'finland',
          city: 'oulu',
          postcode: '1234',
          address: 'street',
          room: 'a',
          subRoom: 'b',
          rack: 'r1',
          bed: 'b2',
          slot: 's3',
          geo: 123
        },
        usage: {
          type: 'aa',
          group: 'group1'
        },
        network: {
          hostname: 'local',
          domain: 'domain'
        },
        hw: {
          sn: '12',
          imei: '34',
          id: '123',
          firmware: {name: 'q', version: '1'},
          meta_data: {a: 'b'}
        },
        parent: '123',
        childs: ['987']
      };
      assert.deepEqual(res.getChanges(), changes);
      assert.equal(res.isDirty(), true);
    });
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/resources', {
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
        .itemModel('abc')
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
