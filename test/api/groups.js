const assert = require('assert');
const moxios = require('moxios');

const {Transport, Groups, Group} = require('../../src');

describe('Groups', function () {
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
    const group = new Groups(transport);
    assert.ok(group);
  });
  it('update is not implemented', function () {
    const group = new Groups(transport);
    return group.update()
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  describe('Group', function () {
    it('basics', function () {
      const group = new Group(transport, {_id: '123', name: 'admin'});
      assert.equal(group.isAdmin(), true);
      assert.equal(`${group}`, 'admin');
    });
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/groups?', {
        status: 200,
        response: []
      });
      const groups = new Groups(transport);
      transport.token = 'abc';
      const find = groups.find();
      return find.exec();
    });
    it('apis', function () {
      const groups = new Groups(transport);
      const find = groups.find().name('me');
      assert.ok(find);
    });
  });
});
