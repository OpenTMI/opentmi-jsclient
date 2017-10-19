const invariant = require('invariant');
const _ = require('lodash');

const Base = require('./base');
const retryUpdate = require('./../retry');


class Document extends Base {
  /**
   * Low level Document object, which handle modifications and storing
   * @param transport
   * @param path
   * @param originalJson
   */
  constructor(transport, path, originalJson) {
    super(transport, path);
    this._idProperty = originalJson.id ? 'id' : '_id';
    invariant(_.isPlainObject(originalJson), 'originalJson should be plain object');
    invariant(_.isString(originalJson[this._idProperty]), 'originalJson should have id');
    this._original = _.cloneDeep(originalJson);
    this._resource = _.cloneDeep(originalJson);
    this._changes = {};
  }

  /**
   * Get resource data as plain json object
   * @return {object}
   */
  toJson() {
    return _.cloneDeep(this._resource);
  }

  /**
   * get changes as json object
   * @return {object}
   */
  getChanges() {
    return _.cloneDeep(this._changes);
  }

  /**
   * returns true when there is changes made by client
   * @return {boolean}
   */
  isDirty() {
    return !_.isEqual(this._original, this._resource);
  }

  /**
   * Save document. If conflicts happen try merge and save again.
   * if there is no retries left or some server side changes causes conflict
   * promise is rejected and reason property tells was it no retries left or merge conflicts.
   * @return {Promise}
   */
  save(retryCount = 2) {
    if (this.isDirty()) {
      const changes = this.getChanges();
      invariant(changes[this._idProperty] !==
        this._original[this._idProperty], `${this._idProperty} is not the same!!`);
      changes.version = this.version;
      return retryUpdate(this._original, changes, this._update.bind(this), retryCount)
        .then(() => this);
    }
    return Promise.reject(new Error('no changes'));
  }

  /**
   * Get resource value by Key.
   * @param {String} key - key can be nested as well like "a.b.c"
   * @return {String|Object} value for the key or undefined if not found
   */
  get(key) {
    return _.get(this._resource, key);
  }

  /**
   * Set value for a key
   * @param {String} key
   * @param {*}value
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
   * @return {number}
   */
  get version() { return this.get('__v'); }

  /**
   * Get resource identity
   * @return {string}
   */
  get id() { return this.get(this._idProperty); }

  /**
   * reload document information from backend.
   * This also revert all client modified data back that is not saved!
   * @return {Promise<Document>}
   */
  refresh() {
    return this._transport
      .get(this._path)
      .then((response) => {
        this._original = _.cloneDeep(response.data);
        this._resource = _.cloneDeep(response.data);
      })
      .then(() => this);
  }

  /**
   * delete this document
   * @return {Promise}
   */
  delete() {
    return this._transport.delete({path: this._path});
  }

  _update(data) {
    return this._transport.put(this._path, data);
  }
}

module.exports = Document;
