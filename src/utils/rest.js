const invariant = require('invariant');
const {notImplemented} = require('./utils');

class RestResource {
  constructor(client, path) {
    this._client = client;
    this._path = path;
    this._notImplemented = notImplemented;
  }
  find(query = undefined) {
    invariant(this._client.isConnected, 'Client should be connected');
    return this._client.get({path: this._path, query: query ? query.toString() : undefined});
  }
  update() {
    return this._notImplemented();
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