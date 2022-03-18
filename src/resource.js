// application modules
const {Document} = require('./utils');


class Resource extends Document {
  /**
   * Manage single resource
   * @param {Transport} transport - transport layer
   * @param {object} resourceJson - plain json object
   */
  constructor(transport, resourceJson) {
    super(transport, '/api/v0/resources', resourceJson);
  }

  /**
   * Get resource info as short string
   * @return {string} single line of resource data
   */
  toString() {
    return `${this.id}: ${this.name()}`;
  }

  /**
   * Get resource name or set it
   * @param {String}value resource name
   * @return {string|Resource} resource name or Resource object
   */
  name(value) { return this.getOrSet('name', value); }

  /**
   * Get resource type of set it
   * @param {String}value resource type
   * @return {Resource|String} resource type of Resource object
   */
  type(value) { return this.getOrSet('type', value); }

  /**
   * Manage status properties
   * @example
   *   // set status
   *   doc
   *    .status.value('broken')
   *    .status.note('does not work anymore')
   *  @return {Object} Status object
   */
  get status() {
    const status = {
      value: function type(value) { return this.getOrSet('status.value', value); }.bind(this),
      note: function note(value) { return this.getOrSet('status.note', value); }.bind(this),
      availability: function availability(value) { return this.getOrSet('status.availability', value); }.bind(this)
    };
    return status;
  }

  /**
   * Manage item properties
   * @example
   *   // set item model
   *   doc
   *    .item.model('ABC')
   *  @return {Object} Item object
   */
  get item() {
    const item = {
      model: function type(value) { return this.getOrSet('item.model', value); }.bind(this)
    };
    return item;
  }

  /**
   * Manage hw informations
   * @example
   * doc
   *  .hw.sn('123')
   *  .hw.imei('12334')
   *  .hw.firmware.name('aa')
   *  .hw.firmware.version('1.0.0')
   * @return {Object} hardware object
   */
  get hw() {
    const self = this;
    const hw = {
      get firmware() {
        return {
          name: function name(value) { return this.getOrSet('hw.firmware.name', value); }.bind(self),
          version: function version(value) {
            return this.getOrSet('hw.firmware.version', value);
          }.bind(self)
        };
      },
      sn: function sn(value) { return this.getOrSet('hw.sn', value); }.bind(this),
      imei: function imei(value) { return this.getOrSet('hw.imei', value); }.bind(this),
      id: function id(value) { return this.getOrSet('hw.id', value); }.bind(this)
    };
    return hw;
  }
  /**
   * Manage location information
   * @example
   *   // set site and country
   *   doc
   *    .location.site('oulu')
   *    .location.country('finland')
   *  @return {Object} Location object
   */
  get location() {
    const loc = {
      site: function site(value) { return this.getOrSet('location.site', value); }.bind(this),
      country: function country(value) { return this.getOrSet('location.country', value); }.bind(this),
      city: function city(value) { return this.getOrSet('location.city', value); }.bind(this),
      address: function address(value) { return this.getOrSet('location.address', value); }.bind(this),
      postcode: function postcode(value) { return this.getOrSet('location.postcode', value); }.bind(this),
      room: function room(value) { return this.getOrSet('location.room', value); }.bind(this),
      subRoom: function subRoom(value) { return this.getOrSet('location.subRoom', value); }.bind(this),
      geo: function geo(value) { return this.getOrSet('location.geo', value); }.bind(this)
    };
    return loc;
  }

  /**
   * Manage usage properties
   * @example
   *   // set usage type
   *   doc
   *    .usage.type('automation')
   *    .usage.note('finland')
   *  @return {Object} Usage object
   */
  get usage() {
    const usage = {
      type: function type(value) { return this.getOrSet('usage.type', value); }.bind(this),
      group: function note(value) { return this.getOrSet('usage.group', value); }.bind(this)
    };
    return usage;
  }

  /**
   * Manage network properties
   * @example
   *   // set network hostname
   *   doc
   *    .network.hostname('localhost')
   *  @return {Object} Usage object
   */
  get network() {
    const network = {
      hostname: function hostname(value) { return this.getOrSet('network.hostname', value); }.bind(this),
      domain: function domain(value) { return this.getOrSet('network.domain', value); }.bind(this)
    };
    return network;
  }
}

module.exports = Resource;
