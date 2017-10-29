// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const Loan = require('./loan');
const {
  QueryBase, Collection, notImplemented,
  beginningOfDay, endOfDay
} = require('./utils');

/**
 * @class ItemsQuery
 * @example
 * Loans.find()
 *  .loadItems() // populate loan items
 *  .loanDate(new Date()) //loaned today
 *  .exec() // do query
 */
class LoansQuery extends QueryBase {
  /**
   * Populate loaned items
   * @returns {LoansQuery} returns LoansQuery
   */
  loadItems() {
    return this.populate('items.item');
  }
  /**
   * Populate unique resources
   * @returns {LoansQuery} returns LoansQuery
   */
  loadResources() {
    return this.populate('items.resource');
  }
  /**
   * Populate loaner (User)
   * @returns {LoansQuery} returns LoansQuery
   */
  loadLoaner() {
    return this.populate('loaner');
  }
  /**
   * Find loans by loan date
   * @param {Date}date date when loan happens
   * @returns {LoansQuery} returns LoansQuery
   */
  loanDate(date) {
    return this.has({loan_date: {$gte: beginningOfDay(date), $lte: endOfDay(date)}});
  }
  /**
   * Find loans by loaner
   * @param {string}userid user id to be find
   * @returns {LoansQuery} returns LoansQuery
   */
  loaner(userid) {
    return this.has({loaner: userid});
  }
  /**
   * Find loans which contains note
   * @param {string}note string that should contains in loan
   * @returns {LoansQuery} returns LoansQuery
   */
  hasNotes(note) {
    return this.has({notes: `/${note}/`});
  }
}

/**
 * Manage Loans
 */
class Loans extends Collection {
  /**
   * Constructor for Loans model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/loans');
    this._notImplemented = notImplemented;
  }

  /**
   * Find loans by user
   * @param {User}user user object
   * @param {Transport}transport transport layer
   * @return {Promise.<Loan[]>} resolves Loans
   */
  static forUser(user, transport) {
    invariant(_.isObject(user), 'user should be an User object');
    const loans = new Loans(transport);
    return loans.find().loaner(user.id).exec();
  }

  /**
   * Construct Loans query object
   * @return {LoansQuery} return loans query
   */
  find() {
    return new LoansQuery(this, Loan);
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented('Loan update is not implemented');
  }
}

module.exports = Loans;
