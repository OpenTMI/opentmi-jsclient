// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');


// application modules
const Resource = require('./resource');
const {
  QueryBase, Collection, Document, notImplemented
} = require('./utils');

/**
 * @class ResourcesQuery
 */
class ResourcesQuery extends QueryBase {
  /* Find resources by id
   * @param {string} id
   * @return {MongooseQueryClient} returns this
   */
  id(id) {
    invariant(_.isString(id), 'id should be a string');
    return this.has({_id: id});
  }

  /**
   * Find resources by hwid
   * @param {String} id hardware id as a string
   * @return {ResourcesQuery} returns this
   */
  hwid(id) {
    invariant(_.isString(id), 'id should be a string');
    return this.has({'hw.id': id});
  }

  /**
   * Find resources by serial number
   * @param {String}sn hardware serial number as a string
   * @return {ResourcesQuery} returns this
   */
  hwsn(sn) {
    invariant(_.isString(sn), 'sn should be a string');
    return this.has({'hw.sn': sn});
  }

  /**
   * Resource has parent
   * @param {String} id - optional parent resource id
   * @return {ResourcesQuery} returns this
   */
  hasParent(id = undefined) {
    if (_.isUndefined(id)) {
      return this.has({parent: {$exists: true}});
    }
    return this.has({parent: id});
  }

  /**
   * Resource doesn't have parent
   * @return {ResourcesQuery} returns this
   */
  hasNoParent() {
    return this.has({parent: {$exists: false}});
  }

  /**
   * Find resources with name
   * @param {string} name resource name
   * @return {ResourcesQuery} returns this
   */
  name(name) {
    invariant(_.isString(name), 'type should be a string');
    return this.has({name});
  }

  /**
   * Find resources by type
   * @param {string} type resource type
   * @return {ResourcesQuery} returns this
   */
  type(type) {
    invariant(_.isString(type), 'type should be a string');
    return this.has({type});
  }

  /**
   * Find resources by status
   * @param {string} status resource status. One of 'active', 'maintenance', 'broken'
   * @return {ResourcesQuery} returns this
   */
  status(status) {
    const STATUS = ['active', 'maintenance', 'broken'];
    invariant(STATUS.indexOf(status) >= 0, `Status '${status}' is not one of "${STATUS.join('", "')}"`);
    return this.has({status: {value: status}});
  }

  /**
   * Find resources by usage type
   * @param {String} usageType resource usage type
   * @return {ResourcesQuery} returns this
   */
  usageType(usageType) {
    invariant(_.isString(usageType), 'usageType should be a string');
    return this.has({usage: {type: usageType}});
  }

  /**
   * Find resources by a tag
   * @param {string} tag tag name
   * @param {bool} isTrue tag value, optional. default: true
   * @return {ResourcesQuery} returns this
   */
  haveTag(tag, isTrue = true) {
    invariant(_.isBoolean(isTrue), 'isTrue should be a boolean');
    const obj = {tags: {}};
    obj.tags[tag] = isTrue;
    return this.has(obj);
  }

  /**
   * Find resources by multiple tags
   * @param {array<String>} tags array of tag names
   * @return {ResourcesQuery} returns this
   */
  haveTags(tags) {
    invariant(_.isArray(tags), 'tags should be an array');
    return _.reduce(tags, (acc, tag) => this.haveTag(tag), this);
  }

  /**
   * Find resources by item.model
   * @param {string} model model
   * @return {ResourcesQuery} returns this
   */
  itemModel(model) {
    invariant(_.isString(model), 'model should be a string');
    return this.has({item: {model}});
  }
}


class Resources extends Collection {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - transport object
   */
  constructor(transport) {
    super(transport, '/api/v0/resources');
    this._notImplemented = notImplemented;
  }

  /**
   * Find Resources
   * @return {ResourcesQuery} returns Query object
   */
  find() {
    return new ResourcesQuery(this, Resource);
  }

  /**
   * Update documents
   * @return {Promise} not implemented
   */
  update() {
    return this._notImplemented();
  }

  /**
   * Create new Resource
   * @return {Resource} returns new resource
   */
  create() {
    const NewResource = Document.IsNewDocument(Resource);
    return new NewResource(this._transport);
  }
}

module.exports = Resources;
