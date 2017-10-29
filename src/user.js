/** @module Users */
// 3rd party modules
const _ = require('lodash');
const Promise = require('bluebird');

// application modules
const {Document} = require('./utils');
const Group = require('./group');
const Loans = require('./loans');


class User extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   */
  constructor(transport, userJson) {
    super(transport, `/api/v0/users/${userJson._id}`, userJson);
  }

  /**
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.name}`;
  }

  /**
   * Get user name
   * @return {String}
   */
  get name() { return this.get('name'); }
  /**
   * Get or set email address
   * @param {String}email
   * @return {User|string}
   */
  email(email) { return this.getOrSet('email', email); }

  /**
   * Get user owned apikeys
   * @return {String|Object}
   */
  apikeys() {
    return this.get('apikeys');
  }

  /**
   * Get last visited date
   * @return {Date}
   */
  lastVisited() {
    return new Date(this.get('lastVisited'));
  }

  /**
   * Get user registeration date
   * @return {Date}
   */
  registered() {
    return new Date(this.get('registered'));
  }

  /**
   * Get user groups
   * @return {Promise<Array<Group>>}
   */
  groups() {
    let promises = _.map(this.get('groups'),
      group => Group.fromId(this._transport, group));
    return Promise.all(promises);
  }

  /**
   * Check if user belong to admin group
   * @return {Promise<boolean>}
   */
  isAdmin() {
    return this._isNotImplemented('is admin is not implemented');
  }
  /**
   * Resolve user loans
   * @return {Promise<[Loan]>}
   */
  myLoans() {
    return Loans.forUser(this, this._transport);
  }
}

module.exports = User;
