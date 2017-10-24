/** @module Results */
// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const Loan = require('./loan');
const {QueryBase, Collection, notImplemented} = require('./utils');

/**
 * @class ItemsQuery
 */
class LoansQuery extends QueryBase {
  /**
   * Find items by loan date
   * @return {LoansQuery}
   */
  loanDate(date) {
    return this.has({'loan_date': {}});
  }

  loaner(userid) {
    return this.has({'loaner': userid});
  }

  hasNotes(note) {
    return this.has({'notes': `/${note}/`});
  }
}

class Loans extends Collection {
  /**
   * Constructor for Loans model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/loans');
    this._notImplemented = notImplemented();
  }

  static forUser(user, transport) {
    // @todo
    const Loans = new Loans(this._transport);
    return Loans.find().id(user.id);
  }

  /**
   * Find Items
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
