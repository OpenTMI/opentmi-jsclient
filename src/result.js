// 3rd party modules
// application modules
const {Document} = require('./utils');


class Result extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport}transport - Transport object
   * @private
   */
  constructor(transport, resultJson) {
    super(transport, `/api/v0/results/${resultJson._id}`, resultJson);
  }

  /**
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.time()}: ${this.name} - ${this.verdict()}`;
  }

  /**
   * Get resource name or set it
   * @return {string}
   */
  tcid() {
    return this.get('tcid');
  }
  get name() { return this.tcid(); }
  get testcaseId() { return this.tcid(); }

  /**
   * Get result verdict
   * @return {String}
   */
  verdict() {
    return this.get('exec.verdict');
  }

  /**
   * Get result creation time
   */
  time() {
    return this.get('cre.time');
  }

  /**
   * Get execution duration
   * @return {*}
   */
  duration() {
    return this.get('exec.duration');
  }
}

module.exports = Result;
