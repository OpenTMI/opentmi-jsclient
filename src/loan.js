// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');
// application modules
const {Document} = require('./utils');
const Items = require('./items');
const Resources = require('./resources');


/** @class LoanItem */
class LoanItem {
  /**
   * LoanItem constructor
   * @param {Transport}transport transport layer
   * @param {object}data json object
   */
  constructor(transport, data = {}) {
    this._data = data;
    this._transport = transport;
  }
  /**
   * get item as plain json
   * @return {Object} returns loanitem as plain json
   */
  toJson() { return _.cloneDeep(this._data); }
  /**
   * returns loan item as single line
   * @returns {String} loan item details as single line
   */
  toString() { return this._data.item; }
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
  getItem() {
    const items = new Items(this._transport);
    return items.find().id(this._data.item).exec().then(list => list[0]);
  }

  /**
   * Set item
   * @param {Item}item item to add loan iten
   */
  set item(item) {
    this._data.item = item.id;
  }
  /**
   * get resource
   * @return {Promise<Resource>} resolves Resource
   */
  getResource() {
    const rs = new Resources(this._transport);
    return rs.find().id(this._data.resource).exec().then(list => list[0]);
  }

  /**
   * Set resource to loan item
   * @param {Resource}resource unique loan resource
   */
  set resource(resource) {
    this._data.resource = resource.id;
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
   * @param {Item} item object
   * @return {LoanItem} returns Loan
   */
  addItem(item) {
    invariant(_.isObject(item), 'item should be object');
    const items = this.get('loan_items', []);
    items.push(item.toJson());
    this.set('loan_items', items);
    return this;
  }

  /**
   * Resolve loan items
   * @return {LoanItem} returns LoanItems
   */
  loanItems() {
    const items = this.get('loan_items', []);
    return _.map(items, item => new LoanItem(this._transport, item));
  }

  /**
   * create new LoanItem class
   * @return {LoanItem} get LoanItem constructor
   */
  newLoanItem() {
    return new LoanItem(this._transport);
  }
}

module.exports = Loan;
