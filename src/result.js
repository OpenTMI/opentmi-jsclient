// 3rd party modules
// application modules
const {Query, RestResource} = require('./utils');

class ResultsQuery extends Query {
}


class Results extends RestResource {
  /**
   * Constructor for Resources model
   * @param {Client} client - client object
   */
  constructor(client) {
    super(client, '/api/v0/results');
  }
}

Results.Query = ResultsQuery;

module.exports = Results;
