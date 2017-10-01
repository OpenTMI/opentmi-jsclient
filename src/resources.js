// 3rd party modules
const invariant = require('invariant');
const _ = require('lodash');
// application modules
const {Query, RestResource} = require('./utils');

class ResourcesQuery extends Query {
  /**
   * Find resources with type
   * @param {string} type
   * @return {Query}
   */
  type(type) {
    invariant(_.isString(type), 'type should be a string');
    return this.has({type});
  }

  /**
   * Resource status should be
   * @param {string} status
   * @return {Query}
   */
  status(status) {
    const STATUS = [];
    invariant(_.contains(STATUS, status), `Status is not one of ${STATUS.join(', ')}`);
    return this.has({status});
  }

  /**
   * resource have tag
   * @param {string} tag
   * @param {bool} isTrue - optional - default: true
   * @return {Query}
   */
  haveTag(tag, isTrue = true) {
    invariant(_.isBoolean(isTrue), 'isTrue should be a boolean');
    return this.this.has({tags: {tag: isTrue}});
  }

  /**
   * Resource has multiple tags
   * @param {array<String>} tags
   * @return {Query}
   */
  haveTags(tags) {
    invariant(_.isArray(tags), 'tags should be an array');
    return _.reduce(tags, this.haveTag.bind(this), this);
  }
}


class Resources extends RestResource {
  /**
   * Constructor for Resources model
   * @param {Client} client - client object
   */
  constructor(client) {
    super(client, '/api/v0/resources');
  }
}

Resources.Query = ResourcesQuery;

module.exports = Resources;
