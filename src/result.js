// 3rd party modules
// application modules
const {Query, RestResource} = require('./utils');

class ResultsQuery extends Query {
}


class Results extends RestResource {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/results');
  }
}

Results.Query = ResultsQuery;

module.exports = Results;
