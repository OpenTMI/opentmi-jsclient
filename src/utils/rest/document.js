const invariant = require('invariant');
const _ = require('lodash');

const debug = require('../debug');
const Base = require('./base');
const retryUpdate = require('./../retry');

/**
 * Low level Document object, which handle modifications and storing
 */
class Document extends Base {
  /**
   * Document constructor
   * @param {Transport}transport transport layer
   * @param {String}path Document rest uri
   * @param {Object}originalJson document data as plain json
   */
  constructor(transport, path, originalJson) {
    super(transport, path);
    this._idProperty = '_id';
    if (_.isUndefined(originalJson)) {
      debug('Construct new document');
       // new object
      this._original = undefined;
      this._resource = {};
    } else {
      debug('Construct existing document');
      // old object
      invariant(_.isPlainObject(originalJson), 'originalJson should be plain object');
      invariant(_.isString(originalJson[this._idProperty]), 'originalJson should have id');
      this._original = _.cloneDeep(originalJson);
      this._resource = _.cloneDeep(originalJson);
    }
    this._changes = {};
    this._update = this._update.bind(this);
  }

  get isNew() {
    return _.isUndefined(this._original);
  }

  /**
   * Get resource data as plain json object
   * @return {object} returns document as plain json
   */
  toJson() {
    return _.cloneDeep(this._resource);
  }

  /**
   * get changes as json object
   * @return {object} returns changes as plain json
   */
  getChanges() {
    return _.cloneDeep(this._changes);
  }

  /**
   * returns true when there is changes made by client
   * @return {boolean} check if document is "dirty" - has local changes
   */
  isDirty() {
    return !_.isEqual(this._original, this._resource);
  }

  /**
   * Save document. If conflicts happen try merge and save again.
   * if there is no retries left or some server side changes causes conflict
   * promise is rejected and reason property tells was it no retries left or merge conflicts.
   * @param {Number}retryCount count how many times we try to save.
   * @return {Promise} Resolves Document itself when save success
   */
  save(retryCount = 2) {
    invariant(_.isNumber(retryCount), 'retryCount should be a number');
    if (this.isDirty()) {
      debug('Saving existing document');
      const changes = this.getChanges();
      invariant(changes[this._idProperty] !==
        this._original[this._idProperty], `${this._idProperty} is not the same!!`);
      changes.version = this.version;
      return retryUpdate(this._original, changes, this._update, retryCount)
        .then(() => this);
    }
    return Promise.reject(new Error('no changes'));
  }

  /**
   * Get resource value by Key.
   * @param {String} key - key can be nested as well like "a.b.c"
   * @param {String} defaultValue optional default value
   * @return {String|Object} value for the key or undefined if not found
   */
  get(key, defaultValue = undefined) {
    return _.get(this._resource, key, defaultValue);
  }

  /**
   * Set value for a key
   * @param {String} key key for update
   * @param {*}value value for update
   * @return {Document} returns this
   */
  set(key, value) {
    this._dirty = true;
    if (_.isNull(value)) {
      _.unset(this._resource, key);
      this._changes[key] = null;
    } else {
      _.set(this._resource, key, value);
      _.set(this._changes, key, value);
    }
    return this;
  }

  /**
   * get or set value to resource.
   * @example
   * // returns Document
   * doc.set('key1', 'myvalue')
   *    .set('key2', 'val')
   * @param {string} key - key to be get/set
   * @param {*} value - undefined (default) to get value by key, null to remove key, others to set value
   * @return {Resource|value} value or whole object when set
   */
  getOrSet(key, value = undefined) {
    if (_.isUndefined(value)) {
      return this.get(key);
    }
    return this.set(key, value);
  }
  /**
   * getter for Document version
   * @return {number} returns document version number
   */
  get version() { return this.get('__v'); }

  /**
   * Get resource identity
   * @return {string} returns document id
   */
  get id() { return this.get(this._idProperty); }

  get path() { return this.docPath(this.id); }

  /**
   * reload document information from backend.
   * This also revert all client modified data back that is not saved!
   * @return {Promise<Document>} resolves Document
   */
  refresh() {
    return this._transport
      .get(this.path)
      .then((response) => {
        this._original = _.cloneDeep(response.data);
        this._resource = _.cloneDeep(response.data);
      })
      .then(() => this);
  }

  /**
   * delete this document
   * @return {Promise} Resolves when operation success
   */
  delete() {
    return this._transport.delete({path: this.path});
  }

  /**
   * Update document
   * @param {Object}data data to be updated
   * @returns {Promise} resolves when opration success
   */
  _update(data) {
    return this._transport.put(this.path, data);
  }
}

/**
 * Mix Document object so that it is
 * possible to store new document
 * @param {Document}base Document object
 * @return {NewDocument} returns mixed Document object
 * @constructor
 */
function IsNewDocument(base) {
  class NewDocument extends base {
    /**
     * Wrap save method for first save
     * @return {Promise.<Document>} resolves Document
     */
    save() {
      // wrap save only at the beginning.
      // when document is stored first time succesfully
      // wrap original save function.
      debug('Saving new document');
      return this._create(this._resource)
        .then(response => {
          this._original = _.cloneDeep(response.data);
          this._resource = _.cloneDeep(response.data);
        })
        .then(() => {
          this.save = super.save; // continue old behavior
          this._create = undefined; //no need create -api anymore
          return this;
        });
    }
    /**
     * create document
     * @param {Object}data document data to be stored
     * @returns {Promise} resolves when opration success
     */
    _create(data) {
      return this._transport.post(this.colPath(), data);
    }
  }
  return NewDocument;
}
Document.IsNewDocument = IsNewDocument;
module.exports = Document;
