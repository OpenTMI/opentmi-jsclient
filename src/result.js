// 3rd party modules
// application modules
const {QueryBase, Collection} = require('./utils');

class Query extends QueryBase {
  isHW() {
    this.has({'exec.dut.type': 'hw'});
  }
}

class Results extends Collection {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/results');
  }

  find() {
    return new Query(this);
  }
}

module.exports = Results;
