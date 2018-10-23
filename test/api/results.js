const assert = require('assert');
const moxios = require('moxios');

const {Transport, Results, Result} = require('../../src');

describe('Results', function () {
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
  it('create new result', function () {
    const resultJson = {_id: '123', tcid: 'X', __v: 0};
    const results = new Results(transport);
    const result = results.create();
    assert.equal(result.isNew, true);
    result.overwrite(resultJson);
    assert.equal(result.tcid(), 'X');
    assert.equal(result.id, '123');
    assert.equal(result.isDirty(), true);
  });
  it('update is not implemented', function () {
    const results = new Results(transport);
    return results.update()
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  it('listen results when disconnected', function () {
    const results = new Results(transport);
    const callback = () => {};
    return results.on('new', callback)
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  it('remove results listener when disconnected', function () {
    const results = new Results(transport);
    return results.removeListener('new', () => {})
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  it('remove unknown listener', function () {
    const results = new Results(transport);
    return results.removeListener('unknown', () => {})
      .reflect()
      .then((promise) => {
        assert.equal(promise.isRejected(), true);
      });
  });
  describe('Result', function () {
    it('ok', function () {
      const result = new Result(transport);
      assert.ok(result);
    });
    it('ok', function () {
      const resultJson = {
        _id: '123',
        cre: {time: new Date()},
        tcid: 'id',
        exec: {
          verdict: 'pass',
          duration: 123
        }
      };
      const result = new Result(transport, resultJson);
      assert.equal(result.duration(), 123);
      assert.equal(result.tcid(), 'id');
      assert.equal(result.name, 'id');
      assert.equal(result.testcaseId, 'id');
      assert.equal(result.verdict(), 'pass');
      assert.equal(result.time().toString(), resultJson.cre.time.toString());
      assert.ok(`${result}`);
    });
  });
  describe('find', function () {
    it('base', function () {
      moxios.stubRequest('/api/v0/results?', {
        status: 200,
        response: []
      });
      const results = new Results(transport);
      transport.token = 'abc';
      const find = results.find();
      return find.exec();
    });
    it('apis', function () {
      const results = new Results(transport);
      const find = results.find()
        .isFailed()
        .isPass()
        .isInconclusive()
        .belongToCampaign('asd')
        .belongToJob('asd')
        .verdict('pass')
        .isHW()
        .containsNote('hello');
      assert.ok(find);
    });
  });
});
