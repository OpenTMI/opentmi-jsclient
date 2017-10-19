// 3rd party modules
const Promise = require('bluebird');
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const MongooseQueryClient = require('./mongooseQueryClient');

/**
 * @extends MongooseQueryClient
 */
class QueryBase extends MongooseQueryClient {
  /**
   *
   * @param {Collection}collection
   * @param {Document}baseClass
   */
  constructor(collection, baseClass) {
    super();
    this._collection = collection;
    this._baseClass = baseClass;
  }
  /**
   * Execute query based on previous selected options
   * @param {Boolean} plain - do not convert to classes
   * @return {Promise} - list of objects when 'find' (default) or plain json.
   */
  exec(plain = false) {
    invariant(_.isBoolean(plain), 'plain should be boolean');
    return this._exec()
      .then((data) => {
        if (!plain && this.queryType === 'find') {
          return Promise.map(data, json => new this._baseClass(this._collection._transport, json));
        }
        return data;
      });
  }

  _exec() {
    return this._collection._find(this.toString());
  }
}

module.exports = QueryBase;
