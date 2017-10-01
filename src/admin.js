const invariant = require('invariant');
const {debug} = require('./utils');

class Admin {
  constructor(client) {
    this._client = client;
  }
  version() {
    invariant(this._client.isConnected, 'Client should be connected');
    debug('request opentmi version');
    return this._client
      .get('/api/v0/version')
      .then(response => response.data);
  }
}

module.exports = Admin;
