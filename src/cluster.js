const invariant = require('invariant');
const _ = require('lodash');
// application modules
const {debug} = require('./utils');

/** Class manage OpenTMI clusters
 * Most of these require admin access.
 */
class Cluster {
  /**
   * Constructor
   * @param {Client} client - client object
   */
  constructor(transport) {
    this._clusters = undefined;
    this._transport = transport;
  }
  get workers() {
    invariant(this._clusters, 'you should call refresh before workers');
    return _.get(this._clusters, 'workers', undefined);
  }
  get status() {
    invariant(this._clusters, 'you should call refresh before status');
    return _.omit(this._clusters, ['workers']);
  }

  /**
   * Restart workers. Require admin access.
   */
  restartWorkers() {
    invariant(this._transport.isConnected, 'Client should be connected');
    debug('attempt to restart all workers');
    return this._transport
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
    invariant(this._transport.isConnected, 'Client should be connected');
    return this._transport
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
