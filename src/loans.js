/** @module Results */
// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const Loan = require('./loan');
const {
  QueryBase, Collection, notImplemented, beginningOfDay, endOfDay
} = require('./utils');

/**
 * @class ItemsQuery
 */
class LoansQuery extends QueryBase {
  /**
   * Populate loaned items
   */
  loadItems() {
    return this.populate('items.item');
  }
  /**
   * Populate unique resources
   */
  loadResources() {
    return this.populate('items.resource');
  }
  /**
   * Populate loaner (User)
   */
  loadLoaner() {
    return this.populate('loaner');
  }
  /**
   * Find loans by loan date
   * @return {LoansQuery}
   */
  loanDate(date) {
    return this.has({loan_date: {$gte: beginningOfDay(date), $lte: endOfDay(date)}});
  }
  /**
   * Find loans by loaner
   * @param {string}userid
   */
  loaner(userid) {
    return this.has({loaner: userid});
  }
  /**
   * Find loans which contains note
   * @param {string}note
   */
  hasNotes(note) {
    return this.has({notes: `/${note}/`});
  }
}

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
   * @param {User}user
   * @param {Transport}transport
   * @return {Promise<[Loan]>} resolves Loans
   */
  static forUser(user, transport) {
    invariant(_.isObject(user), 'user should be an User object');
    const loans = new Loans(transport);
    return loans.find().loaner(user.id).exec();
  }

  /**
   * Construct Loans query object
   * @return {LoansQuery}
   */
  find() {
    return new LoansQuery(this, Loan);
  }

  /**
   * Update documents
   * @return {Promise}
   */
  update() {
    return this._notImplemented('Loan update is not implemented');
  }
}

module.exports = Loans;
