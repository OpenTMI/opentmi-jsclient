// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');


// application modules
const User = require('./user');
const {QueryBase, Collection, notImplemented} = require('./utils');

/**
 * @class UsersQuery
 * @extends QueryBase
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

/**
 * @extends Collection
 */
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
   * @return {UsersQuery} Returns query object to find Users
   */
  find() {
    return new UsersQuery(this, User);
  }

  /**
   * Find out who am I based on login
   * @return {Promise.<User>} resolves User object
   */
  whoami() {
    return this._transport
      .get('/auth/me')
      .then(response => new User(this._transport, response.data));
  }

  /**
   * Find out who am I based on login
   * @param {Transport}transport Transport layer
   * @return {Promise.<User>} resolves User object
   */
  static WHOAMI(transport) {
    const users = new Users(transport);
    return users.whoami();
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented('Users update is not implemented');
  }
}

module.exports = Users;
