const invariant = require('invariant');
const {debug} = require('./utils');

class Admin {
  /**
   * Admin operations
   * @param {Transport} transport - transport layer
   */
  constructor(transport) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
  }

  /**
   * Get OpenTMI server version details.
   * @return {Promise} resolves json object
   * e.g. { commitId: <id>, tag: <tag>, version: <pkg-version>, node_modules: {...}..}
   */
  version() {
    invariant(this._transport.isLoggedIn, 'Transport should be connected');
    debug('request opentmi version');
    return this._transport
      .get('/api/v0/version')
      .then(response => response.data);
  }

  /**
   * Update opentmi server which are connected through Transport
   * @param {string} version - tag/commitId to be deployed
   * @return {Promise}
   */
  upgrade(version) {
    invariant(this._transport.isLoggedIn, 'Transport should be connected');
    debug('request opentmi version');
    return this._transport
      .post('/api/v0/version', {version})
      .then(response => response.data);
  }
}

module.exports = Admin;
