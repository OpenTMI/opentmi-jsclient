// 3rd party modules
const _ = require('lodash');
const Promise = require('bluebird');
const invariant = require('invariant');

// application modules
const {Document} = require('./utils');
const Resource = require('./resource');


class Event extends Document {
  /**
   * Constructor for Resources model
   * @param {Transport} transport - Transport object
   * @param {Object}eventJson User data as plain json object
   */
  constructor(transport, eventJson) {
    super(transport, `/api/v0/events`, eventJson);
  }

  /**
   * Get resource info as short string
   * @return {string} user information as single line
   */
  toString() {
    return `${this.priority()}.${this.facility()}: ${this.msg()}`;
  }

  static get PRIORITIES() {
    return ['emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug']
  }
  priority(value) {
    /**
     * Get event priority or set it
     * @param {String}value new name
     * @return {Item|string} returns item name or Item
     */
     if (value) invariant(Event.PRIORITIES.indexOf(value) >= 0, 'Not allowed priority');
     return this.getOrSet('priority.level', value);
  }
  emergency() {
    return this.priority('emerg');
  }
  alert() {
    return this.priority('alert');
  }
  critical() {
    return this.priority('crit');
  }
  error() {
    return this.priority('err');
  }
  warning() {
    return this.priority('warning');
  }
  notice() {
    return this.priority('notice');
  }
  info() {
    return this.priority('info');
  }
  debug() {
    return this.priority('debug');
  }

  static get FACILITIES() {
    return ['auth', 'cron', 'daemon', 'mail', 'news', 'syslog', 'user', 'resource', 'testcase'];
  }
  facility(value) {
    if (value) invariant(Event.FACILITIES.indexOf(value) >= 0, 'Not allowed facility');
    return this.getOrSet('priority.facility', value);
  }
  id(value) {
    // e.g. PID of the process
    return this.getOrSet('id', value);
  }
  msgid(value) {
    return this.getOrSet('msgid', value);
  }
  tag(value) {
    return this.getOrSet('tag', value);
  }
  msg(value) {
    return this.getOrSet('msg', value);
  }
}

module.exports = Event;
