const invariant = require('invariant');
const {debug} = require('./utils');

class Admin {
  constructor(transport) {
    this._transport = transport;
  }
  version() {
    invariant(this._transport.isConnected, 'Client should be connected');
    debug('request opentmi version');
    return this._transport.transport
      .get('/api/v0/version')
      .then(response => response.data);
  }
}

module.exports = Admin;
