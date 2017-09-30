const invariant = require('invariant');
const _ = require('lodash');
const debug = require('debug')('opentmi-client');

class Cluster {
  constructor(client) {
    this._clusters = undefined;
    this._client = client;
  }
  get workers() {
    invariant(this._clusters, 'you should call refresh before workers');
    return _.get(this._clusters, 'workers', undefined);
  }
  get status() {
    invariant(this._clusters, 'you should call refresh before status');
    return _.omit(this._clusters, ['workers']);
  }
  restartWorkers() {
    invariant(this._client.isConnected, 'Client should be connected');
    debug('attempt to restart all workers');
    return this._client
      .post('/api/v0/restart')
      .then((response) => {
        debug('workers restarting...', response.data);
        return response.data;
      }).catch((error) => {
        debug(error);
        throw error;
      });
  }
  refresh() {
    invariant(this._client.isConnected, 'Client should be connected');
    return this._client
      .get('/api/v0/clusters')
      .then((response) => {
        debug(response.data);
        this._clusters = response.data;
      }).catch((error) => {
        debug(error);
        this._clusters = undefined;
        throw error;
      });
  }
}

module.exports = Cluster;
