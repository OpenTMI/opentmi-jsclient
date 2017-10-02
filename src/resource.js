const invariant = require('invariant');
const _ = require('lodash');
// application modules
const {retry, RestResource} = require('./utils');


class Resource extends RestResource {
  constructor(transport, resourceJson) {
    super(transport, `/api/v0/resources/${resourceJson._id}`);
    this._original = _.cloneDeep(resourceJson);
    this._resource = resourceJson;
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
    return `${this.id}: ${this.name}`;
  }

  /**
   * get changes as json object
   * @return {object}
   */
  getChanges() {
    return _.difference(this._original, this._resource);
  }

  /**
   * true when there is changes
   * @return {boolean}
   */
  isDirty() {
    return !_.isEmpty(this.getChanges());
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
      changes.version = this.version;
      return retry(this._original, changes, this.update.bind(this), retryCount);
    }
    return Promise.reject(new Error('no changes'));
  }

  /**
   * Data version
   * @return {number}
   */
  get version() { return _.get(this._original, '__v'); }

  /**
   * Get resource identity
   * @return {string}
   */
  get id() { return this._resource._id; }

  /**
   * Get resource name
   * @return {string}
   */
  get name() { return this._resource.name; }

  get location() {
    const loc = {
      get site() { return _.get(this._resources, 'location.site'); },
      get country() { return _.get(this._resources, 'location.country'); },
      get city() { return _.get(this._resources, 'location.city'); },
      get address() { return _.get(this._resources, 'location.address'); },
      get postcode() { return _.get(this._resources, 'location.postcode'); },
      get room() { return _.get(this._resources, 'location.room'); },
      get subRoom() { return _.get(this._resources, 'location.subRoom'); },
      get geo() { return _.get(this._resources, 'location.geo'); }
    }.bind(this);
    return loc;
  }

  /**
   * set resource name
   * @param {string} name - new name for resource
   * @return {Resource}
   */
  setName(name) {
    invariant(_.isString(name), 'name should be a string');
    _.merge(this._resource, {name});
    return this;
  }
}

module.exports = Resource;
