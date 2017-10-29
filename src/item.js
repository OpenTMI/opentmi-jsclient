// application modules
const {Document} = require('./utils');


class Item extends Document {
  /**
   * Manage single resource
   * @param {Transport} transport - transport layer
   * @param {object} resourceJson - plain json object
   */
  constructor(transport, resourceJson) {
    super(transport, `/api/v0/items/${resourceJson.id}`, resourceJson);
  }

  /**
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.category()}: ${this.manufacturer() ? this.manufacturer() : ''} - ${this.name()}`;
  }

  /**
   * Get item name or set it
   * @param {String}value new name
   * @return {Item|string}
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
   * @params {String}name - manufacturer
   * @return {Item|String}
   */
  manufacturer(name) {
    return this.getOrSet({'manufacturer.name': name});
  }

  /**
   * Get item image as buffer
   * @return {Promise<buffer>} image buffer
   */
  getImage() {
    return this._transport.get(`/api/v0/items/${this.id}/image`)
      .then(response => response.data);
  }
}

module.exports = Item;
