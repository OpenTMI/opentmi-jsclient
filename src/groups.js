// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');


// application modules
const Group = require('./group');
const {QueryBase, Collection, notImplemented} = require('./utils');

/**
 * @class GroupsQuery
 * @extends QueryBase
 */
class GroupsQuery extends QueryBase {
  /* Find group by name
   * @param {string} name
   * @return {Query}
   */
  name(name) {
    invariant(_.isString(name), 'name should be a string');
    return this.has({name});
  }
}

/**
 * @extends Collection
 */
class Groups extends Collection {
  /**
   * Constructor for Groups model
   * @param {Transport} transport - transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/groups');
    this._notImplemented = notImplemented;
  }

  /**
   * Find groups
   * @return {GroupsQuery} Returns query object to find Groups
   */
  find() {
    return new GroupsQuery(this, Group);
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented('Groups update is not implemented');
  }
}

module.exports = Groups;
