// application modules
const {Document} = require('./utils');


class Resource extends Document {
  /**
   * Manage single resource
   * @param {Transport} transport - transport layer
   * @param {object} resourceJson - plain json object
   */
  constructor(transport, resourceJson) {
    super(transport, `/api/v0/resources/${resourceJson.id}`, resourceJson);
  }

  /**
   * Get resource info as short string
   * @return {string}
   */
  toString() {
    return `${this.id}: ${this.name()}`;
  }

  /**
   * Get resource name or set it
   * @return {string}
   */
  name(value) { return this.getOrSet('name', value); }

  /**
   * Manage location information
   * @example
   * // set site and country
   * doc
   *  .location.site('oulu')
   *  .location.country('finland')
   * @return {{site: (function(this:Resource)), country: (function(this:Resource)),
   * city: (function(this:Resource)), address: (function(this:Resource)), postcode:
   * (function(this:Resource)), room: (function(this:Resource)), subRoom:
   * (function(this:Resource)), geo: (function(this:Resource))}}
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
