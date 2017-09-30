const invariant = require('invariant');
const _ = require('lodash');
const querystring = require('querystring');

class Query {
  constructor() {
    this._query = {q: {}};
  };
  toString() {
    return querystring.stringify(this._query);
  }
  get query() {
    return this._query.q;
  }
  // query types
  distinct() {
    this._query.t = 'distinct';
    return this;
  }
  find() {
    this._query.t = 'find';
    return this;
  }
  findOne() {
    this._query.t = 'findOne';
    return this;
  }
  count() {
    this._query.t = 'count';
    return this;
  }
  aggregate(aggregateFunction) {
    this._query.t = 'aggregate';
    return this;
  }
  mapReduce(mapFunction) {
    this._query.t = 'mapReduce';
    return this;
  }
  //
  populate(fields) {
    this._query.p = fields;
    return this;
  }
  select(fields) {
    invariant(_.isArray(fields), 'fields should be array');
    this._query.f = fields;
    return this;
  }
  asFlat() {
    this._query.fl = true;
    return this;
  }
  asJson() {
    this._query.fl = false;
    return this;
  }
  limit(limit) {
    invariant(_.isNumber(limit), 'limit should be number');
    this._query['l'] = limit;
    return this;
  }
  skip(skip) {
    invariant(_.isNumber(skip), 'skip should be number');
    this._query['sk'] = skip;
    return this;
  }
  has(something) {
    _.isPlainObject(something, 'something should be plain object');
    _.merge(this.q, something);
    return this;
  }
}

module.exports = Query;
