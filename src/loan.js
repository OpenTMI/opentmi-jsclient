// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');
// application modules
const {Document} = require('./utils');
const Item = require('./item');
const Resource = require('./resource');


/** @class LoanItem */
class LoanItem {
  /**
   * LoanItem constructor
   * @param {Object}item plain object
   */
  constructor(item) {
    this._item = item;
  }
  /**
   * get item as plain json
   * @return {Object} returns loanitem as plain json
   */
  toJson() { return _.cloneDeep(this._item); }
  /**
   * returns loan item as single line
   * @returns {String} loan item details as single line
   */
  toString() { return this._item._id; }
  /**
   * Get return date
   * @return {Date|undefined} Date when loan is returned, otherwise undefined.
   */
  returnDate() {
    return this.get('return_date');
  }
  /**
   * get Item
   * @return {Item} returns Item
   */
  get item() {
    return new Item(this._item);
  }
  /**
   * get resource
   * @return {Resource} returns Resource
   */
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
    super(transport, '/api/v0/loans', resourceJson);
  }

  /**
   * Get loan info as short string
   * @return {string} single line about loan
   */
  toString() {
    return `${this.loaner()}`;
  }

  /**
   * Get loan date or set it (admin only)
   * @param {Date} value optional date when updating
   * @return {Loan|string} returns loan date or Loan
   */
  loanDate(value) { return this.getOrSet('loan_date', value); }

  /**
   * Get loaner or set it (admin only)
   * @param {String}value optoinal loaner id when updating
   * @return {Loan|string} returns loaner id or Loan
   */
  loaner(value) { return this.getOrSet('loaner', value); }

  /**
   * Get notes or set it (admin only)
   * @param {Stirng}value optional notes when updating
   * @return {Loan|String} returns notes or Loan
   */
  notes(value) { return this.getOrSet('notes', value); }

  /**
   * Add loan item
   * @param {object}item item as json
   * @return {Loan} returns Loan
   */
  addItem(item) {
    invariant(_.isPlainObject(item), 'item should be json');
    const items = this.get('loan_items', []);
    items.push(item);
    this.set('loan_items', items);
    return this;
  }

  /**
   * Resolve loan items
   * @return {LoanItem} returns LoanItems
   */
  loanItems() {
    return _.map(this.get('loan_items', []), item => new LoanItem(item));
  }
}

module.exports = Loan;
