const invariant = require('invariant');
const {notImplemented} = require('./utils');

class RestResource {
  /**
   * General base constructor for Rest resources
   * @param {Client} client - client object
   * @param {string} path - path for REST API
   */
  constructor(client, path) {
    this._client = client;
    this._path = path;
    this._notImplemented = notImplemented;
  }

  /**
   * Find documents
   * @param {Query} query - optional Query object
   * @return {Promise}
   */
  find(query = undefined) {
    invariant(this._client.isConnected, 'Client should be connected');
    return this._client.get({path: this._path, query: query ? query.toString() : undefined});
  }
  update(data, query = undefined) {
    return this._client.get({
      path: this._path,
      query: query ? query.toString() : undefined,
      data
    });
  }
  get() {
    return this._notImplemented();
  }
  delete() {
    return this._notImplemented();
  }
  patch() {
    return this._notImplemented();
  }
}

module.exports = RestResource;
