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
   * @return {ItemsQuery}
   */
  barcode(barcode) {
    return this.has({barcode: barcode});
  }

  /**
   * Find items by name
   * @return {ItemsQuery}
   */
  name(name) {
    return this.has({name: name});
  }

  /**
   * Find items by availability
   * @param {Number|undefined}available - should be at least 1 or available amount of resources
   * @return {ItemsQuery}
   */
  available(available = undefined) {
    invariant(_.isNumber(available), 'available should be a number');
    if (_.isUndefined(available)) {
      return this.has({available: {$gt: 0}});
    }
    return this.has({available: available});
  }


  /**
   * Find items by category
   * @param {String}category - resource category, allowed values:
   * @return {ItemsQuery}
   */
  category(category) {
    invariant(_.isString(category), 'category should be a string');
    const allowedValues = [
      'accessory',
      'board',
      'component',
      'other'];
    invariant(_.indexOf(allowedValues, category) !== -1, 'should be allowed category');
    return this.has({category: category});
  }

  categoryAccessories() { return this.category('accessory'); }
  categoryBoards() { return this.category('board'); }
  categoryComponents() { return this.category('components'); }
  categoryOthers() { return this.category('other'); }

  /**
   * Find items by manufacturer
   * @params {String}name - manufacturer
   * @return {ItemsQuery}
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
    this._notImplemented = notImplemented();
  }

  /**
   * Find Items
   * @return {ResultsQuery}
   */
  find() {
    return new ItemsQuery(this, Item);
  }

  /**
   * Update documents
   * @return {Promise}
   */
  update() {
    return this._notImplemented('Item update is not implemented');
  }
}

module.exports = Items;
