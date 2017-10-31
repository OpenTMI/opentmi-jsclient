// 3rd party modules
// application modules
const {Document} = require('./utils');


class Result extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport}transport - Transport object
   * @param {Object}resultJson result as a plain json
   * @private
   */
  constructor(transport, resultJson) {
    super(transport, `/api/v0/results`, resultJson);
  }

  /**
   * Get result as short string
   * @return {string} returns result as single line
   */
  toString() {
    return `${this.time()}: ${this.name} - ${this.verdict()}`;
  }

  /**
   * Get test case id
   * @return {string} test case id
   */
  tcid(value) {
    return this.getOrSet('tcid', value);
  }

  /**
   * Get test case id
   */
  get name() { return this.tcid(); }
  /**
   * Get test case id
   */
  get testcaseId() { return this.tcid(); }

  /**
   * Get result verdict
   * @return {String} returns test verdict
   */
  verdict(value) {
    return this.getOrSet('exec.verdict', value);
  }

  /**
   * Get result creation time
   * @returns {Date} result creation time
   */
  time() {
    return this.get('cre.time');
  }

  /**
   * Get execution duration
   * @return {Number} test execution duration
   */
  duration() {
    return this.get('exec.duration');
  }
}

module.exports = Result;
