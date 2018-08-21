// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const Result = require('./result');
const {
  QueryBase, Collection, Document, notImplemented
} = require('./utils');

/**
 * @class ResultsQuery
 */
class ResultsQuery extends QueryBase {
  /**
   * Find results which are using hw dut(s)
   * @return {ResultsQuery} returns this
   */
  isHW() {
    return this.has({'exec.dut.type': 'hw'});
  }

  /**
   * Find results by verdict
   * @param {String}verdict test verdict
   * @return {ResultsQuery} returns this
   */
  verdict(verdict) {
    invariant(_.isString(verdict), 'verdictr should be a string');
    return this.has({'exec.verdict': verdict});
  }

  /**
   * Find failed test results
   * @return {ResultsQuery} returns this
   */
  isFailed() {
    return this.verdict('fail');
  }

  /**
   * Find pass test results
   * @return {ResultsQuery} returns this
   */
  isPass() {
    return this.verdict('pass');
  }

  /**
   * Find inconclusive results
   * @return {ResultsQuery} returns this
   */
  isInconclusive() {
    return this.verdict(('inconclusive'));
  }

  /**
   * Find results which belong to campaign
   * @param {String}campaign Campaign name
   * @return {ResultsQuery} returns this
   */
  belongToCampaign(campaign) {
    invariant(_.isString(campaign), 'campaign should be a string');
    return this.has({'campaign.id': campaign});
  }

  /**
   * Find results which belong to job
   * @param {String}job job name
   * @return {ResultsQuery} returns this
   */
  belongToJob(job) {
    invariant(_.isString(job), 'job should be a string');
    return this.has({'job.id': job});
  }

  /**
   * Find results which note contains text
   * @param {String}str string that contains in note
   * @return {ResultsQuery} returns this
   */
  containsNote(str) {
    invariant(_.isString(str), 'str should be a string');
    return this.has({'exec.note': `/${str}/`});
  }
}

class Results extends Collection {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/results');
    this._notImplemented = notImplemented;
    this._namespace = '/results';
  }

  /**
   * connects to results related sio namespace
   * @returns {Promise} resolves when connected
   */
  connect() {
    return this._transport.connect(this._namespace);
  }

  /**
   * Disconnect results related sio namespace
   * @return {Promise} resolves when disconnected
   */
  disconnect() {
    return this._transport.disconnectNamespace(this._namespace);
  }

  /**
   * Listen results related events
   * @param {String}event event to be listen. Supported events: 'new'
   * @param {Function}callback callback which is called when event received
   * @return {Promise} resolves when start listening
   */
  on(event, callback) {
    if (event === 'new') {
      return this._transport.sio('/results')
        .then((socket) => {
          socket.on('new', (data) => {
            const result = new Result(this._transport, data);
            callback(result);
          });
        });
    }
    return Promise.reject(new Error('Event is not supported'));
  }

  /**
   * Find Results
   * @return {ResultsQuery} returns ResultsQuery object
   * @example
   *  Results.find()
   *    .limit(10)
   *    .exec() // find last 10 results
   */
  find() {
    return new ResultsQuery(this, Result);
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented('results update is not implemented');
  }

  /**
   * Create new Result
   * @return {Result} returns new result
   */
  create() {
    const NewResult = Document.IsNewDocument(Result);
    return new NewResult(this._transport);
  }
}

module.exports = Results;
