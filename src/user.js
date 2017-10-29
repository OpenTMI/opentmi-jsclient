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
   * @param {Object}userJson User data as plain json object
   */
  constructor(transport, userJson) {
    super(transport, `/api/v0/users/${userJson._id}`, userJson);
  }

  /**
   * Get resource info as short string
   * @return {string} user information as single line
   */
  toString() {
    return `${this.name}`;
  }

  /**
   * Get user name
   * @return {String} returns user name
   */
  get name() { return this.get('name'); }

  /**
   * Get or set email address
   * @param {String}email user email address
   * @return {User|string} email address or this when updating
   */
  email(email) {
    return this.getOrSet('email', email);
  }

  /**
   * Get user owned apikeys
   * @return {String|Object} returns apikeys
   */
  apikeys() {
    return this.get('apikeys');
  }

  /**
   * Get last visited date
   * @return {Date} returns last visited as a Date
   */
  lastVisited() {
    return new Date(this.get('lastVisited'));
  }

  /**
   * Get user registeration date
   * @return {Date} returns registered date
   */
  registered() {
    return new Date(this.get('registered'));
  }

  /**
   * Get user groups
   * @return {Promise.<Group[]>} resolves user groups
   */
  groups() {
    const promises = _.map(
      this.get('groups'),
      group => Group.fromId(this._transport, group)
    );
    return Promise.all(promises);
  }

  /**
   * Check if user belong to admin group
   * @return {Promise.<boolean>} not implemented
   */
  isAdmin() {
    return this._isNotImplemented('is admin is not implemented');
  }

  /**
   * Resolve user loans
   * @return {Promise.<Loan[]>} resolves user loans
   */
  myLoans() {
    return Loans.forUser(this, this._transport);
  }
}

module.exports = User;
