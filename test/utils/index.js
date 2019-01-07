const Promise = require('bluebird');
const assert = require('assert');
const sinon = require('sinon');
const querystring = require('querystring');

const Query = require('../../src/utils/rest/mongooseQueryClient');
const {retryUpdate, objectMerge, notImplemented, Lock} = require('../../src/utils');

const toUrl = querystring.stringify;


describe('Query', function () {
  let q;
  beforeEach(function () {
    q = new Query();
  });

  it('is empty by default', function () {
    assert.equal(q.toString(), '');
  });
  it('from string', function () {
    q.fromString('t=count&f=name&q={"name":"abc"}');
    assert.equal(q.type, 'count');
    assert.equal(q._query.f, 'name');
    assert.deepEqual(q.query, {name: 'abc'});
  });

  describe('works with query type', function () {
    it('find', function () {
      assert.equal(q.find().toString(), 't=find');
    });
    it('count', function () {
      assert.equal(q.count().toString(), 't=count');
    });
    it('distinct', function () {
      assert.equal(q.distinct().toString(), 't=distinct');
    });
  });
  describe('works with has', function () {
    it('something', function () {
      assert.equal(
        q.has({some: 'thing'})
          .has({are: 'this'})
          .toString(),
        toUrl({q: JSON.stringify({some: 'thing', are: 'this'})})
      );
    });
  });
  describe('works with options', function () {
    it('select', function () {
      assert.equal(q.select(['some', 'thing']).toString(), 'f=some%20thing');
    });
    it('populate', function () {
      assert.equal(q.populate(['some', 'thing']).toString(), 'p=some%20thing');
    });
    it('asFlat', function () {
      assert.equal(q.asFlat().toString(), 'fl=true');
    });
    it('asJson', function () {
      assert.equal(q.asJson().toString(), 'fl=false');
    });
    it('limit', function () {
      assert.equal(q.limit(10).toString(), 'l=10');
    });
    it('skip', function () {
      assert.equal(q.skip(20).toString(), 'sk=20');
    });
  });
});

describe('mergeObject', function () {
  it('success with changes', function () {
    const result = objectMerge({a: 1, b: 0}, {a: 2}, {b: 1});
    assert.deepEqual(result.merged, {a: 2, b: 1});
  });
  it('success with new properties', function () {
    const result = objectMerge({a: 1}, {a: 2}, {b: 1});
    assert.deepEqual(result.merged, {a: 2, b: 1});
  });
  it('success with changes', function () {
    const result = objectMerge({a: 1}, {a: 2}, {b: 1});
    assert.deepEqual(result.merged, {a: 2, b: 1});
  });
  it('conflicts', function () {
    const result = objectMerge({a: 1}, {a: 2}, {a: 3});
    assert.deepEqual(result.conflicts, {a: {a: 2, o: 1, b: 3}});
  });
});

describe('retryUpdate', function () {
  it('if success no needs for update', function () {
    const original = {a: 1};
    const changes = {a: 2};
    const resolveData = {
      response: {status: 200, data: changes}
    };
    const spyUpdateResolves = sinon.spy();
    const spyUpdateRejects = sinon.spy();
    const spyUpdateCalls = sinon.spy();
    const update = (data) => {
      spyUpdateCalls(data);
      return Promise.resolve(resolveData)
        .then(spyUpdateResolves)
        .catch((error) => {
          spyUpdateRejects(error);
          throw error;
        });
    };
    return retryUpdate(original, changes, update).then(() => {
      assert.equal(spyUpdateCalls.callCount, 1);
      assert.equal(spyUpdateResolves.callCount, 1);
      assert.equal(spyUpdateRejects.callCount, 0);
      assert.deepEqual(spyUpdateCalls.getCall(0).args[0], changes);
      assert.deepEqual(spyUpdateResolves.getCall(0).args[0], resolveData);
    });
  });
  it('merge required and success', function () {
    const original = {a: 1, b: 1};
    const changes = {a: 2};
    const resolveData = {
      response: {status: 200, data: {a: 3, b: 2}}
    };
    const rejectData = {
      response: {status: 409, data: {b: 2}}
    };

    const spyUpdateResolves = sinon.spy();
    const spyUpdateRejects = sinon.spy();
    const spyUpdateCalls = sinon.spy();
    const update = (data) => {
      spyUpdateCalls(data);
      if (spyUpdateCalls.callCount === 1) {
        spyUpdateRejects(rejectData);
        return Promise.reject(rejectData);
      }
      spyUpdateResolves(resolveData);
      return Promise.resolve(resolveData);
    };
    return retryUpdate(original, changes, update, 2, 0).then(() => {
      assert.equal(spyUpdateCalls.callCount, 2);
      assert.equal(spyUpdateResolves.callCount, 1);
      assert.equal(spyUpdateRejects.callCount, 1);
    });
  });
  it('merge required but conflicts', function () {
    const original = {a: 1};
    const changes = {a: 2};
    const resolveData = {
      response: {status: 200, data: {}}
    };
    const rejectData = {
      response: {status: 409, data: {a: 3}}
    };

    const spyUpdateResolves = sinon.spy();
    const spyUpdateRejects = sinon.spy();
    const spyUpdateCalls = sinon.spy();
    const update = (data) => {
      spyUpdateCalls(data);
      if (spyUpdateCalls.callCount === 1) {
        spyUpdateRejects(rejectData);
        return Promise.reject(rejectData);
      }
      spyUpdateResolves(resolveData);
      return Promise.resolve(resolveData);
    };
    return retryUpdate(original, changes, update, 2, 0).catch((error) => {
      assert.equal(spyUpdateCalls.callCount, 1);
      assert.equal(spyUpdateResolves.callCount, 0);
      assert.equal(spyUpdateRejects.callCount, 1);
      assert.deepEqual(error, rejectData);
    });
  });
});

describe('utils', function () {
  it('is empty by default', function () {
    return notImplemented()
      .then(() => {
        throw new Error('Should not pass');
      })
      .catch(() => {});
  });
});

describe('Lock', function () {
  it('resolves', function () {
    const locker = new Lock();
    return locker.withLock(() => Promise.resolve(1))
      .then((value) => {
        assert.equal(value, 1);
        assert.equal(locker.isResolved(), true);
      });
  });
  it('waits', function () {
    const locker = new Lock();
    let resolver;
    const pending1 = Promise.using(locker.obtainLock(), () => new Promise((resolve) => {
      resolver = resolve;
    }));
    const pending2 = Promise.using(locker.obtainLock(), () => Promise.resolve(2));
    const validator = Promise.delay(10)
      .then(() => {
        assert.equal(pending1.isPending(), true);
        assert.equal(pending2.isPending(), true);
        resolver(1);
      });
    return Promise.all([pending1, pending2, validator])
      .then(([first, second]) => {
        assert.equal(first, 1);
        assert.equal(second, 2);
      });
  });
});
