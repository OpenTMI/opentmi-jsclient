const invariant = require('invariant');
const Promise = require('bluebird');


/**
 * Schemas object
 */
class Schemas {
  /**
   * Constructor for Schemas controller.
   * Object manage all low level communication and authentication
   * @param {Transport} transport - transport layer for communication
   */
  constructor(transport) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
  }

  /**
   * Get list of available collection names
   * @return {Promise.<array<string>>} list of collections
   */
  collections() {
    return this._transport.get('/api/v0/schemas')
      .then(response => response.data);
  }

  /**
   * Get collection json schema.
   * This can be used for example generate html forms.
   * @param {String}collection collection name
   * @return {Promise.<object>} resolves collection schema as json-schema -format
   */
  schema(collection) {
    return this._transport.get(`/api/v0/schemas/${collection}`)
      .then(response => response.data);
  }

  /**
   * get all schemas
   * @return {Promise.<Object[]>} resolves array of schema objects
   */
  getAllSchemas() {
    return this.collections()
      .then(colls => Promise.each(colls, this.schema.bind(this)));
  }
}

module.exports = Schemas;
