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
   * Manage hw informations
   * @example
   * doc
   *  .hw.sn('123')
   *  .hw.imei('12334')
   *  .hw.firmware.name('aa')
   *  .hw.firmware.version('1.0.0')
   * @return {Object}
   */
  get hw() {
    const self = this;
    const hw = {
      get firmware() {
        return {
          name: function name(value) { return this.getOrSet('hw.firmware.name', value); }.bind(self),
          version: function version(value) {
            return this.getOrSet('hw.firmware.version', value); }.bind(self)
        }
      },
      sn: function sn(value) { return this.getOrSet('hw.sn', value); }.bind(this),
      imei: function imei(value) { return this.getOrSet('hw.imei', value); }.bind(this),
      id: function id(value) { return this.getOrSet('hw.id', value); }.bind(this)
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
   *  @return {{site: (function(this:Resource)), country: (function(this:Resource)),
   *  city: (function(this:Resource)), address: (function(this:Resource)), postcode:
   * (function(this:Resource)), room: (function(this:Resource)), subRoom:
   * (function(this:Resource)), geo: (function(this:Resource))}} Location object
   */
  get location() {
    const loc = {
      site: function site(value) { return this.getOrSet('location.site', value); }.bind(this),
      country: function country(value) { return this.getOrSet('location.country', value); }.bind(this),
      city: function city(value) { return this.getOrSet('location.city', value); }.bind(this),
      address: function address(value) { return this.getOrSet('location.address', value); }.bind(this),
      postcode: function postcode(value) { return this.getOrSet('location.postcode', value); }.bind(this),
      room: function room(value) { return this.getOrSet('location.room', value); }.bind(this),
      subRoom: function subRoom(value) { return this.get('location.subRoom', value); }.bind(this),
      geo: function geo(value) { return this.getOrSet('location.geo', value); }.bind(this)
    };
    return loc;
  }
}

module.exports = Resource;
