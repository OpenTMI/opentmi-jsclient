const invariant = require('invariant');
const _ = require('lodash');
const debug = require('debug')('opentmi-client');

class Resource {
  constructor(client) {
    this._client = client;
    this._path = '/api/v0/resources';
  }
  find(query = undefined) {
    invariant(this._client.isConnected, 'Client should be connected');
    return this._client.get({path: this._path, query: query ? query.query : undefined});
  }
}

module.exports = Resource;
