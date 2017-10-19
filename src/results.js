// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const Result = require('./result');
const {QueryBase, Collection, notImplemented} = require('./utils');

/**
 * @class ResultsQuery
 */
class ResultsQuery extends QueryBase {
  /**
   * Find results which are using hw dut(s)
   * @return {ResultsQuery}
   */
  isHW() {
    return this.has({'exec.dut.type': 'hw'});
  }

  /**
   * Find results by verdict
   * @param {String}verdict
   * @return {ResultsQuery}
   */
  verdict(verdict) {
    invariant(_.isString(verdict), 'verdictr should be a string');
    return this.has({'exec.verdict': verdict});
  }

  /**
   * Find failed test results
   * @return {ResultsQuery}
   */
  isFailed() {
    return this.verdict('fail');
  }

  /**
   * Find pass test results
   * @return {ResultsQuery}
   */
  isPass() {
    return this.verdict('pass');
  }

  /**
   * Find inconclusive results
   * @return {ResultsQuery}
   */
  isInconclusive() {
    return this.verdict(('inconclusive'));
  }

  /**
   * Find results which belong to campaign
   * @param {String}campaign
   * @return {ResultsQuery}
   */
  belongToCampaign(campaign) {
    invariant(_.isString(campaign), 'campaign should be a string');
    return this.has({'campaign.id': campaign});
  }

  /**
   * Find results which belong to job
   * @param {String}job
   * @return {ResultsQuery}
   */
  belongToJob(job) {
    invariant(_.isString(job), 'job should be a string');
    return this.has({'job.id': job});
  }

  /**
   * Find results which note contains text
   * @param {String}str
   * @return {ResultsQuery}
   */
  containsNote(str) {
    invariant(_.isString(str), 'str should be a string');
    return this.has({'exec.note': str});
  }
}

class Results extends Collection {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/results');
    this._notImplemented = notImplemented();
  }

  /**
   * Find Results
   * @return {ResultsQuery}
   */
  find() {
    return new ResultsQuery(this, Result);
  }

  /**
   * Update documents
   * @return {Promise}
   */
  update() {
    return this._notImplemented();
  }
}

module.exports = Results;
