const invariant = require('invariant');
const _ = require('lodash');

const {notImplemented, retry} = require('./utils');

class RestResourceBase {
  /**
   * General base constructor for Rest resources
   * @param {Transport} transport - Transport object<
   * @param {string} path - path for REST API
   */
  constructor(transport, path) {
    invariant(transport, 'transport is mandatory');
    this._transport = transport;
    this._path = path;
    this._notImplemented = notImplemented;
  }
}


class RestResourceList extends RestResourceBase {
  /**
   * Find document(s)
   * @param {Query} query - optional Query object
   * @return {Promise}
   */
  find(query = undefined) {
    invariant(this._transport.isLoggedIn, 'Transport should be logged in');
    return this._transport.get({path: this._path, query: query ? query.toString() : undefined});
  }

  /**
   * Update document(s)
   * @param data
   * @param query
   */
  update(data, query = undefined) {
    return this._transport.put({
      path: this._path,
      query: query ? query.toString() : undefined,
      data
    });
  }

  /**
   * get document(s)
   * @return {Promise}
   */
  get() {
    return this._notImplemented();
  }

  /**
   * delete document(s)
   * @return {Promise}
   */
  delete() {
    return this._notImplemented();
  }

  /**
   * patch document(s)
   * @return {Promise}
   */
  patch() {
    return this._notImplemented();
  }
}

class RestResource extends RestResourceBase {
  constructor(transport, path, originalJson) {
    invariant(_.isPlainObject(originalJson), 'resourceJson should be plain object');
    invariant(_.isString(originalJson._id), 'resourceJson should have _id');
    super(transport, path);
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
      invariant(changes._id !== this._original._id, 'id is not the same!!');
      changes.version = this.version;
      return retry(this._original, changes, this._update.bind(this), retryCount);
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
  get id() { return this.get('_id'); }

  _update(data) {
    return this._transport.put({
      path: this._path,
      data: data
    });
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

module.exports = {RestResourceList, RestResource};
