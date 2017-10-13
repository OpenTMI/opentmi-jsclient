const MongooseQueryClient = require('./mongooseQueryClient');


class QueryBase extends MongooseQueryClient {
  constructor(collection) {
    super();
    this._collection = collection;
  }
  /**
   * Execute query
   */
  _exec() {
    return this._collection._find(this.toString());
  }
}

module.exports = QueryBase;
