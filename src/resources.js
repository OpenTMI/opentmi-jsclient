// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');


// application modules
const Resource = require('./resource');
const {QueryBase, Collection, notImplemented} = require('./utils');

/**
 * @class ResourcesQuery
 */
class ResourcesQuery extends QueryBase {
  /* Find resources by id
   * @param {string} type
   * @return {Query}
   */
  id(id) {
    invariant(_.isString(id), 'id should be a string');
    return this.has({_id: id});
  }

  /**
   * Resource has parent
   * @param {String} id - optional parent resource id
   * @return {MongooseQueryClient}
   */
  hasParent(id = undefined) {
    if (_.isUndefined(id)) {
      return this.has({parent: {$exists: true}});
    }
    return this.has({parent: id});
  }

  /**
   * Resource doesn't have parent
   * @return {MongooseQueryClient}
   */
  hasNoParent() {
    return this.has({parent: {$exists: false}});
  }

  /**
   * Find resources with type
   * @param {string} type
   * @return {Query}
   */
  name(name) {
    invariant(_.isString(name), 'type should be a string');
    return this.has({name});
  }
  /**
   * Find resources by type
   * @param {string} type
   * @return {Query}
   */
  type(type) {
    invariant(_.isString(type), 'type should be a string');
    return this.has({type});
  }

  /**
   * Find resources by status
   * @param {string} status
   * @return {Query}
   */
  status(status) {
    const STATUS = ['active', 'maintenance', 'broken'];
    invariant(_.contains(STATUS, status), `Status is not one of ${STATUS.join(', ')}`);
    return this.has({status: {value: status}});
  }

  /**
   * Find resources by usage type
   * @param {String} usageType
   * @return {MongooseQueryClient}
   */
  usageType(usageType) {
    invariant(_.isString(usageType), 'usageType should be a string');
    return this.has({usage: {type: usageType}});
  }

  /**
   * Find resources by a tag
   * @param {string} tag
   * @param {bool} isTrue - optional - default: true
   * @return {Query}
   */
  haveTag(tag, isTrue = true) {
    invariant(_.isBoolean(isTrue), 'isTrue should be a boolean');
    return this.has({tags: {tag: isTrue}});
  }

  /**
   * Find resources by multiple tags
   * @param {array<String>} tags
   * @return {Query}
   */
  haveTags(tags) {
    invariant(_.isArray(tags), 'tags should be an array');
    return _.reduce(tags, this.haveTag.bind(this), this);
  }
}


class Resources extends Collection {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/resources');
    this._notImplemented = notImplemented();
  }

  /**
   * Find Resources
   * @return {ResourcesQuery}
   */
  find() {
    return new ResourcesQuery(this, Resource);
  }

  /**
   * Update documents
   * @return {*}
   */
  update() {
    return this._notImplemented();
  }
}

module.exports = Resources;
