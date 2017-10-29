const invariant = require('invariant');
const _ = require('lodash');
// application modules
const {debug} = require('./utils');

/** Class to manage OpenTMI clusters.
 * Most of these require admin access.
 *
 *
 */
class Cluster {
  /**
   * Constructor
   * @param {Transport} transport - transport object
   */
  constructor(transport) {
    this._clusters = undefined;
    this._transport = transport;
  }
  get data() {
    invariant(this._clusters, 'you should call refresh() before data');
    return this._clusters;
  }
  get workers() {
    invariant(this._clusters, 'you should call refresh() before workers');
    return _.get(this._clusters, 'workers', undefined);
  }
  get status() {
    invariant(this._clusters, 'you should call refresh() before status');
    return _.omit(this._clusters, ['workers']);
  }

  /**
   * Restart workers. Require admin access.
   * @return {Promise} resolves when workers are resterted
   */
  restartWorkers() {
    invariant(this._transport.isLoggedIn, 'Transport should be logged in as admin');
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
  /**
   * Reload clusters states
   * @returns {undefined} returns nothing
   */
  refresh() {
    // @todo not required yet
    // invariant(this._transport.isLoggedIn, 'Transport should be logged in');
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
