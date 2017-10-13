const invariant = require('invariant');
const _ = require('lodash');

const Base = require('./base');
const retryUpdate = require('./../retry');


class Document extends Base {
  constructor(transport, path, originalJson) {
    super(transport, path);
    this._idProperty = originalJson.id ? 'id' : '_id';
    invariant(_.isPlainObject(originalJson), 'resourceJson should be plain object');
    invariant(_.isString(originalJson[this._idProperty]), 'resourceJson should have _id');
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
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.id}: ${this.name()}`;
  }

  /**
   * get changes as json object
   * @return {object}
   */
  getChanges() {
    return this._changes;
  }

  /**
   * true when there is changes
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
      return retryUpdate(this._original, changes, this._update.bind(this), retryCount);
    }
    return Promise.reject(new Error('no changes'));
  }


  get(key) {
    return _.get(this._resource, key);
  }
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
   * get or set value to resource
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
   * Data version
   * @return {number}
   */
  get version() { return this.get('__v'); }

  /**
   * Get resource identity
   * @return {string}
   */
  get id() { return this.get(this._idProperty); }

  _update(data) {
    return this._transport.put(this._path, data);
  }

  /**
   * get document(s)
   * @return {Promise}
   */
  refresh() {
    return this._transport
      .get({path: this._path})
      .then((data) => { this._original = data; });
  }

  /**
   * delete document(s)
   * @return {Promise}
   */
  delete() {
    return this._transport.delete({path: this._path});
  }
}

module.exports = Document;
