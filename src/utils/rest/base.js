const invariant = require('invariant');
const {notImplemented} = require('../utils');

/**
 * @private
 */
class Base {
  /**
   * General base constructor for Rest resources
   * @param {Transport} transport - Transport object<
   * @param {string} path - path for collection REST API
   */
  constructor(transport, path) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
    this._path = path;
    this._notImplemented = notImplemented;
  }
  docPath(id) {
    return `${this._path}/${id}`;
  }
  colPath() { return this._path; }
  /**
   * set rest path
   * @param {String}path path uri
   * @return {Base} returns this
   */
  setPath(path) {
    this._path = path;
    return this;
  }
}

module.exports = Base;
