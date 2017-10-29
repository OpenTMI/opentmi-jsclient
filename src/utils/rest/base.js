const invariant = require('invariant');
const {notImplemented} = require('../utils');

/**
 * @private
 */
class Base {
  /**
   * General base constructor for Rest resources
   * @param {Transport} transport - Transport object<
   * @param {string} path - path for REST API
   */
  constructor(transport, path) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
    this._path = path;
    this._notImplemented = notImplemented;
  }
}

module.exports = Base;
