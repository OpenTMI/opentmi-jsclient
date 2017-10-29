// application modules
const {Document} = require('./utils');
const _ = require('lodash');

class LoanItem {
  constructor(item) {
    this._item = item;
  }
  toJson() { return _.cloneDeep(this._item); }
  toString() { return this._item._id; }
  /**
   * Get return date
   * @return {Date|undefined} Date when loan is returned, otherwise undefined.
   */
  returnDate() {
    return this.get('return_date');
  }
  get item() {
    return new Item(this._item);
  }
  get resource() {
    return new Resource(this._item.resource);
  }
}

class Loan extends Document {
  /**
   * Manage single resource
   * @param {Transport} transport - transport layer
   * @param {object} resourceJson - plain json object
   */
  constructor(transport, resourceJson) {
    super(transport, `/api/v0/loans/${resourceJson.id}`, resourceJson);
  }

  /**
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.loaner()}`;
  }

  /**
   * Get loan date or set it (admin only)
   * @return {Loan|string}
   */
  loanDate(value) { return this.getOrSet('loan_date', value); }

  /**
   * Get loaner or set it (admin only)
   * @return {Loan|string}
   */
  loaner(value) { return this.getOrSet('loaner', value); }

  /**
   * Get notes or set it (admin only)
   * @return {Loan|String}
   */
  notes(value) { return this.getOrSet('notes', value); }

  /**
   * Resolve loan items
   * @return {LoanItem}
   */
  loanItems() {
    return _.map(this.get('loan_items', []), item => new LoanItem(item));
  }
}

module.exports = Loan;
