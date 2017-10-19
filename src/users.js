// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');


// application modules
const User = require('./user');
const {QueryBase, Collection, notImplemented} = require('./utils');

/**
 * @class UsersQuery
 */
class UsersQuery extends QueryBase {
  /* Find users by id
   * @param {string} type
   * @return {Query}
   */
  id(id) {
    invariant(_.isString(id), 'id should be a string');
    return this.has({_id: id});
  }
}


class Users extends Collection {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/users');
    this._notImplemented = notImplemented;
  }

  /**
   * Find Users
   * @return {UsersQuery}
   */
  find() {
    return new UsersQuery(this, User);
  }

  whoami() {
    return this._transport
      .get('/auth/me')
      .then(response => new User(this._transport, response.data));
  }

  static WHOAMI(transport) {
    const users = new Users(transport);
    return users.whoami();
  }

  /**
   * Update documents
   * @return {*}
   */
  update() {
    return this._notImplemented();
  }
}

module.exports = Users;
