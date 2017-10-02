const invariant = require('invariant');
const _ = require('lodash');
const querystring = require('querystring');

/** Query class
 * Is pair for [mongoose-query](https://github.com/jupe/mongoose-query) -library which allows to
 * manage DB queries based on rest query parameters
 */
class Query {
  /**
   * Query Constructor
   */
  constructor() {
    this._query = {q: {}};
  }

  /**
   * parse query from string
   * @param str
   */
  fromString(str) {
    invariant(_.isString(str), 'str should be string');
    this._query = querystring.parse(str);
    if (_.has(this._query, 'q')) {
      this._query.q = JSON.parse(_.get(this._query, 'q'));
    }
  }

  /**
   * Returns query as a url string
   * @return {string}
   */
  toString() {
    const query = _.cloneDeep(this._query);
    if (_.isEmpty(query.q)) delete query.q;
    else query.q = JSON.stringify(query.q);
    return querystring.stringify(query);
  }

  /**
   * Return find -part object from query
   * @return {Query._query.q|{}}
   */
  get query() {
    return this._query.q;
  }

  /**
   * Get query type
   * 'find', 'distinct', ...
   */
  get type() {
    return this._query.t;
  }
  /**
   * do default find query
   * @return {Query}
   */
  find() {
    this._query.t = 'find';
    return this;
  }
  /**
   * do distinct query
   * @return {Query}
   */
  distinct() {
    this._query.t = 'distinct';
    return this;
  }

  /**
   * fetch only first match document
   * @return {Query}
   */
  findOne() {
    this._query.t = 'findOne';
    return this;
  }

  /**
   * get just count of match document
   * @return {Query}
   */
  count() {
    this._query.t = 'count';
    return this;
  }

  /**
   * aggregate query
   * @return {Query}
   */
  aggregate() {
    this._query.t = 'aggregate';
    return this;
  }

  /**
   * mapReduce
   * @param mapFunction
   * @return {Query}
   */
  mapReduce(mapFunction) {
    if (_.isFunction(mapFunction)) {
      this._query.reduce = mapFunction.toString();
    } else if (_.isString(mapFunction)) {
      this._query.reduce = mapFunction;
    } else {
      invariant(false, 'mapFunction should be string or function');
    }
    this._query.t = 'mapReduce';
    return this;
  }

  /**
   * Populate selected fields
   * @param {array<string>} fields
   * @return {Query}
   */
  populate(fields) {
    invariant(_.isArray(fields), 'fields should be array');
    this._query.p = _.uniq(fields).join(' ');
    return this;
  }

  /**
   * Select fields
   * @param {array<String>} fields to be fetch, e.g. ['name']
   * @return {Query}
   */
  select(fields) {
    invariant(_.isArray(fields), 'fields should be array');
    this._query.f = _.uniq(fields).join(' ');
    return this;
  }

  /**
   * Result as a flat.
   * e.g. {"a.b": "b"}
   * @return {Query}
   */
  asFlat() {
    this._query.fl = true;
    return this;
  }

  /**
   * Result as a json
   * e.g. {"a": {"b": "b"}}
   * @return {Query}
   */
  asJson() {
    this._query.fl = false;
    return this;
  }

  /**
   * limit results
   * @param {number} limit - maximum number of results to be fetched
   * @return {Query}
   */
  limit(limit) {
    invariant(_.isNumber(limit), 'limit should be number');
    this._query['l'] = limit;
    return this;
  }

  /**
   * Skip number of results
   * @param {number} skip - number of document to be skip
   * @return {Query}
   */
  skip(skip) {
    invariant(_.isNumber(skip), 'skip should be number');
    this._query['sk'] = skip;
    return this;
  }

  /**
   * Document has "something", e.g. {name: "jussi"}
   * @param {object} something object to be included in query
   * @return {Query}
   */
  has(something) {
    _.isPlainObject(something, 'something should be plain object');
    _.merge(this.query, something);
    return this;
  }
}

module.exports = Query;
