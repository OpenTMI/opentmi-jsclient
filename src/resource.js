const invariant = require('invariant');
const _ = require('lodash');
const Query = require('./utils/query');
const RestResource = require('./utils/rest');

class ResourceQuery extends Query {
  type(type) {
    return this.has({type});
  }
  status(status) {
    return this.has({status});
  }
}

class Resources extends RestResource {
  constructor(client) {
    super(client, '/api/v0/resources');
  }
}

Resources.Query = ResourceQuery;

module.exports = Resources;
