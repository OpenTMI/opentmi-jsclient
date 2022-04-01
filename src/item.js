// application modules
const {Document} = require('./utils');


class Item extends Document {
  /**
   * Manage single resource
   * @param {Transport} transport - transport layer
   * @param {object} resourceJson - plain json object
   */
  constructor(transport, resourceJson) {
    super(transport, '/api/v0/items', resourceJson);
  }

  /**
   * Get resource info as short string
   * @return {string} returns single line about item
   */
  toString() {
    return `${this.category()}: ${this.manufacturer() ? this.manufacturer() : ''} - ${this.name()}`;
  }

  /**
   * Get item name or set it
   * @param {String}value new name
   * @return {Item|string} returns item name or Item
   */
  name(value) { return this.getOrSet('name', value); }

  /**
   * Get category or set it
   * @param {String}value new category
   * @returns {Item|String} return category or Item when update new value
   */
  category(value) {
    return this.getOrSet('category', value);
  }

  /**
   * Get manufacturer or set it
   * @param {String}name - manufacturer name
   * @return {Item|String} return manufactorer or Item
   */
  manufacturer(name) {
    return this.getOrSet('manufacturer.name', name);
  }

  /**
   * Get item image as buffer
   * @return {Promise<buffer>} image buffer
   */
  getImage() {
    return this._transport.get(`${this.path}/image`)
      .then(response => response.data);
  }

  barcode(value) { return this.getOrSet('barcode', value); }

  imageSrc(value) { return this.getOrSet('image_src', value); }

  description(value) { return this.getOrSet('text_description', value); }

  reference(value) { return this.getOrSet('external_reference', value); }

  inStock(value) { return this.getOrSet('in_stock', value); }

  available(value) { return this.getOrSet('available', value); }

  uniqueResources(value) { return this.getOrSet('unique_resources', value); }
}

module.exports = Item;
