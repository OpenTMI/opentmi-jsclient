const invariant = require('invariant');
const _ = require('lodash');
const Promise = require('bluebird');
const debug = require('debug')('opentmi-client');

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
