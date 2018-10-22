// 3rd party modules
const _ = require('lodash');
const invariant = require('invariant');

// application modules
const Item = require('./item');
const {QueryBase, Collection, notImplemented} = require('./utils');

/**
 * @class ItemsQuery
 */
class ItemsQuery extends QueryBase {
  /**
   * Find items by barcode
   * @param {String}barcode barcore to be find
   * @return {ItemsQuery} returns this
   */
  barcode(barcode) {
    return this.has({barcode});
  }

  /**
   * Find items by name
   * @param {String}name item name
   * @return {ItemsQuery} returns this
   */
  name(name) {
    return this.has({name});
  }

  /**
   * Find items by availability
   * @param {Number|undefined}available - should be at least 1 or available amount of resources
   * @return {ItemsQuery} returns this
   */
  available(available = undefined) {
    invariant(_.isInteger(available), 'available should be a number');
    if (_.isUndefined(available)) {
      return this.has({available: {$gt: 0}});
    }
    return this.has({available});
  }


  /**
   * Find items by category
   * @param {String}category - resource category, allowed values:
   * 'accessory', 'board', 'component', 'other'
   * @return {ItemsQuery} returns this
   */
  category(category) {
    invariant(_.isString(category), 'category should be a string');
    const allowedValues = [
      'accessory',
      'board',
      'component',
      'other'];
    invariant(allowedValues.indexOf(category) >= -1, 'should be allowed category');
    return this.has({category});
  }
  /**
   * Find only accessories
   * @return {ItemsQuery} return this
   */
  categoryAccessories() { return this.category('accessory'); }
  /**
   * Find only boards
   * @return {ItemsQuery} return this
   */
  categoryBoards() { return this.category('board'); }
  /**
   * Find only components
   * @return {ItemsQuery} return this
   */
  categoryComponents() { return this.category('components'); }
  /**
   * Find only other category resources
   * @return {ItemsQuery} return this
   */
  categoryOthers() { return this.category('other'); }

  /**
   * Find items by manufacturer
   * @param {String}name - manufacturer
   * @return {ItemsQuery} return this
   */
  manufacturer(name) {
    return this.has({'manufacturer.name': name});
  }
}

class Items extends Collection {
  /**
   * Constructor for Items model
   * @param {Transport} transport - Transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/items');
    this._notImplemented = notImplemented;
  }

  /**
   * Find Items
   * @return {ResultsQuery} returns Query object
   */
  find() {
    return new ItemsQuery(this, Item);
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented('Item update is not implemented');
  }
}

module.exports = Items;
