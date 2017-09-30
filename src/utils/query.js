const invariant = require('invariant');
const _ = require('lodash');

class Query {
  constructor() {
    this._query = {};
  };
  get query() {
    return _.reduce(this._query, (value, key) => `${key}=${value}`, '');
  }
  limit(limit) {
    invariant(_.isNumber(limit), 'limit should be number');
    this._query['l'] = limit;
    return this;
  }
  count(count) {
    invariant(_.isNumber(count), 'count should be number');
    this._query['c'] = count;
    return this;
  }
}

module.exports = Query;
