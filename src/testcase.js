// 3rd party modules
// application modules
const {Document} = require('./utils');


class Testcase extends Document {
  /**
   * Constructor for Testcase model
   * @param {Transport}transport - Transport object
   * @param {Object}testcaseJson testcase as a plain json
   * @private
   */
  constructor(transport, testcaseJson) {
    super(transport, `/api/v0/testcases`, testcaseJson);
  }

  /**
   * Get result as short string
   * @return {string} returns result as single line
   */
  toString() {
    return `${this.name}: ${this.purpose()} (avg: ${this.duration()}s)`;
  }

  /**
   * Get test case id
   * @return {string} test case id
   */
  tcid() {
    return this.get('tcid');
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
   * Get average execution time
   * @return {Number} test execution duration in seconds
   */
  duration() {
    return this.get('history.durationAvg');
  }

  /**
   * Get or set test case purpose
   * @param {String}purpose purpose of tc
   * @return {Testcase|String} returns purpose or Testcase
   */
  purpose(purpose) {
    return this.getOrSet('other_info.purpose', purpose);
  }
}

module.exports = Testcase;
