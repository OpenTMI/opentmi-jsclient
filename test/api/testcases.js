const assert = require('assert');
const moxios = require('moxios');

const {Transport, Testcases, Testcase} = require('../../src');

describe('Testcase', function () {
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
  it('create new testcase', function () {
    const tcJson = {_id: '123', tcid: 'X', __v: 0};
    const tests = new Testcases(transport);
    const test = tests.create();
    assert.equal(test.isNew, true);
    test.overwrite(tcJson);
    assert.equal(test.name, 'X');
    assert.equal(test.tcid(), 'X');
    assert.equal(test.id, '123');
    assert.equal(test.isDirty(), true);
  });
  describe('Testcase', function () {
    it('ok', function () {
      const test = new Testcase(transport);
      assert.ok(test);
    });
    it('ok', function () {
      const resultJson = {
        _id: '123',
        cre: {time: new Date()},
        tcid: 'id',
        history: {durationAvg: 1},
        other_info: {purpose: 'test'}
      };
      const test = new Testcase(transport, resultJson);
      assert.equal(test.tcid(), 'id');
      assert.equal(test.name, 'id');
      assert.equal(test.testcaseId, 'id');
      assert.equal(test.duration(), 1);
      assert.equal(test.purpose(), 'test');
      assert.ok(`${test}`);
    });
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/testcases?', {
        status: 200,
        response: []
      });
      const tests = new Testcases(transport);
      transport.token = 'abc';
      const find = tests.find();
      return find.exec();
    });
    it('apis', function () {
      const tests = new Testcases(transport);
      const find = tests.find()
        .isArchived()
        .tcid('abc')
        .isSkip()
        .type('alpha');
      assert.ok(find);
    });
  });
});
