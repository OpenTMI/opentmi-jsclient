const invariant = require('invariant');
const {notImplemented} = require('./utils');

class RestResource {
  /**
   * General base constructor for Rest resources
   * @param {Transport} transport - Transport object
   * @param {string} path - path for REST API
   */
  constructor(transport, path) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
    this._path = path;
    this._notImplemented = notImplemented;
  }

  /**
   * Find document(s)
   * @param {Query} query - optional Query object
   * @return {Promise}
   */
  find(query = undefined) {
    invariant(this._transport.isLoggedIn, 'Transport should be logged in');
    return this._transport.get({path: this._path, query: query ? query.toString() : undefined});
  }

  /**
   * Update document(s)
   * @param data
   * @param query
   */
  update(data, query = undefined) {
    return this._transport.get({
      path: this._path,
      query: query ? query.toString() : undefined,
      data
    });
  }

  /**
   * get document(s)
   * @return {Promise}
   */
  get() {
    return this._notImplemented();
  }

  /**
   * delete document(s)
   * @return {Promise}
   */
  delete() {
    return this._notImplemented();
  }

  /**
   * patch document(s)
   * @return {Promise}
   */
  patch() {
    return this._notImplemented();
  }
}

module.exports = RestResource;
