const invariant = require('invariant');
const _ = require('lodash');
const querystring = require('querystring');

/** Query class
 * Is pair for {@link https://github.com/jupe/mongoose-query|mongoose-query} -library which allows to
 * manage DB queries based on rest query parameters
 */
class MongooseQueryClient {
  /**
   * Query Constructor
   */
  constructor() {
    /**
     * Raw query object which can be converted as url parameter
     * @type {{q: {}}}
     * @private
     */
    this._query = {q: {}};
  }

  /**
   * parse query from string
   * @param {String}str
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
   * @return {MongooseQueryClient._query.q|{}}
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
   * @return {MongooseQueryClient}
   */
  find() {
    this._query.t = 'find';
    return this;
  }

  /**
   * Getter for query type. default: find
   * @return {String} - query type
   */
  get queryType() {
    return _.get(this._query, 't', 'find');
  }

  /**
   * do distinct query
   * @return {MongooseQueryClient}
   */
  distinct() {
    this._query.t = 'distinct';
    return this;
  }

  /**
   * fetch only first match document
   * @return {MongooseQueryClient}
   */
  findOne() {
    this._query.t = 'findOne';
    return this;
  }

  /**
   * get just count of match document
   * @return {MongooseQueryClient}
   */
  count() {
    this._query.t = 'count';
    return this;
  }

  /**
   * aggregate query
   * @return {MongooseQueryClient}
   */
  aggregate() {
    this._query.t = 'aggregate';
    return this;
  }

  /**
   * mapReduce
   * @param mapFunction
   * @return {MongooseQueryClient}
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
   * @param {array<string>|String|Object} fields
   * @return {MongooseQueryClient}
   */
  populate(fields) {
    invariant(_.isArray(fields) || _.isString(fields) || _.isPlainObject(fields), 'fields should be string, array or plain object');
    if (_.isString(fields)) {
      fields = [fields];
    }
    if (_.isArray(fields)) {
      let p = _.get(this._query, 'p', '').split(' ');
      p.push(fields)
      this._query.p = _.uniq(p).join(' ');
    } else {
      this._query.p = _.cloneDeep(fields);
    }
    return this;
  }

  /**
   * Select fields
   * @param {array<String>} fields to be fetch, e.g. ['name']
   * @return {MongooseQueryClient}
   */
  select(fields) {
    invariant(_.isArray(fields), 'fields should be array');
    this._query.f = _.uniq(fields).join(' ');
    return this;
  }

  /**
   * Result as a flat.
   * e.g. {"a.b": "b"}
   * @return {MongooseQueryClient}
   */
  asFlat() {
    this._query.fl = true;
    return this;
  }

  /**
   * Result as a json
   * e.g. {"a": {"b": "b"}}
   * @return {MongooseQueryClient}
   */
  asJson() {
    this._query.fl = false;
    return this;
  }

  /**
   * limit results
   * @param {number} limit - maximum number of results to be fetched
   * @return {MongooseQueryClient}
   */
  limit(limit) {
    invariant(_.isNumber(limit), 'limit should be number');
    this._query.l = limit;
    return this;
  }

  /**
   * Skip number of results
   * @param {number} skip - number of document to be skip
   * @return {MongooseQueryClient}
   */
  skip(skip) {
    invariant(_.isNumber(skip), 'skip should be number');
    this._query.sk = skip;
    return this;
  }

  /**
   * Document has "something", e.g. {name: "jussi"}
   * @param {object} something object to be included in query
   * @return {MongooseQueryClient}
   */
  has(something) {
    _.isPlainObject(something, 'something should be plain object');
    _.merge(this._query.q, something);
    return this;
  }
}

module.exports = MongooseQueryClient;
